import {helpActionConnected, helpActionLoggedIn, helpActionUnconnected} from "../actions/help-action";
import {connectOverTcpAction} from "../actions/connect-tcp-action";
import {connectIpcAction} from "../actions/connect-ipc-action";
import {getOpponentsAction} from "../actions/get-opponents-action";
import {challengeOpponentAction} from "../actions/challenge-opponent-action";
import {challengeOpponentResponseAction} from "../actions/challenge-opponent-response-action";
import {ClientState} from "../state/client-state";
import {hintAction} from "../actions/hint-action";
import {guessAction} from "../actions/guess-action";
import {logInAction} from "../actions/log-in-action";

/**
 * Function is used for routing user input to appropriate action when user isn't connected yet.
 * Actions:
 *
 *  Help
 *  Connect over TCP
 *  Connect over ICP
 *  Exit
 *
 * @param input - Input from console. Numeric string is expected. String isn't cast to number for sake of efficiency.
 * @return -1 if app should exit, 0 otherwise.
 */
export function routeCliInputUnconnected(input: string): number {
    switch (input) {
        case 'help' : {
            helpActionUnconnected();
            return 0;
        }
        case 'connect-tcp' : {
            connectOverTcpAction();
            return 0;
        }
        case 'connect-ipc' : {
            connectIpcAction()
            return 0;
        }
        case 'exit' : {
            return -1;
        }
        default: {
            console.error(`Unknown input ${input}!`)
            return 0;
        }
    }
}

/**
 * Function is used for routing user input to appropriate action whe user is connected.
 * Actions:
 *
 *  Help
 *  Connect over TCP
 *  Connect over ICP
 *   Exit
 *
 * @param input - Input from console. Numeric string is expected. String isn't cast to number for sake of efficiency.
 * @return -1 if app should exit, 0 otherwise.
 */
export function routeCliInputConnected(input: string): number {
    switch (input) {
        case 'help' : {
            helpActionConnected();
            return 0;
        }
        case input.match(/log-in */)?.input : {
            logInAction(input.split(' ')[1]);
            return 0;
        }
        case 'exit' : {
            return -1;
        }
        default: {
            console.error(`Unknown input ${input}!`)
            return 0;
        }
    }
}

/**
 * Function is used for routing user input to appropriate action whe user is connected.
 * Actions:
 *
 *  Help
 *  Connect over TCP
 *  Connect over ICP
 *   Exit
 *
 * @param input - Input from console. Numeric string is expected. String isn't cast to number for sake of efficiency.
 * @return -1 if app should exit, 0 otherwise.
 */
export function routeCliInputLoggedIn(input: string): number {
    switch (input) {
        case 'help' : {
            helpActionLoggedIn();
            return 0;
        }
        case 'opponents' : {
            getOpponentsAction()
            return 0;
        }
        case input.match(/challenge */)?.input : {
            // Split input by spaces
            // First substring is challenge keyword
            // Second substring should be userId of opponent
            // Last part of split array should be a word to be guessed by opponent
            const splitInput = input.split(' ');
            challengeOpponentAction(parseInt(splitInput[1]), splitInput.slice(2).join(' '))
            return 0;
        }
        case input.match(/Answer: [YN]/)?.input: {
            challengeOpponentResponseAction(input.split(' ')[1] === 'Y')
            return 0;
        }
        case input.match(/hint */)?.input: {
            if (ClientState.getClientState().hasActiveGame() && ClientState.getClientState().getRelationship() === 'challenger') {
                hintAction(input.split(' ').slice(1).join(' '))
            }

            return 0;
        }
        case input.match(/guess */)?.input: {
            if (ClientState.getClientState().hasActiveGame() && ClientState.getClientState().getRelationship() === 'opponent') {
                guessAction(input.split(' ').slice(1).join(' '))
            }

            return 0;
        }
        case 'exit' : {
            return -1;
        }
        default: {
            console.error(`Unknown input ${input}!`)
            return 0;
        }
    }
}

