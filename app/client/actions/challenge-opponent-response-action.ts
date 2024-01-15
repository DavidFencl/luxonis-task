import {ClientState} from "../state/client-state";
import {encodeMessage} from "../../utils/message-utils";
import {MessageTypeEnum} from "../../model/message-types";

export function challengeOpponentResponseAction(response: boolean) {
    if (response === undefined) {
        console.error(`Please write down response as [YN]`)
        return;
    }

    const gameId = ClientState.getClientState().getGameInvitationId() as number;

    ClientState.getClientState()
        .getSocketSafe()
        .write(encodeMessage(
            MessageTypeEnum.CHALLENGE_OPPONENT_OFFER_RESPONSE,
            [response, gameId])
        );

    if(response) {
        ClientState.getClientState().setActiveGameId(gameId, 'opponent');
        console.log('The game has started! You can now start guessing!');
    }
}