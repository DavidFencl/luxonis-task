import {ClientState} from "../state/client-state";
import {encodeMessage} from "../../utils/message-utils";
import {MessageTypeEnum} from "../../model/message-types";

export function hintAction(hint: string) {
    const client = ClientState.getClientState();
    client.getSocketSafe().write(encodeMessage(MessageTypeEnum.HINT, [client.getActiveGameId() as number, hint]))
}