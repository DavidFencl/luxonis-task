import * as net from "net";
import {IPC_CONFIG} from "../../config/ipc-config";
import {ClientState} from "../state/client-state";

export function connectIpcAction() {
    const socket = net
        .createConnection(IPC_CONFIG.socketPath);

    socket.on('connect', () => {
        console.log('Connection to server over IPC has been successful! Please log-in using "log-in" command.')
        ClientState.getClientState().setSocket(socket);
        ClientState.getClientState().setIsConnected(true);
    })
}