import {Socket} from "node:net";
import {UserRepository} from "../repository/user-repository";
import {UserModel} from "../../model/user-model";

/**
 * Handler responsible for new connection events. It registers user with his socket and stores him in UserRepository.
 * @param socket - Socket for communication with newly connected user.
 * @param connectionType - Type of connection - either TCP or IPC (Unix socket). It is only used for logging appropriate message.
 */
export function handleNewConnection(socket: Socket, connectionType: 'IPC' | 'TCP') {
    console.info(connectionType === 'IPC' ? `New IPC connection accepted!` : `New TCP connection accepted from ${socket.remoteAddress}:${socket.remotePort}`)

    UserRepository.getRepository().addUser(new UserModel(socket))
}
