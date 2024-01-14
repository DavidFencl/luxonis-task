import {ClientState} from "../state/client-state";
import {encodeMessage} from "../../utils/mesasge-utils";
import {MessageTypeEnum} from "../../model/message-types";

export function challengeOpponentAction(opponentId: number, wordToGuess :string) {
    if(opponentId === undefined || isNaN(opponentId)) {
        console.error(`Please write down opponent id`)
        return;
    }

    if(!wordToGuess || wordToGuess.length === 0) {
        console.error('Please write down a word for your opponent to guess.')
        return;
    }

    ClientState.getClientState()
        .getSocketSafe()
        .write(encodeMessage(MessageTypeEnum.CHALLENGE_OPPONENT, [opponentId, wordToGuess]))
}