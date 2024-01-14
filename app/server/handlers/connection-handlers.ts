import {Socket} from "node:net";
import {UserRepository} from "../repository/user-repository";
import {UserModel} from "../../model/user-model";

export function handleNewConnection(socket: Socket, connectionType: 'IPC' | 'TCP') {
    console.debug(connectionType === 'IPC' ? `New IPC connection accepted!` : `New TCP connection accepted from ${socket.remoteAddress}:${socket.remotePort}`)

    UserRepository.getRepository().addUser(new UserModel(socket))
}
