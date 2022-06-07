import chalk from "chalk"
import { typelist } from "./typelist"

export const listHelp = () => {
    console.log(chalk.yellow("Here's your help!\n"))
    console.log(chalk.yellow("📜  List of possible types📜 "))
    typelist.forEach(it => {
        console.log(chalk.yellow("👉", it))
    })

    console.log(chalk.yellow("\n\n💻 Usage: generate <type>"))
}