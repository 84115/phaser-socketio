let express = require('express')
let socket = require('socket.io')
let uuid = require('uuid')
let app = express()

let server = app.listen(3002, function() {
    console.log('listening on port: 3002')
})

app.use(express.static('build'))

let io = socket(server)

var players = {}

io.on('connection', function(client) {

    let id = uuid()

    console.log('connected client:', id)

    client.emit('joinPlayer', { uuid: id, players: players })

    // Disconnect listener
    client.on('disconnect', function() {
        delete players[id]

        io.sockets.emit('removePlayer', id)

        console.log('disconnected client:', id)
    })

    client.on('addPlayer', function(data) {
        if (!players[data.uuid]) {
            players[data.uuid] = data

            client.broadcast.emit('addPlayer', data)
        }
    })

    client.on('poll', function(data){
        if (players[data.uuid]) {
            players[data.uuid] = data

            client.broadcast.emit('poll', players)
        }
    })

})
