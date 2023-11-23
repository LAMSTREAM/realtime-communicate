// ts-ignore 7017 is used to ignore the error that the global object is not
// defined in the global scope. This is because the global object is only
// defined in the global scope in Node.js and not in the browser.

// Mock by prisma

import io from 'socket.io-client'
import {config} from "@@/project-meta-config";

const globalForSocket = global as unknown as {socket: any}

const socket = globalForSocket.socket || io(`http://localhost:${process.env.PORT}`, {
  path: config.socketPath
});

if (process.env.NODE_ENV !== 'production') {
  globalForSocket.socket = socket;
}

export { socket };