import {routeCliInputConnected, routeCliInputLoggedIn, routeCliInputUnconnected} from "../routers/cli-router";
import {ClientState} from "../state/client-state";
import {rl} from "../utils/rl";

/**
 * CLI input handler. It handles user input based on current user state - whether he's unconnected, connected or connected & logged-in..
 */
export function handleCliInput() {
    rl.once('line', (input) => {
        const response = ClientState.getClientState().getIsConnected()
            ? ClientState.getClientState().getIsLoggedIn()
                ? routeCliInputLoggedIn(input)
                : routeCliInputConnected(input.toString().trimEnd())
            : routeCliInputUnconnected(input.toString().trimEnd());

        if (response === 0) {
            handleCliInput();
        } else {
            console.error('Client exiting')
            process.exit();
        }
    });
}
