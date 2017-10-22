import Player from 'objects/Player';
import Dude from 'objects/Dude';

let url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port

export default class GameState extends Phaser.State
{

    create()
    {
        this.createPlayer();
        this.createPlayers();
        this.createSockets();
    }

    createPlayer()
    {
        this.player = new Player(this.game, 0, 0, 'dude_sheet');
        this.player.tint = Math.random() * 0xffffff;
    }

    createPlayers()
    {
        this.players = this.game.add.group();
    }

    createSockets()
    {
        var self = this;

        self.socket = io.connect(url);

        self.socket.on('joinPlayer', function(data)
        {
            self.player.uuid = data.uuid;

            self.forEachExistingPlayer(data.players, function(existing_player)
            {
                self.addPlayer(existing_player);
            });

            self.socket.emit('addPlayer', self.player.schema());
        });

        self.socket.on('addPlayer', function(data)
        {
            if (data.uuid != self.player.uuid)
            {
                self.addPlayer(data);
            }

            // Polling begins here!
            self.socket.emit('poll', self.player.schema());
        });

        self.socket.on('removePlayer', function(uuid)
        {
            var ditcher = self.findPlayerByUuid(uuid);

            self.players.remove(ditcher);
        });

        self.socket.on('poll', function(data)
        {
            self.forEachExistingPlayer(data, function(diff)
            {
                var local_player = self.findPlayerByUuid(diff.uuid);

                local_player.moveToXY(diff.x, diff.y);
                local_player.setAnimation(diff.facing);
            });

            self.socket.emit('poll', self.player.schemaPoll());
        });

        self.socket.on('disconnect', self.destroyPlayers);
    }

    update()
    {
        this.game.physics.arcade.collide(this.player, this.players);
    }

    addPlayer(data)
    {
        var dude = new Dude(this.game, data.x, data.y, 'dude_sheet');

        dude.tint = data.tint;
        dude.uuid = data.uuid;

        this.players.add(dude);
    }

    destroyPlayers()
    {
        this.players.forEach(function(item)
        {
            item.destroy();
        });
    }

    findPlayerByUuid(uuid)
    {
        return this.players.iterate('uuid', uuid, Phaser.Group.RETURN_CHILD);
    }

    forEachExistingPlayer(player_update, callback)
    {
        for (var existing in player_update)
        {
            if (player_update.hasOwnProperty(existing) && this.player.uuid != existing)
            {
                callback(player_update[existing]);
            }
        }
    }

}
