import {MessageTypeEnum} from "../../model/message-types";
import {decodeMessage} from "../../utils/message-utils";
import {UserModel} from "../../model/user-model";
import {
    handleChallengeOpponent,
    handleChallengeResponse,
    handleGetOpponentList,
    handleGuess,
    handleHint, handleLogIn,
    sendErrorMessage
} from "../handlers/routing-handlers";

/**
 * Routing function used for routing incoming client messages.  Error is sent back to client if unsupported message type is provided.
 * @param message - Incoming encoded message
 * @param user - User who sent given message
 */
export function routeMessage(message: string, user: UserModel) {
    const [messageType, messageContent] = decodeMessage(message);
    const {socket} = user;

    switch (messageType as MessageTypeEnum) {
        case MessageTypeEnum.LOG_IN: {
            handleLogIn(user, socket, messageContent);
            return;
        }
        case MessageTypeEnum.GET_OPPONENT_LIST: {
            handleGetOpponentList(socket, user.id);
            return;
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT: {
            handleChallengeOpponent(user, messageContent);
            return;
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT_OFFER_RESPONSE: {
            handleChallengeResponse(user, messageContent);
            return;
        }
        case MessageTypeEnum.HINT: {
            handleHint(socket, messageContent);
            return;
        }
        case MessageTypeEnum.GUESS: {
            handleGuess(socket, messageContent);
            return;
        }
        default: {
            sendErrorMessage(socket, `Unsupported message type ${messageType}`);
            return;
        }
    }
}
