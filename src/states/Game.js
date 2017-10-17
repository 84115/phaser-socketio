import Player from 'objects/Player';
import Dude from 'objects/Dude';

let url = window.location.protocol + '//' + window.location.hostname + ':3002'

export default class GameState extends Phaser.State
{

    create()
    {
        var game = this.game;
        var scope = this;

        var player = new Player(game, 0, 3000, 'dude_sheet');
        player.tint = Math.random() * 0xffffff;

        var players = game.add.group();
        // game.physics.arcade.enable(players);
        // game.physics.arcade.collide(players);

        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);

        var socket = io.connect(url);

        socket.on('joinPlayer', function(data) {
            player.socket = data.socket;

            console.log('PLAYER:', player.socket);

            for (var existing in data.players) {
                // check if the property/_ is defined in the object itself, not in parent
                // && that it isn't the player
                if (data.players.hasOwnProperty(existing) && player.socket != existing) {
                    var newby = data.players[existing];
                    scope.addPlayer(game, newby, players);
                }
            }

            socket.emit('addPlayer', {
                socket: player.socket,
                x: player.x,
                y: player.y,
                tint: player.tint
            });
        });

        socket.on('addPlayer', function(data) {
            if (data.socket != player.socket) {
                scope.addPlayer(game, data, players);
            }
        });

        socket.on('removePlayer', function(id) {
            var ditcher = players.iterate('socket', id, Phaser.Group.RETURN_CHILD);

            players.remove(ditcher);
        });

        socket.on('poll', function(data) {
            for (var existing in data) {
                if (data.hasOwnProperty(existing) && player.socket != existing) {
                    var updater = data[existing];
                    var updatee = players.iterate('socket', updater.socket, Phaser.Group.RETURN_CHILD);
                    console.log('poll', updater, updatee);
                    updatee.body.x = updater.x;
                    updatee.body.y = updater.y;
                }
            }
        });

    }

    render()
    {
        this.game.debug.text("This is debug text", 50, 50);
    }

    update()
    {
    }

    addPlayer(game, data, group)
    {
        var dude = new Dude(game, data.x, data.y, 'dude_sheet');
        dude.tint = data.tint;
        dude.socket = data.socket;

        group.add(dude);
    }

    schema(object)
    {
        return {

        }
    }
}
