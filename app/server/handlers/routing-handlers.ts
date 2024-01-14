import {Socket} from "node:net";
import {encodeMessage} from "../../utils/mesasge-utils";
import {MessageTypeEnum} from "../../model/message-types";
import {UserRepository} from "../repository/user-repository";
import {MessageContentType} from "../../model/message-content-type";
import {GameRepository} from "../repository/game-repository";
import {GameModel} from "../../model/game-model";
import {UserModel} from "../../model/user-model";
import {GAME_CONFIG} from "../../config/game-config";

export function handleLogIn(user: UserModel, socket: Socket, messageContent: MessageContentType | undefined) {
    if (!(messageContent) || messageContent[0] === undefined || messageContent.length === 0) {
        sendErrorMessage(socket, `Please input a password`);
        return;
    }


    messageContent[0] === GAME_CONFIG.password
        ? handleLogInSuccess(socket, user)
        : handleLogInFail(socket);
}

function handleLogInFail(socket: Socket) {
    socket.write(encodeMessage(MessageTypeEnum.LOG_IN_FAIL));
}

function handleLogInSuccess(socket: Socket, user: UserModel) {
    console.log('log in success');
    socket.write(encodeMessage(MessageTypeEnum.LOG_IN_SUCCESS, [user.id]));
}

export function handleGetOpponentList(socket: Socket, id: number) {
    socket.write(
        encodeMessage(
            MessageTypeEnum.GET_OPPONENT_LIST,
            UserRepository.getRepository()
                .getUsers()
                // Skip current user
                .filter(user => user.id !== id)
                .map(user => user.id)
        )
    );
}

export function handleChallengeOpponent(originUser: UserModel, messageContent: MessageContentType | undefined) {
    if (!messageContent || messageContent[0] === undefined || messageContent[1] === undefined) {
        sendErrorMessage(originUser.socket, 'Please send both userId and a word to guess');
        return;
    }

    const targetUser = UserRepository.getRepository().getUser(messageContent[0] as number);

    if (!targetUser) {
        sendErrorMessage(originUser.socket, `User with ID ${messageContent[0]} does not exist`);
        return;
    }

    const game = new GameModel(originUser, targetUser, messageContent.slice(1).join(' '));
    GameRepository.getRepository().addGame(game)

    // Send challenge offer to target user
    targetUser.socket.write(encodeMessage(MessageTypeEnum.CHALLENGE_OPPONENT_OFFER, [game.id]))

    // Inform origin user about successful offer
    originUser.socket.write(encodeMessage(MessageTypeEnum.CHALLENGE_OPPONENT_ACK, [`User ${targetUser.id} challenged! Waiting for his response.`]))
}

export function handleChallengeResponse(originUser: UserModel, messageContent: MessageContentType | undefined) {
    if (!messageContent || messageContent[0] === undefined || messageContent[1] === undefined) {
        sendErrorMessage(originUser.socket, 'Please send both GameId and your invitation response');
        return;
    }

    const game = GameRepository.getRepository().getGame(messageContent[1] as number);

    if (!game) {
        sendErrorMessage(originUser.socket, `Game with ID ${messageContent[0]} does not exist`);
        return;
    }

    messageContent[0] === true
        ? handleChallengeAccepted(game)
        : handleChallengeRejected(game);
}

function handleChallengeRejected(game: GameModel) {
    game.challenger.socket.write(encodeMessage(MessageTypeEnum.CHALLENGE_REJECTED, [game.opponent.id, game.id]))
    GameRepository.getRepository().removeGame(game.id)
}

function handleChallengeAccepted(game: GameModel) {
    game.setIsAccepted(true);
    game.challenger.socket.write(encodeMessage(MessageTypeEnum.CHALLENGE_ACCEPTED, [game.opponent.id, game.id]))
}

export function handleHint(socket: Socket, messageContent: MessageContentType | undefined) {
    if (!messageContent || messageContent[0] === undefined || messageContent[1] === undefined) {
        sendErrorMessage(socket, 'Please send both GameId and your hint');
        return;
    }

    const [gameId, hint] = [messageContent[0] as number, messageContent[1] as string];

    const game = GameRepository.getRepository().getGame(gameId);

    if (!game) {
        sendErrorMessage(socket, `Game with ID ${gameId} not found`);
        return;
    }

    game.opponent.socket.write(encodeMessage(MessageTypeEnum.HINT, [gameId, hint]));
}

export function handleGuess(socket: Socket, messageContent: MessageContentType | undefined) {
    if (!messageContent || messageContent[0] === undefined || messageContent[1] === undefined) {
        sendErrorMessage(socket, 'Please send both GameId and your guess');
        return;
    }

    const [gameId, guess] = [messageContent[0] as number, messageContent[1] as string];

    const game = GameRepository.getRepository().getGame(gameId);

    if (!game) {
        sendErrorMessage(socket, `Game with ID ${gameId} not found`);
        return;
    }

    // Increment try counter
    game.incrementGuessAttempts();

    // Respond
    game.wordToGuess === guess
        ? handleGuessSuccess(game)
        : handleGuessFail(game, guess);
}

function handleGuessFail(game: GameModel, guess: string) {
    game.challenger.socket.write(encodeMessage(MessageTypeEnum.OPPONENT_HAS_GUESSED, [false, game.getGuessAttempts(), guess]));
    game.opponent.socket.write(encodeMessage(MessageTypeEnum.GUESS_FAIL));
}

function handleGuessSuccess(game: GameModel) {
    game.challenger.socket.write(encodeMessage(MessageTypeEnum.OPPONENT_HAS_GUESSED, [true, game.getGuessAttempts()]));
    game.opponent.socket.write(encodeMessage(MessageTypeEnum.GUESS_SUCCESS));
}

export function sendErrorMessage(socket: Socket, errorText: string) {
    socket.write(encodeMessage(MessageTypeEnum.ERROR, [errorText]));
}
