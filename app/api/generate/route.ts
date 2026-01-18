import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Octokit } from "octokit";

// Initialize Groq client inside the handler or helper to avoid build-time errors if env var is missing

const octokit = new Octokit();

export async function POST(req: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY || "dummy-key", // Fallback for build time, will fail at runtime if invalid
    });

    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: "GitHub URL is required" },
                { status: 400 }
            );
        }

        // Parse owner and repo from URL
        const regex = /github\.com\/([^/]+)\/([^/]+)/;
        const match = url.match(regex);

        if (!match) {
            return NextResponse.json(
                { error: "Invalid GitHub URL format. Expected: github.com/owner/repo" },
                { status: 400 }
            );
        }

        const owner = match[1];
        const repo = match[2].replace(/.git$/, "");

        console.log(`Fetching data for: ${owner}/${repo}`); // Debug log

        // 1. Fetch repository file structure
        let fileStructure = "";
        let keyFilesContent = "";

        try {
            const { data: repoData } = await octokit.request('GET /repos/{owner}/{repo}', {
                owner,
                repo,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            const defaultBranch = repoData.default_branch;

            const { data: treeData } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1', {
                owner,
                repo,
                tree_sha: defaultBranch,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            const files = treeData.tree.map((item: any) => item.path);
            fileStructure = files.slice(0, 200).join("\n");
            if (files.length > 200) fileStructure += "\n...(more files)...";

            const targetFiles = ["package.json", "requirements.txt", "go.mod", "Cargo.toml", "pyproject.toml"];

            for (const file of targetFiles) {
                if (files.includes(file)) {
                    try {
                        const { data: fileData } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                            owner,
                            repo,
                            path: file,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28'
                            }
                        });

                        if (!Array.isArray(fileData) && fileData.type === 'file' && fileData.content) {
                            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                            keyFilesContent += `\n--- ${file} ---\n${content}\n`;
                        }
                    } catch (e) {
                        console.error(`Failed to fetch ${file}`, e);
                    }
                }
            }

        } catch (e: any) {
            console.error("GitHub API Error Details:", e); // Enhanced logging
            const errorMessage = e.status === 404
                ? "Repository not found or private. Please ensure the repository is public."
                : `GitHub API Error: ${e.message}`;

            return NextResponse.json({ error: errorMessage }, { status: e.status || 500 });
        }

        const prompt = `---
agent: 'agent'
description: 'Create a comprehensive README.md file for the project'
---

## Role

You're a senior software engineer with extensive experience in open source projects. You create appealing, informative, and easy-to-read README files.

## Task

1. Review the entire project workspace and codebase
2. Create a comprehensive README.md file following a specific professional format.

## Required Sections & Format

The README **MUST** include the following sections in this order (adapt content to the specific project):

1.  **Project Title** & **Description** (What it does, Why it's useful)
    *   **What the project does**: Clear project title and description
    *   **Why the project is useful**: Key features and benefits
2.  **Project Structure**
    *   Generate a tree-like structure of the main folders/files with brief comments explaining their purpose.
    *   Example format:
        \`\`\`text
        .
        ├── app/                # Application core logic
        ├── config/             # Configuration files
        └── ...
        \`\`\`
3.  **Getting Started / Local Development**
    *   Step-by-step guide to run the project locally.
    *   Include necessary commands (e.g., \`npm install\`, \`npm run dev\`, \`python app.py\`).
4.  **Deployment / Hosting**
    *   Instructions on how to deploy this specific type of application (e.g., Vercel for Next.js, Docker for containers, etc.).
    *   If specific deployment configuration exists (like \`vercel.json\` or \`Dockerfile\`), reference it.
5.  **Useful CLI Commands** (if applicable)
    *   List helpful commands for common tasks (testing, building, linting).
    *   Include "Ignore Zip Files" or "Image Optimization" tips ONLY if relevant to the project technology.
6.  **Support & Contribution**
    *   **Where users can get help**: Support resources and documentation links
    *   **Who maintains and contributes**: Maintainer information and contribution guidelines
7.  **Contact & Last Updated**
    *   Include a footer with "Last Updated On : [Current Date]"
    *   "Email : [Maintainer Email or 'contact@example.com']"

## Guidelines

### Content and Structure

- Focus only on information necessary for developers to get started using and contributing to the project
- Use clear, concise language and keep it scannable with good headings
- Include relevant code examples and usage snippets
- Add badges for build status, version, license if appropriate
- Keep content under 500 KiB (GitHub truncates beyond this)
- **Do NOT use Emojis.**

### Technical Requirements

- Use GitHub Flavored Markdown
- Use relative links (e.g., \`docs/CONTRIBUTING.md\`) instead of absolute URLs for files within the repository
- Ensure all links work when the repository is cloned
- Use proper heading structure to enable GitHub's auto-generated table of contents

### What NOT to include

Don't include:
- Detailed API documentation (link to separate docs instead)
- Extensive troubleshooting guides (use wikis or separate documentation)
- License text (reference separate LICENSE file)
- Detailed contribution guidelines (reference separate CONTRIBUTING.md file)

Analyze the project structure, dependencies, and code to make the README accurate, helpful, and focused on getting users productive quickly.

---
Project Context:
Project: ${owner}/${repo}
File Structure (partial):
${fileStructure}

Key Dependency Files:
${keyFilesContent}
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        const readmeContent = completion.choices[0]?.message?.content || "";

        return NextResponse.json({ readme: readmeContent });
    } catch (error: any) {
        console.error("Error generating README:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
