import {Socket} from "node:net";
import {routeMessage} from "../routers/message-router";

type RelationshipToGame = 'challenger' | 'opponent' | null;

/**
 * Class acting as clients state. Singleton pattern is used for data consistency across the application.
 */
export class ClientState {
    private static _instance: ClientState;

    private socket?: Socket;

    private gameInvitationId: number | null = null;

    private activeGameId: number | null = null;

    private relationToGame: RelationshipToGame = null;

    private isConnected: boolean = false;

    private isLoggedIn: boolean = false;

    constructor() {
    }

    public static getClientState(): ClientState {
        if (!this._instance) {
            this._instance = new ClientState()
        }

        return this._instance;
    }

    getSocketSafe(): Socket {
        if (!this.socket) {
            console.error('Socket not present! Unconnected!')
            process.exit();
        }

        return this.socket;
    }

    setSocket(value: Socket) {
        value.on('data', (message) => routeMessage(message.toString()))
        this.socket = value;
    }

    getIsConnected(): boolean {
        return this.isConnected;
    }

    setIsConnected(isConnected: boolean) {
        this.isConnected = isConnected;
    }

    getIsLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    setIsLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn;
    }

    hasActiveGame(): boolean {
        return !!this.activeGameId;
    }

    getGameInvitationId(): number | null {
        return this.gameInvitationId;
    }

    setGameInvitationId(id: number | null) {
        this.gameInvitationId = id;
    }

    getActiveGameId(): number | null {
        return this.activeGameId;
    }

    setActiveGameId(id: number | null, relationship: RelationshipToGame) {
        this.activeGameId = id;
        this.relationToGame = relationship;
    }

    getRelationship(): RelationshipToGame {
        return this.relationToGame;
    }
}
