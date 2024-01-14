import * as net from "net";
import {IPC_CONFIG} from "../../config/ipc-config";
import {handleNewConnection} from "../handlers/connection-handlers";
import * as fs from "fs";

export function initIpcListener() {
    const server = net
        .createServer()
        .listen(IPC_CONFIG.socketPath, IPC_CONFIG.backlog)
        .on('listening', () => console.debug('IPC listener running'))
        .on('connection', (socket) => handleNewConnection(socket, 'IPC'))
        .on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error('Unix socket already in use, retrying...');
                setTimeout(() => {
                    // Unlink unix socket
                    fs.unlinkSync(IPC_CONFIG.socketPath);

                    // Reconnect
                    server.close();
                    server.listen(IPC_CONFIG.socketPath, IPC_CONFIG.backlog)
                }, 1000);
            }
        });

}