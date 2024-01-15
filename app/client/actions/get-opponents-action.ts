import {ClientState} from "../state/client-state";
import {encodeMessage} from "../../utils/message-utils";
import {MessageTypeEnum} from "../../model/message-types";

export function getOpponentsAction() {
    ClientState.getClientState()
        .getSocketSafe()
        .write(encodeMessage(MessageTypeEnum.GET_OPPONENT_LIST,))
}