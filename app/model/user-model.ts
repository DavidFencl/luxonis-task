import {Socket} from "node:net";
import {routeMessage} from "../server/routers/message-router";
import {generateId} from "../utils/utils";

export class UserModel {
    readonly id: number;
    readonly socket: Socket


    constructor(socket: Socket) {
        this.socket = socket;
        this.id = generateId()

        this.socket
            .on('data', (message) => routeMessage(message.toString(), this));
    }
}