import chalk from 'chalk';
import { exit } from 'process';
import { generateModule } from './scripts/generateModule';
import { generateNestJS } from './scripts/generateNestJs';
import { generateReact } from './scripts/generateReact';
import { listHelp } from './scripts/listHelp';

const proncli = async () => {

    //Remove first two args (the running process and directory)
    const args: string[] = process.argv.slice(2)
    let type = args[0]
    if (type === undefined) {
        console.error(chalk.red("Please provide a type"))
        exit(1)
    }


    switch (type) {
        case "help":
            listHelp()
            exit(1)

        case "module":
            generateModule(args)
            break;

        case "react":
            generateReact(args)
            break;

        case "nest":
            generateNestJS(args)
            break;

        default:
            console.error(chalk.red(`Type <${type}> not found.\n`))
            listHelp()
            exit(1)
    }
    console.log(chalk.greenBright("\n \nFINISHED! Happy Coding.😊"))
    exit(0)
}

proncli()
