import { tool } from "@opencode-ai/plugin"
import { mkdirSync } from "fs"
import { join } from "path"

export default tool({
  description: "Create a timestamped research directory for RDI workflow",
  args: {
    shortName: tool.schema.string().describe("Short name for research (lowercase, underscores, numbers only)")
  },
  async execute(args) {
    const { shortName } = args
    
    // Validate short name format: must be lowercase, numbers, and underscores only
    const validPattern = /^[a-z0-9_]+$/
    if (!validPattern.test(shortName)) {
      throw new Error("Short name must be lowercase letters, numbers, and underscores only")
    }
    
    // Generate epoch timestamp
    const epoch = Math.floor(Date.now() / 1000)
    
    // Create directory path
    const researchDir = join(".opencode", "thoughts", `${epoch}_${shortName}`)
    
    // Create the directory
    mkdirSync(researchDir, { recursive: true })
    
    // Return the directory path
    return researchDir
  }
})
