import {ClientState} from "../state/client-state";
import {rl} from "../utils/rl";

export function logInSuccessful(id: number) {
    console.log(`Log-In success! Your id is ${id}. You can now start playing.`)
    ClientState.getClientState().setIsLoggedIn(true);
}

export function logOpponentList(opponentList: number[]) {
    if (opponentList.length === 0) {
        console.log('No available opponents')
        return;
    }

    console.log('Available opponents:')
    opponentList.forEach(opponentId => console.log(opponentId))
}

export function challengeOffer(gameId: number) {
    ClientState.getClientState().setGameInvitationId(gameId);

    console.log(`You have been challenged to a game. Do you want to play? [Y/N]`);
    rl.write('Answer: ')
}

export function challengeRejected(userId: number) {
    ClientState.getClientState().setGameInvitationId(null);

    console.log(`User ${userId} rejected your game offer.`)
}

export function challengeAccepted(userId: number, gameId: number) {
    ClientState.getClientState().setActiveGameId(gameId, 'challenger');

    console.log(`User ${userId} accepted your game offer! You can now write hints to guess your word.`)
}

export function hint(hint: string) {
    console.log(`Hint: ${hint}`)
}

export function guessMade(result: boolean, attempts: number, guess?: string) {
    if (result) {
        console.log(`Your opponent has guessed the word correctly in ${attempts} attempts! Game over.`)
    } else {
        console.log(`Your opponent didn't guess the word correctly. He tried to guess "${guess}". Total attempts: ${attempts}.`)
    }
}

export function guessSuccessful() {
    console.log('You guessed the word correctly!');
    ClientState.getClientState().setActiveGameId(null, null);
}

export function guessFailed() {
    console.log('You didn\'t guess the word correctly!');
}
