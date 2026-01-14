import { tool } from "@opencode-ai/plugin"
import { readdirSync, statSync, existsSync } from "fs"
import { join } from "path"

export default tool({
  description: "Check if current directory contains a codebase to prevent system-wide searches",
  args: {},
  async execute(args) {
    const cwd = process.cwd()
    
    try {
      // Check for project files (maxdepth 2)
      const projectFiles = [
        "package.json",
        "Cargo.toml",
        "go.mod",
        "requirements.txt",
        "Gemfile",
        "pom.xml",
        "build.gradle",
        "composer.json",
        "pyproject.toml",
        "setup.py",
        "CMakeLists.txt",
        "Makefile"
      ]
      
      for (const file of projectFiles) {
        if (existsSync(join(cwd, file))) {
          return "true"
        }
        // Check subdirectories (depth 2)
        try {
          const entries = readdirSync(cwd, { withFileTypes: true })
          for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('.')) {
              if (existsSync(join(cwd, entry.name, file))) {
                return "true"
              }
            }
          }
        } catch (e) {
          // Skip if can't read directory
        }
      }
      
      // Check for C#/.NET project files with wildcards
      try {
        const entries = readdirSync(cwd, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && (entry.name.endsWith('.csproj') || entry.name.endsWith('.sln'))) {
            return "true"
          }
        }
        // Check subdirectories for .csproj/.sln
        for (const entry of entries) {
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            try {
              const subEntries = readdirSync(join(cwd, entry.name), { withFileTypes: true })
              for (const subEntry of subEntries) {
                if (subEntry.isFile() && (subEntry.name.endsWith('.csproj') || subEntry.name.endsWith('.sln'))) {
                  return "true"
                }
              }
            } catch (e) {
              // Skip if can't read subdirectory
            }
          }
        }
      } catch (e) {
        // Skip if can't read directory
      }
      
      // Check for source directories (maxdepth 2)
      const sourceDirs = ["src", "lib", "pkg", "app", "components", "pages", "internal"]
      
      try {
        const entries = readdirSync(cwd, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isDirectory() && sourceDirs.includes(entry.name)) {
            return "true"
          }
          // Check subdirectories
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            try {
              const subEntries = readdirSync(join(cwd, entry.name), { withFileTypes: true })
              for (const subEntry of subEntries) {
                if (subEntry.isDirectory() && sourceDirs.includes(subEntry.name)) {
                  return "true"
                }
              }
            } catch (e) {
              // Skip if can't read subdirectory
            }
          }
        }
      } catch (e) {
        // Skip if can't read directory
      }
      
      // Check for source code files (maxdepth 3)
      const sourceExtensions = [
        '.ts', '.tsx', '.js', '.jsx',
        '.py', '.pyw',
        '.go',
        '.rs',
        '.java',
        '.kt', '.kts',
        '.rb',
        '.php',
        '.c', '.cpp', '.cc', '.h', '.hpp',
        '.cs',
        '.swift',
        '.m', '.mm',
        '.scala',
        '.clj', '.cljs',
        '.ex', '.exs',
        '.erl', '.hrl',
        '.r', '.R',
        '.jl',
        '.dart',
        '.lua',
        '.vim',
        '.sh', '.bash', '.zsh'
      ]
      
      const checkForSourceFiles = (dir: string, depth: number): boolean => {
        if (depth > 3) return false
        
        try {
          const entries = readdirSync(dir, { withFileTypes: true })
          
          for (const entry of entries) {
            if (entry.name.startsWith('.')) continue
            
            const fullPath = join(dir, entry.name)
            
            if (entry.isFile()) {
              for (const ext of sourceExtensions) {
                if (entry.name.endsWith(ext)) {
                  return true
                }
              }
            } else if (entry.isDirectory() && depth < 3) {
              if (checkForSourceFiles(fullPath, depth + 1)) {
                return true
              }
            }
          }
        } catch (e) {
          // Skip if can't read directory
        }
        
        return false
      }
      
      if (checkForSourceFiles(cwd, 1)) {
        return "true"
      }
      
      return "false"
      
    } catch (error) {
      // If we can't check, assume no codebase to be safe
      return "false"
    }
  }
})
