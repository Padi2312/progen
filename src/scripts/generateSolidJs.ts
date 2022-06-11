import { green } from 'chalk'
import { execSync } from 'child_process'
import { question } from 'readline-sync'

export const generateSolidJS = (args: string[]) => {
    let projectName = args[1]
    if (args.length < 2) {
        projectName = question("Project name: ")
    }
    console.log(green("Create SolidJS app"))
    execSync(`npx degit solidjs/templates/ts ${projectName}`)
}