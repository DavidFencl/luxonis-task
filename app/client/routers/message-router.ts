import {decodeMessage} from "../../utils/mesasge-utils";
import {MessageTypeEnum} from "../../model/message-types";
import {
    challengeAccepted,
    challengeOffer,
    challengeRejected,
    guessFailed,
    guessMade,
    guessSuccessful,
    hint, logInSuccessful,
    logOpponentList
} from "../handlers/routing-handlers";
import {ClientState} from "../state/client-state";

export function routeMessage(message: string) {
    const [messageType, messageContent] = decodeMessage(message);

    switch (messageType) {
        case MessageTypeEnum.ERROR: {
            console.error(`An Error occurred - ${messageContent}`)
            break;
        }
        case MessageTypeEnum.LOG_IN_FAIL: {
            console.error('Log-In failed. Wrong password.')
            break;
        }
        case MessageTypeEnum.LOG_IN_SUCCESS: {
            if (messageContent) {
                logInSuccessful(messageContent[0] as number);
            }
            break;
        }
        case MessageTypeEnum.GET_OPPONENT_LIST: {
            logOpponentList(messageContent as number[] ?? [])
            break;
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT_ACK: {
            // Only log challenge sent text
            console.log(messageContent?.join(''));
            break;
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT_OFFER: {
            if (messageContent) {
                challengeOffer(messageContent[0] as number);
            }
            break;
        }
        case  MessageTypeEnum.CHALLENGE_REJECTED: {
            if (messageContent) {
                challengeRejected(messageContent[0] as number);
            }
            break;
        }
        case  MessageTypeEnum.CHALLENGE_ACCEPTED: {
            if (messageContent) {
                challengeAccepted(messageContent[0] as number, messageContent[1] as number);
            }
            break;
        }
        case  MessageTypeEnum.HINT: {
            if (messageContent) {
                hint(messageContent[1] as string);
            }
            break;
        }
        case MessageTypeEnum.OPPONENT_HAS_GUESSED: {
            if (messageContent) {
                guessMade(messageContent[0] as boolean, messageContent[1] as number, messageContent[2] as string);
            }
            break;
        }
        case MessageTypeEnum.GUESS_FAIL: {
            guessFailed();
            break;
        }
        case MessageTypeEnum.GUESS_SUCCESS: {
            guessSuccessful();
            break;
        }
        default: {
            console.error(`Unsupported message type - ${messageType}`)
            break;
        }
    }
}
