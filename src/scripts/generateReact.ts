import  { green } from 'chalk'
import { execSync } from 'child_process'
import { join } from 'path'
import { question } from 'readline-sync'

export const generateReact = (args: string[]) => {
    let projectName = args[1]
    if (args.length < 2) {
        projectName = question("Project name: ")
    }
    const projectPath = join(`./${projectName}`, "/")

    console.log(green("Create react app"))
    execSync(`npx create-react-app ${projectName} --template typescript`)

    console.log(green("Install node-sass for using scss"))
    execSync(`npm i -D node-sass`, { cwd: projectPath, stdio: 'inherit' })
}