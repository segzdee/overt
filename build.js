const { execSync } = require("child_process")

console.log("Starting build process...")

try {
  // Run npm build
  console.log(execSync("npm run build").toString())
  console.log("Build completed successfully!")
} catch (error) {
  console.error("Build failed with error:", error.message)
  console.error("Error details:", error.stdout.toString())
}

