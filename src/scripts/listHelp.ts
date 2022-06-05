import chalk from "chalk"
import { typelist } from "./typelist"

export const listHelp = () => {
    console.log(chalk.yellow("Here's your help!\n"))
    console.log(chalk.yellow("👉A list of possible types 📜"))
    typelist.forEach(it => {
        console.log(chalk.yellow("🔴", it))
    })
}