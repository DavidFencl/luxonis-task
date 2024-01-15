import {MessageTypeEnum} from "../model/message-types";
import {MessageContentType} from "../model/message-content-type";

/**
 * Functions is used for encoding messages to used protocol
 * @param messageType - Type of message
 * @param messageContent - Optional message content. Array of string or numbers is expected.
 */
export function encodeMessage(messageType: MessageTypeEnum, messageContent?: MessageContentType): string {
    if (!messageContent || messageContent.length === 0) {
        return numberToBinary(messageType);
    } else {
        let messageEncoded = numberToBinary(messageType);

        for (const messageContentElement of messageContent) {
            if (typeof messageContentElement === 'number') {
                messageEncoded = messageEncoded.concat(' ').concat(numberToBinary(messageContentElement));
            } else if (typeof messageContentElement === 'string') {
                messageEncoded = messageEncoded.concat(' ').concat(stringToBinary(messageContentElement));
            } else {
                messageEncoded = messageEncoded.concat(' ').concat(boolToBinary(messageContentElement));
            }
        }

        return messageEncoded.trimEnd();
    }
}


/**
 * Decode binary message. Message type must be provided. Message content is optional and is parsed based on message type.
 * @param message - raw binary string to be parsed
 * @return messageType & optionally message content. Message content is undefined if no content has been parsed.
 */
export function decodeMessage(message: string): [MessageTypeEnum, MessageContentType | undefined] {
    const [messageTypeEncoded, ...messageContentEncoded] = message.split(' ');
    const messageType = binaryToNumber(messageTypeEncoded);

    return [messageType, decodeMessageContentByType(messageType, messageContentEncoded)]
}

/**
 * Functions parses message content based on message type. This message content doesn't have to be type checked.
 * @param type - Type of message to be parsed
 * @param messageContentEncoded - Message content to be parsed
 * @return parsed message content if type mapping for said type is known. Undefined otherwise.
 */
function decodeMessageContentByType(type: MessageTypeEnum, messageContentEncoded: string[] | undefined): MessageContentType | undefined {
    if (!messageContentEncoded || messageContentEncoded.length === 0) {
        return undefined;
    }

    switch (type) {
        case MessageTypeEnum.ERROR: {
            return [messageContentEncoded.map((encodedString: string) => binaryToString(encodedString)).join('')];
        }
        case MessageTypeEnum.LOG_IN: {
            return [messageContentEncoded.map((encodedString: string) => binaryToString(encodedString)).join('')];
        }
        case MessageTypeEnum.LOG_IN_SUCCESS: {
            return messageContentEncoded.map((encodedNumber: string) => binaryToNumber(encodedNumber));
        }
        case MessageTypeEnum.GET_OPPONENT_LIST: {
            return messageContentEncoded.map((encodedNumber: string) => binaryToNumber(encodedNumber));
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT: {
            // First element should be ID - number.
            // Remainder is the word to be guessed - string.
            const [firstPart, secondPart] = [messageContentEncoded[0], messageContentEncoded.slice(1).join(' ')]
            return [
                binaryToNumber(firstPart),
                binaryToString(secondPart)
            ]
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT_ACK: {
            return [messageContentEncoded.map((encodedString: string) => binaryToString(encodedString)).join('')];
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT_OFFER: {
            return messageContentEncoded.map((encodedNumber: string) => binaryToNumber(encodedNumber));
        }
        case MessageTypeEnum.CHALLENGE_OPPONENT_OFFER_RESPONSE: {
            // First element is response - boolean
            // Second element is gameId - number
            const [firstPart, secondPart] = [messageContentEncoded[0], messageContentEncoded.slice(1).join(' ')]
            return [
                binaryToBool(firstPart),
                binaryToNumber(secondPart)
            ]
        }
        case MessageTypeEnum.CHALLENGE_REJECTED:
        case MessageTypeEnum.CHALLENGE_ACCEPTED: {
            // First element is opponentId - number
            // Second element is gameId - number
            const [firstPart, secondPart] = [messageContentEncoded[0], messageContentEncoded.slice(1).join(' ')]
            return [
                binaryToNumber(firstPart),
                binaryToNumber(secondPart)
            ]
        }
        case MessageTypeEnum.GUESS:
        case MessageTypeEnum.HINT: {
            // First element is gameId - number
            // Second element is text - string
            const [firstPart, secondPart] = [messageContentEncoded[0], messageContentEncoded.slice(1).join(' ')]
            return [
                binaryToNumber(firstPart),
                binaryToString(secondPart)
            ]
        }
        case MessageTypeEnum.OPPONENT_HAS_GUESSED: {
            // First element is gameId - number
            // Second element is number of guesses - number
            // Last element is guessed word - string
            const [firstPart, secondPart, thirdPart] = [messageContentEncoded[0], messageContentEncoded[1], messageContentEncoded.slice(2).join(' ')]
            return [
                binaryToBool(firstPart),
                binaryToNumber(secondPart),
                binaryToString(thirdPart),
            ]
        }
        case MessageTypeEnum.LOG_IN_FAIL:
        case MessageTypeEnum.GUESS_FAIL:
        case MessageTypeEnum.GUESS_SUCCESS: {
            return undefined;
        }
        default: {
            console.error(`Unsupported message type ${type}!`)
            return undefined;
        }
    }
}

function numberToBinary(number: number): string {
    return number.toString(2);
}

function binaryToNumber(text: string): number {
    return parseInt(text, 2);
}

function stringToBinary(string: string): string {
    let binString = '';

    for (let i = 0; i < string.length; i++) {
        binString += string.charCodeAt(i).toString(2) + ' ';
    }

    return binString;
}

function binaryToString(text: string): string {
    return text.split(' ').map(binSubstring => String.fromCharCode(parseInt(binSubstring, 2))).join('')
}

function boolToBinary(boolean: boolean): string {
    return boolean ? '1' : '0';
}

function binaryToBool(text: string): boolean {
    return text === '1';
}
