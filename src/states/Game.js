import Player from 'objects/Player';
import Dude from 'objects/Dude';

let url = window.location.protocol + '//' + window.location.hostname + ':3002'

var player;
var players;

export default class GameState extends Phaser.State
{

    create()
    {
        var self = this;

        player = new Player(self.game, 0, 3000, 'dude_sheet');
        player.tint = Math.random() * 0xffffff;

        players = self.game.add.group();

        self.game.physics.arcade.collide(players);

        self.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);

        self.socket = io.connect(url);

        self.socket.on('joinPlayer', function(data) {
            player.socket = data.socket;

            console.log('PLAYER:', player.socket);

            for (var existing in data.players) {
                // check if the property/_ is defined in the object itself, not in parent
                // && that it isn't the player
                if (data.players.hasOwnProperty(existing) && player.socket != existing) {
                    var newby = data.players[existing];
                    self.addPlayer(self.game, newby, players);
                }
            }

            self.socket.emit('addPlayer', self.schema(player));
        });

        self.socket.on('addPlayer', function(data) {
            if (data.socket != player.socket) {
                self.addPlayer(self.game, data, players);
            }

            self.socket.emit('poll', self.schema(player));
        });

        self.socket.on('removePlayer', function(id) {
            var ditcher = self.findPlayerById(players, id);

            players.remove(ditcher);
        });

        self.socket.on('poll', function(data) {
            self.socket.emit('poll', self.schema(player));

            for (var existing in data) {
                if (data.hasOwnProperty(existing) && player.socket != existing) {
                    var updater = data[existing];
                    var updatee = players.iterate('socket', updater.socket, Phaser.Group.RETURN_CHILD);

                    self.game.physics.arcade.moveToXY(updatee, updater.x, updater.y, 25, 25);

                    updatee.setAnimation(updater.facing);
                }
            }
        });

        self.socket.on('disconnect', self.destroyPlayers);
    }

    render()
    {
        this.game.debug.text("This is debug text", 50, 50);
    }

    update()
    {
        this.game.physics.arcade.collide(player, players);
    }

    addPlayer(game, data, group)
    {
        var dude = new Dude(game, data.x, data.y, 'dude_sheet');
        dude.tint = data.tint;
        dude.socket = data.socket;

        group.add(dude);
    }

    destroyPlayers()
    {
        players.forEach(function(item) {
            item.destroy();
        });
    }

    findPlayerById(group, id)
    {
        return group.iterate('socket', id, Phaser.Group.RETURN_CHILD);
    }

    schema(object)
    {
        return {
            socket: object.socket,
            x: object.x,
            y: object.y,
            facing: object.facing,
            tint: object.tint
        }
    }
}
