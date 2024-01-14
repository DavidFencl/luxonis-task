import {ClientState} from "../state/client-state";

export function helpActionUnconnected() {
    console.log(`Supported actions:`)
    console.log(`connect-tcp - Connect to server over TCP`)
    console.log(`connect-ipc - Connect to server over IPC`)
    console.log(`exit - Exit`)
}

export function helpActionConnected() {
    console.log(`Supported actions:`)
    console.log(`log-in [PASSWORD] - Log in to application`)
    console.log(`exit - Exit`)
}
export function helpActionLoggedIn() {
    console.log(`Supported actions:`)
    console.log(`opponents - Get opponent list`)
    console.log(`challenge [OPPONENT_ID] [YOUR_WORD] - Challenge opponent`)
    console.log(`exit - Exit`)
    if(ClientState.getClientState().hasActiveGame() ) {
        ClientState.getClientState().getRelationship() === 'challenger'
        ? console.log('hint [HINT_TEXT] - Send hint to your opponent')
        : console.log('guess [GUESS_TEXT] - Try guessing the word.');
    }
}