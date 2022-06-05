import PackageJSON from '@schemastore/package'
import { green } from 'chalk'
import { execSync } from 'child_process'
import * as fs from 'fs'
import { join } from 'path'
import { question } from 'readline-sync'
import * as ts from 'typescript'
import { gitignore } from './../data/gitignore'
import launchJson from './../data/launch.json'

export const generateModule = async (args: string[]) => {
    let projectName = args[1]
    if (args.length < 2) {
        projectName = question("Project name: ")
    }
    const projectPath = join(`./${projectName}`, "/")
    const tsconfigPath = join(projectPath, "tsconfig.json")
    const launchJsonPath = join(projectPath, ".vscode", "launch.json")
    const srcFolder = join(`./${projectName}`, "src")
    const packageJsonPath = join(projectPath, "package.json")


    // Create project folder
    console.log(green("Create project folder"))
    execSync(`mkdir ${projectName}`)


    // Generate source folder and files
    console.log(green("Generating source folder and files"))
    execSync(`mkdir src`, { cwd: `./${projectName}`, })
    fs.writeFileSync(join(srcFolder, "index.ts"), 'utf-8')
    fs.writeFileSync(join(srcFolder, "dev.ts"), 'utf-8')


    // Copy .vscode folder for debugging
    console.log(green("Copy .vscode folder"))
    fs.mkdirSync(join(projectPath, ".vscode"))
    fs.writeFileSync(launchJsonPath, JSON.stringify(launchJson))

    //Generate .gitignore
    console.log(green("\nGenerate .gitignore file \n"))

    fs.writeFileSync(join(projectPath, ".gitignore"), gitignore)


    //Generate package.json
    console.log(green("\nType in your package.json infos. \n"))
    execSync(`npm init`, {
        cwd: projectPath,
        stdio: 'inherit'
    })


    // Generate and edit tsconfig.json    
    console.log(green("\nGenerating and editing tsconfig.json... \n"))
    execSync(`npx tsc --init`, { cwd: projectPath, stdio: 'inherit' })
    const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
    const parsedTsconfig = ts.parseJsonConfigFileContent(tsconfigFile.config, ts.sys, tsconfigPath)
    parsedTsconfig.raw.compilerOptions.outDir = "./dist";
    parsedTsconfig.raw.compilerOptions.rootDir = "./src";
    parsedTsconfig.raw.compilerOptions.baseUrl = "./";
    parsedTsconfig.raw.compilerOptions.declaration = true
    fs.writeFileSync(tsconfigPath, JSON.stringify(parsedTsconfig.raw))


    // Install dependencies
    console.log(green("\nDownloading dependencies... \n"))
    execSync(`npm i -D typescript ts-node-dev jest ts-jest rimraf @types/node`, { cwd: projectPath, stdio: 'inherit' })

    // Load package.json and setup scripts
    console.log(green("\nSetup package.json scripts... \n"))
    const packageJson: PackageJSON.CoreProperties = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJSON.CoreProperties
    const scripts = {
        "start": "tsnd --respawn --watch ./src/** src/dev.ts",
        "start:debug": "tsnd --respawn --inspect=4321 --watch ./src/** src/dev.ts",
        "prebuild": "rimraf ./dist",
        "build": "tsc",
        "test": "jest --coverage"
    }
    packageJson.scripts = scripts
    packageJson.main = "./dist/index.js"
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson))


    // Init git
    execSync("git init", { cwd: projectPath, stdio: 'inherit' })
    execSync("git add .", { cwd: projectPath, stdio: 'inherit' })
    execSync('git commit -m \"Initial Commit\"', { cwd: projectPath, stdio: 'inherit' })

}