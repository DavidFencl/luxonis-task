import {handleCliInput} from "./handlers/cli-handler";

console.log('Welcome to guess a word client! Write "help" for more info.');

// Infinite loop to collect user input from console. It is closed from handler.
handleCliInput();

