---
description: Research phase - explore and understand the codebase
model: anthropic/claude-opus-4-5
---

# Codebase Research

You are conducting comprehensive research across the codebase to understand the current implementation before making changes.

## Initial Response

When this command is invoked, respond with:

```
I'll research your codebase to understand the current implementation.

Please provide:
1. What feature or area you want to understand
2. A short name for this research (lowercase, underscores, e.g., "dark_mode_toggle")
3. Specific files or components to focus on (if known)

I'll explore the codebase and save detailed findings to a research document.
```

Then wait for the user's research query and short name.

## Research Process

1. **Get short name from user** for the research topic (e.g., "user_auth", "dark_mode", "api_refactor")

2. **Check for codebase context using tool**:
   
   Use the `check-codebase` tool to determine if the current directory contains a codebase.
   This prevents searching across the entire computer.
   
   The tool checks for:
   - Project files (package.json, Cargo.toml, go.mod, etc.)
   - Source directories (src/, lib/, pkg/, etc.)
   - Source code files (*.ts, *.js, *.py, *.go, *.rs, *.java, *.rb, *.php, *.c, *.cpp, and many more)
   
   The tool returns "true" if a codebase exists, "false" otherwise.

3. **Capture git context** (if in a git repository):
   
   Use the `git-context` tool to capture the current development state:
   - Current branch name
   - Recent commits (last 5-10 showing recent development activity)
   - Uncommitted changes (files modified but not committed)
   - Diff statistics (which files are actively being worked on)
   
   This context helps understand:
   - What's already in progress
   - Recent development patterns and focus areas
   - Whether there are pending changes that might conflict
   - Team activity and collaboration context
   
   Store this information to include in research.md.

4. **Create research directory using tool**:
   
   Use the `create-research-dir` tool with the short name provided by the user.
   This creates `.opencode/thoughts/{epoch}_{short_name}/` and returns the path.
   Store the returned directory path for saving research.md.

5. **Determine research mode**:
   - If `check-codebase` returns "true": Proceed with codebase research (search ONLY in current working directory)
   - If `check-codebase` returns "false": Use webfetch for research instead of file searches
   - NEVER search in parent directories or other locations on the computer

6. **Read any mentioned files completely** (only if codebase exists):
   - Use Read tool WITHOUT limit/offset parameters
   - Get full context before spawning sub-tasks

7. **Create research plan** using TodoWrite:
   - List areas to investigate
   - Track exploration progress

8. **Spawn parallel research agents** (only if codebase exists) by @mentioning them:

   **CRITICAL: All searches must be restricted to current working directory only!**

   **Find WHERE files live**:
   
   @codebase-locator Find all files related to [feature/component] in the current working directory only.
   Do NOT search parent directories or other locations.
   Focus on: implementation files, tests, configuration, and type definitions.
   Return file paths grouped by purpose.

   **Understand HOW it works**:
   
   @codebase-analyzer Analyze how [specific feature] is currently implemented in the current working directory.
   Do NOT search parent directories or other locations.
   Trace the data flow, identify key functions, and document patterns.
   Include file:line references.

   **Discover PATTERNS to follow**:
   
   @codebase-pattern-finder Find examples of similar features or patterns in the current working directory only.
   Do NOT search parent directories or other locations.
   Look for: naming conventions, testing approaches, and integration patterns.
   Document what exists.

8a. **Alternative: Web-based research** (only if codebase does not exist):

   Use webfetch tool to research the topic:
   Search for [topic]: best practices, implementation approaches, common patterns.
   Look for: official documentation, tutorials, example implementations.

8b. **Optional: External repository research** (for learning from reference implementations):

   Use repo-explorer tools to analyze similar projects on GitHub:
   
   **When to use**:
   - Local codebase lacks examples of the pattern you need
   - Want to study industry best practices
   - Need reference implementations from mature projects
   - Learning how popular libraries solve similar problems
   
   **Available tools**:
   - `repo_clone` - Clone example repository to `~/.opencode-repos/` for study
   - `repo_structure` - Get directory layout of reference project
   - `repo_search` - Find similar implementations using ripgrep
   - `repo_exports` - Understand public API design patterns
   - `repo_deps` - Analyze dependency choices in successful projects
   - `repo_hotspots` - Find actively developed areas (frequent changes, TODOs)
   - `repo_find` - Locate files by pattern
   - `repo_file` - Read specific files from cloned repos
   
   **Example searches**:
   - Authentication patterns → Study auth libraries (e.g., "authjs/core", "lucia-auth/lucia")
   - API design → Analyze REST API frameworks (e.g., "fastapi/fastapi", "nestjs/nest")
   - Testing strategies → Clone test frameworks (e.g., "vitest-dev/vitest", "testing-library/react-testing-library")
   - State management → Study state libraries (e.g., "pmndrs/zustand", "reduxjs/redux-toolkit")
   
   **Cleanup**: Use `repo_cleanup` to remove cloned repos when done.
   
   Document findings from external repos as reference material in research.md.

9. **Wait for all agents to complete**

10. **Write research.md** to the research directory path returned by `create-research-dir`:

```markdown
# Research: [Topic Name]

**Date**: [Current date and time]
**Epoch**: [Epoch timestamp]
**Research ID**: [epoch]_[short_name]

## Research Question

[Original user query - what they wanted to understand]

## Git Context

**Branch**: [current branch name from git-context, or "N/A" if not a git repo]
**Recent Activity**: [summary of last 3-5 commits showing recent development focus]
**Uncommitted Changes**: [list of modified files, or "none" if clean]
**Active Development Areas**: [files with most changes from diff stats]

This context shows what the team has been working on recently and helps identify:
- Related ongoing work that might be relevant
- Files that are actively being modified
- Development patterns and conventions being followed
- Potential conflicts or dependencies to be aware of

## Summary

[High-level overview of findings - 2-3 paragraphs answering the research question]

## Current State

### Architecture Overview
[How the current system is architected]

### Key Components

#### [Component 1 Name]
**Location**: `path/to/file.*:line`
**Purpose**: [What this component does]
**Key Functions**:
- `functionName()` at line X - [What it does]
- `anotherFunction()` at line Y - [What it does]

#### [Component 2 Name]
**Location**: `path/to/file.*:line`
**Purpose**: [What this component does]

### Data Flow

1. **Input**: [Where data comes from]
2. **Processing**: [How data is transformed]
   - Step 1: [What happens] (`file.*:123`)
   - Step 2: [What happens] (`file.*:145`)
3. **Output**: [Where data goes]

## Relevant Files

### Implementation Files
- `path/to/file.*:123` - [What this file does]
- `path/to/service.*:45` - [What this file does]
- `path/to/model.*:12` - [What this file does]

### Test Files
- `path/to/test_file.*:12` - [What this tests]
- `path/to/integration_test.*:34` - [What this tests]

### Configuration Files
- `config/settings.json` - [What this configures]
- `.env.example` - [Environment variables needed]

### Type Definitions
- `types/feature.*:10` - [Type definitions/interfaces/protocols]

## Patterns and Conventions

### Naming Conventions
- [Pattern 1]: [How it's used]
- [Pattern 2]: [How it's used]

### Code Patterns Found

#### Pattern: [Pattern Name]
**Used in**: [File references]
**Description**: [How this pattern works]

```[language]
// Example from path/to/file.*:123-145
[code snippet showing the pattern]
```

**Variations**:
- [Variation A]: [When/where used]
- [Variation B]: [When/where used]

### Testing Patterns
- [How tests are structured]
- [Testing utilities used]
- [Common test patterns]

### Integration Patterns
- [How components connect]
- [How external services are used]
- [Common integration approaches]

## External Reference Implementations

[Include this section if you used repo-explorer to study external projects]

### Reference Project: [owner/repo]

**Purpose**: [Why this repo was studied]
**Relevant Patterns Found**: [What patterns/approaches were discovered]

**Key Files Analyzed**:
- `path/in/repo:line` - [What this shows]
- `another/file:line` - [What pattern this demonstrates]

**Insights**:
- [Learning 1]: [How they solve the problem]
- [Learning 2]: [Architectural decisions they made]
- [Learning 3]: [Patterns we could adopt]

**Dependencies Used**: [Key libraries they use that we might consider]

**Code Example**:
```[language]
// From [owner/repo] - [file path]
[relevant code snippet showing their approach]
```

**Applicability**: [How this could be adapted to our codebase]

## Dependencies

### Internal Dependencies
- [Component A] depends on [Component B] (`file:line`)
- [Service X] uses [Utility Y] (`file:line`)

### External Dependencies
- **[Library/Package Name]** - [How it's used, why it's needed]
- **[Another Library]** - [Purpose and usage]

## State Management

[How state is managed in this area]
- State structure: [What the state looks like]
- State updates: [How state is modified]
- State location: `path/to/state.*:line`

## Error Handling

[How errors are handled in this area]
- Error types: [What errors are caught]
- Error handling: [How they're processed]
- Error location: `path/to/errors.*:line`

## Configuration

[How this feature/area is configured]
- Configuration files: [List of config files]
- Environment variables: [List of env vars]
- Runtime configuration: [How config is loaded/used]

## Key Discoveries

- ✓ [Important discovery 1]
- ✓ [Important discovery 2]
- ✓ [Important discovery 3]

## Constraints and Limitations

- [Constraint 1]: [Why this exists, impact]
- [Constraint 2]: [Why this exists, impact]

## Technical Debt (if any observed)

- [Technical debt item 1 - just document what exists, no judgment]
- [Technical debt item 2]

## Next Steps for Planning

Based on this research, when planning new features or changes in this area:

1. [Recommendation based on patterns found]
2. [Recommendation based on existing architecture]
3. [Recommendation based on conventions discovered]

## References

### Internal
- [Link to related documentation]
- [Link to relevant issues/tickets]
- [Link to similar implementations]

### External (if repo-explorer was used)
- Repository: [owner/repo] - [Cloned for reference, see ~/.opencode-repos/]
- Documentation: [Link to project docs]
- Specific files studied: [List of files from external repos]
```

11. **Present findings to user**:

**For codebase research (when check-codebase returns "true"):**
```
Research Complete!

I've documented my findings in:
.opencode/thoughts/[epoch]_[short_name]/research.md

Summary:
[2-3 sentence summary of key findings]

Key Files:
- `file1.ts:123` - [Brief description]
- `file2.ts:45` - [Brief description]

Ready to design a plan based on this research?
Use: /plan and provide the path to this research.md file.
```

**For web research (when check-codebase returns "false"):**
```
Research Complete!

I've documented my findings from web research in:
.opencode/thoughts/[epoch]_[short_name]/research.md

Summary:
[2-3 sentence summary of key findings from web]

Key Resources:
- [Resource 1] - [Brief description]
- [Resource 2] - [Brief description]

Ready to design a plan based on this research?
Use: /plan and provide the path to this research.md file.
```

## Important Guidelines

- **ALWAYS check for codebase context first** using the check-codebase tool
- **NEVER search outside current working directory** - this is critical!
- **ALWAYS create the research directory** with epoch timestamp using create-research-dir tool
- **ALWAYS write research.md** to the directory
- **Use parallel agent invocations** by @mentioning them (only if codebase exists)
- **Use webfetch for research** if no codebase exists
- Read files completely (no limit/offset)
- Include specific file:line references for codebase research
- Document patterns without critique
- Wait for ALL agents before synthesizing
- Present findings clearly with path to research.md
- Explicitly tell agents to search ONLY in current working directory

## Search Scope Safety

**CRITICAL**: To prevent searching across the entire computer:

1. **Always check for codebase presence** before doing file searches
2. **Only search in current working directory** when codebase exists
3. **Never use parent directory references** (like `../`) in searches
4. **Pass explicit instructions to agents** about search scope
5. **Use webfetch as fallback** when no local codebase exists

The research.md file will be consumed by the `/plan` command to create an implementation plan.
