import PackageJSON from '@schemastore/package'
import { green } from 'chalk'
import { execSync } from 'child_process'
import * as fs from 'fs'
import { join } from 'path'
import { question } from 'readline-sync'
import * as ts from 'typescript'
import { launchJson } from '../data/lauchJson'
import { gitignore } from './../data/gitignore'

const createProject = (projectName: string, srcFolder: string) => {
    // Create project folder
    console.log(green("Create project folder"))
    execSync(`mkdir ${projectName}`)

    // Generate source folder and files
    console.log(green("Generating source folder and files"))
    execSync(`mkdir src`, { cwd: `./${projectName}`, })
    fs.writeFileSync(join(srcFolder, "index.ts"), 'utf-8')
    fs.writeFileSync(join(srcFolder, "dev.ts"), 'utf-8')
}

const addGitIgnoreAndVscodeFolder = (projectPath: string, launchJsonPath: string) => {
    // Copy .vscode folder for debugging
    console.log(green("Copy .vscode folder"))
    fs.mkdirSync(join(projectPath, ".vscode"))
    fs.writeFileSync(launchJsonPath, JSON.stringify(launchJson, null, 4))

    //Generate .gitignore
    console.log(green("\nGenerate .gitignore file \n"))
    fs.writeFileSync(join(projectPath, ".gitignore"), gitignore)
}

const generatePackageJson = (projectPath: string) => {
    //Generate package.json
    console.log(green("\nType in your package.json infos. \n"))
    execSync(`npm init`, {
        cwd: projectPath,
        stdio: 'inherit'
    })
}

const setupTsconfigJson = (projectPath: string, tsconfigPath: string) => {
    // Generate and edit tsconfig.json    
    console.log(green("\nGenerating and editing tsconfig.json... \n"))
    execSync(`npx tsc --init`, { cwd: projectPath, stdio: 'inherit' })
    const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
    const parsedTsconfig = ts.parseJsonConfigFileContent(tsconfigFile.config, ts.sys, tsconfigPath)
    parsedTsconfig.raw.compilerOptions.outDir = "./dist";
    parsedTsconfig.raw.compilerOptions.rootDir = "./src";
    parsedTsconfig.raw.compilerOptions.baseUrl = "./";
    parsedTsconfig.raw.compilerOptions.declaration = true
    fs.writeFileSync(tsconfigPath, JSON.stringify(parsedTsconfig.raw, null, 4))
}

const installDependencies = (projectPath: string) => {
    // Install dependencies
    console.log(green("\nDownloading dependencies... \n"))
    execSync(`npm i -D typescript ts-node-dev jest ts-jest rimraf @types/node`, { cwd: projectPath, stdio: 'inherit' })

}

const adaptPackageJson = (packageJsonPath: string) => {
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
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4))
}

const initGit = (projectPath: string) => {
    // Init git
    execSync("git init", { cwd: projectPath, stdio: 'inherit' })
    execSync("git add .", { cwd: projectPath, stdio: 'inherit' })
    execSync('git commit -m \"Initial Commit\"', { cwd: projectPath, stdio: 'inherit' })

}

export const generateModule = async (args: string[]) => {
    // Use argument as project name or ask for it
    let projectName = args[1]
    if (args.length < 2) {
        projectName = question("Project name: ")
    }

    // Paths
    const projectPath = join(`./${projectName}`, "/")
    const tsconfigPath = join(projectPath, "tsconfig.json")
    const launchJsonPath = join(projectPath, ".vscode", "launch.json")
    const srcFolder = join(`./${projectName}`, "src")
    const packageJsonPath = join(projectPath, "package.json")

    createProject(projectName, srcFolder)
    addGitIgnoreAndVscodeFolder(projectPath, launchJsonPath)
    generatePackageJson(projectPath)
    setupTsconfigJson(projectPath, tsconfigPath)
    installDependencies(projectPath)
    adaptPackageJson(packageJsonPath)
    initGit(projectPath)
}