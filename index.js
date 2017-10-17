let express = require('express')
let socket = require('socket.io')
let R = require('ramda')

let app = express()

let server = app.listen(3002, function() {
    console.log('listening on port: 3002')
})

app.use(express.static('build'))

let io = socket(server)

var players = {}

io.on('connection', function(socket) {

    console.log('connected client:', socket.id)

    socket.emit('joinPlayer', {
        players: players,
        socket: socket.id
    });

    // Disconnect listener
    socket.on('disconnect', function() {
        delete players[socket.id]

        io.sockets.emit('removePlayer', socket.id)

        console.log('disconnected client:', socket.id)

        console.log('players@'+Object.keys(players).length, players);
    })

    socket.on('addPlayer', function(data) {
        players[data.socket] = data

        console.log('players@'+Object.keys(players).length, players);

        io.sockets.emit('addPlayer', data)
    })

    setInterval(function(){
        io.sockets.emit('poll', players)
    }, 1000)

})
