import {ClientState} from "../state/client-state";
import {encodeMessage} from "../../utils/message-utils";
import {MessageTypeEnum} from "../../model/message-types";

export function guessAction(guess: string) {
    const client = ClientState.getClientState();
    client.getSocketSafe().write(encodeMessage(MessageTypeEnum.GUESS, [client.getActiveGameId() as number, guess]))
}