require('dotenv').config()
const {config} = require("./project-meta-config");

const express = require('express')
const http = require('http')
const next = require('next')
const socketio = require('socket.io')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  const app = express()
  const server = http.createServer(app)
  const io = new socketio.Server({
    path: config.socketPath,
  })
  io.attach(server)

  io.on('connection', (socket) => {

    socket.on('server', (data) => {
      switch (data.type) {
        case 'newMessage': {
          // const data = {
          //   type: 'newMessage',
          //   messageId: result?.id,
          //   sessionId: result?.sessionId
          // }
          socket.to(data.sessionId+'').emit('newMessage', {
            messageId: data.messageId,
            sessionId: data.sessionId
          })
          break;
        }
        default: {
          break;
        }
      }
    })

    socket.on('client', (data) => {
      switch (data.type) {
        case 'subscribeSessions': {
          // const data = {
          //   type: 'subscribeSessions',
          //   sessionsId: sessionsId
          // }
          const sessionsId = data.sessionsId
          sessionsId.forEach(sessionId => {
            socket.join(sessionId+'')
          })
          break;
        }
        default: {
          break;
        }
      }
    })

    socket.onAny((event, data) => {
      console.log(`[event][${event}][${data.type}]`)
    })

    socket.on("disconnect", () => {

    })
  })

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`> running in http://localhost:${port}`)
  })

  server.on('error', (error) => {
    console.error('Server error:', error);
  });
})
