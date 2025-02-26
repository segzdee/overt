const fs = require("fs")
const path = require("path")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
}

// Configuration validation rules
const configRules = {
  "next.config.js": (content) => {
    try {
      const config = eval(`(${content})`)
      return {
        valid: typeof config === "object",
        message: typeof config === "object" ? "Valid Next.js configuration" : "Invalid configuration format",
      }
    } catch (err) {
      return { valid: false, message: `Invalid syntax: ${err.message}` }
    }
  },
  "package.json": (content) => {
    try {
      const pkg = JSON.parse(content)
      const issues = []

      if (!pkg.dependencies?.next) {
        issues.push("Missing Next.js dependency")
      }
      if (!pkg.scripts?.build) {
        issues.push("Missing build script")
      }
      if (!pkg.scripts?.dev) {
        issues.push("Missing dev script")
      }

      return {
        valid: issues.length === 0,
        message:
          issues.length === 0 ? "All required dependencies and scripts present" : `Issues found: ${issues.join(", ")}`,
      }
    } catch (err) {
      return { valid: false, message: `Invalid JSON: ${err.message}` }
    }
  },
}

// Required project structure
const requiredFiles = {
  root: ["next.config.js", "package.json", "tsconfig.json", ".env.local"],
  app: ["layout.tsx", "page.tsx", "error.tsx", "loading.tsx"],
  components: ["LoginCards.tsx", "market-updates.tsx"],
}

function checkFile(filePath) {
  console.log(`\n${colors.blue}Checking ${filePath}...${colors.reset}`)

  try {
    const fullPath = path.resolve(process.cwd(), filePath)
    const exists = fs.existsSync(fullPath)

    if (!exists) {
      console.error(`${colors.red}❌ ${filePath} not found${colors.reset}`)
      return false
    }

    // If file has validation rules, apply them
    const fileName = path.basename(filePath)
    if (configRules[fileName]) {
      const content = fs.readFileSync(fullPath, "utf8")
      const { valid, message } = configRules[fileName](content)

      if (valid) {
        console.log(`${colors.green}✅ ${filePath}: ${message}${colors.reset}`)
      } else {
        console.error(`${colors.red}❌ ${filePath}: ${message}${colors.reset}`)
        return false
      }
    } else {
      console.log(`${colors.green}✅ ${filePath} exists${colors.reset}`)
    }

    return true
  } catch (err) {
    console.error(`${colors.red}❌ Error checking ${filePath}: ${err.message}${colors.reset}`)
    return false
  }
}

function checkDependencies() {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
    const dependencies = {
      required: ["next", "react", "react-dom", "typescript"],
      recommended: ["eslint", "prettier", "@types/node", "@types/react"],
    }

    console.log("\nChecking dependencies...")

    dependencies.required.forEach((dep) => {
      const version = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
      if (!version) {
        console.error(`${colors.red}❌ Missing required dependency: ${dep}${colors.reset}`)
      } else {
        console.log(`${colors.green}✅ Found ${dep}@${version}${colors.reset}`)
      }
    })

    dependencies.recommended.forEach((dep) => {
      const version = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
      if (!version) {
        console.log(`${colors.yellow}⚠️  Missing recommended dependency: ${dep}${colors.reset}`)
      } else {
        console.log(`${colors.green}✅ Found ${dep}@${version}${colors.reset}`)
      }
    })
  } catch (err) {
    console.error(`${colors.red}❌ Error checking dependencies: ${err.message}${colors.reset}`)
  }
}

function simulateBuild() {
  console.log("\nSimulating Next.js build process...")

  let allFilesExist = true

  // Check root files
  console.log("\nChecking root directory...")
  requiredFiles.root.forEach((file) => {
    if (!checkFile(file)) allFilesExist = false
  })

  // Check app directory
  console.log("\nChecking app directory...")
  requiredFiles.app.forEach((file) => {
    if (!checkFile(`app/${file}`)) allFilesExist = false
  })

  // Check components
  console.log("\nChecking components directory...")
  requiredFiles.components.forEach((file) => {
    if (!checkFile(`components/${file}`)) allFilesExist = false
  })

  // Check dependencies
  checkDependencies()

  if (allFilesExist) {
    console.log(`\n${colors.green}✅ All necessary files are present. Build should succeed.${colors.reset}`)
    console.log("\nSimulating build steps:")

    const buildSteps = [
      "Checking validity of tsconfig.json",
      "Loading environment variables",
      "Compiling TypeScript",
      "Creating an optimized production build",
      "Collecting page data",
      "Generating static pages",
      "Optimizing images",
      "Compressing bundles",
      "Collecting build traces",
    ]

    buildSteps.forEach((step, index) => {
      console.log(`${colors.green}✅ ${step}${colors.reset}`)
    })

    console.log(`\n${colors.green}✅ Build simulation completed successfully!${colors.reset}`)
  } else {
    console.error(`\n${colors.red}❌ Some files are missing or invalid. Build may fail.${colors.reset}`)
    console.log("Please address the issues above before running the actual build.")
  }
}

// Run the simulation
simulateBuild()

