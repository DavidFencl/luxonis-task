import {ClientState} from "../state/client-state";
import {encodeMessage} from "../../utils/mesasge-utils";
import {MessageTypeEnum} from "../../model/message-types";

export function logInAction(password: string) {
    ClientState.getClientState().getSocketSafe().write(encodeMessage(MessageTypeEnum.LOG_IN, [password]))
}