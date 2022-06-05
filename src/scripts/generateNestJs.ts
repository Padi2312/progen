import { green } from 'chalk'
import { execSync } from 'child_process'
import { join } from 'path'
import { question } from 'readline-sync'

export const generateNestJS = (args: string[]) => {
    let projectName = args[1]
    if (args.length < 2) {
        projectName = question("Project name: ")
    }
    console.log(green("Create NestJS app"))
    execSync(`npx @nestjs/cli new ${projectName}`)
}