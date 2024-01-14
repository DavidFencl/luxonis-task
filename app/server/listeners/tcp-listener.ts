import * as net from "net";
import {TCP_CONFIG} from "../../config/tcp-config";
import {handleNewConnection} from "../handlers/connection-handlers";

export function initTcpListener() {
    net
        .createServer()
        .listen(TCP_CONFIG.port, TCP_CONFIG.ip, TCP_CONFIG.backlog)
        .on('listening', () => console.debug('TCP listener running'))
        .on('connection', socket => handleNewConnection(socket, 'TCP'))
    ;
}