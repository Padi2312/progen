import chalk from "chalk"
import { typelist } from "./typelist"

export const listHelp = () => {
    console.log(chalk.yellow("Here's your help!\n"))
    console.log(chalk.yellow("π  List of possible typesπ "))
    typelist.forEach(it => {
        console.log(chalk.yellow("π", it))
    })

    console.log(chalk.yellow("\n\nπ» Usage: generate <type>"))
}