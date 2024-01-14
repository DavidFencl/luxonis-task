import * as net from "net";
import {TCP_CONFIG} from "../../config/tcp-config";
import {ClientState} from "../state/client-state";

export function connectOverTcpAction() {
    const socket = net
        .createConnection({port: TCP_CONFIG.port, host: TCP_CONFIG.ip});

    socket.on('connect', () => {
        console.log('Connection to server over TCP has been successful! Please log-in using "log-in" command.')
        ClientState.getClientState().setSocket(socket);
        ClientState.getClientState().setIsConnected(true);
    })
}