import {initIpcListener} from "./listeners/ipc-listener";
import {initTcpListener} from "./listeners/tcp-listener";

console.debug("Starting server application")

// Init TCP & Unix socket listeners
initIpcListener()
initTcpListener()