import {GameModel} from "../../model/game-model";

/**
 * Repository class used for storing information about ongoing games.
 * It is designed around Singleton pattern, so it can be easily instanced and all calls and data can be shared across whole application.
 */
export class GameRepository {
    private static instance: GameRepository;

    private games: Map<number, GameModel> = new Map();

    public static getRepository(): GameRepository {
        if (!this.instance) {
            this.instance = new GameRepository();
        }

        return this.instance;
    }

    public addGame(game: GameModel) {
        this.games.set(game.id, game);
    }

    public getGame(gameId: number): GameModel | undefined {
        return this.games.get(gameId);
    }

    public removeGame(gameId: number) {
        this.games.delete(gameId);
    }
}