let express = require('express')
let socket = require('socket.io')

let app = express()

let server = app.listen(3002, function() {
    console.log('listening on port: 3002')
})

app.use(express.static('build'))

let io = socket(server)

io.on('connection', function(socket) {
    console.log('connected client:', socket.id)

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log('disconnected client:', socket.id)
    })

    socket.on('chat', function(data) {
        io.sockets.emit('chat', data)
    })
})
