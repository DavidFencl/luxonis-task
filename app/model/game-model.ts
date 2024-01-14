import {UserModel} from "./user-model";
import {generateId} from "../utils/utils";

export class GameModel {
    readonly id: number;
    readonly challenger: UserModel;
    readonly opponent: UserModel;
    readonly wordToGuess: string;
    private isAccepted: boolean = false;
    private guessAttempts: number = 0;


    constructor(challenger: UserModel, opponent: UserModel, wordToGuess: string) {
        this.id = generateId()
        this.challenger = challenger;
        this.opponent = opponent;
        this.wordToGuess = wordToGuess;
    }

    public getIsAccepted(): boolean {
        return this.isAccepted
    }

    setIsAccepted(value: boolean) {
        this.isAccepted = value;
    }

    getGuessAttempts(): number {
        return this.guessAttempts;
    }

    incrementGuessAttempts() {
        this.guessAttempts++;
    }
}