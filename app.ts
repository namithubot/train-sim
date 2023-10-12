import * as readLine from 'node:readline/promises';
import { exit, stdin, stdout } from 'node:process';
import { Program } from './program';

/**
 * The main function is the starting point of the program.
 */
(async function main() {
    let program = new Program();
    const line = readLine.createInterface(stdin, stdout);
    console.info('Hello there!\nWelcome to the subway simulator\n');
    while (true) {
        const command = await line.question('Enter You Commnad Here > ');
        program.processCommand(command)
    }
}) ();