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
        this.socket = io.connect(url);

        this.socketOn('joinPlayer', this.socketJoinPlayer);
        this.socketOn('addPlayer', this.socketAddPlayer);
        this.socketOn('removePlayer', this.socketRemovePlayer);
        this.socketOn('poll', this.socketUpdatePlayerPositions);
        this.socketOn('disconnect', this.socketDestroyPlayers);
    }

    update()
    {
        if (this.player.uuid)
        {
            this.socket.emit('poll', this.player.schema());
        }

        this.game.physics.arcade.collide(this.player, this.players);
    }

    addPlayer(data)
    {
        var dude = new Dude(this.game, data.x, data.y, 'dude_sheet');

        dude.tint = data.tint;
        dude.uuid = data.uuid;

        this.players.add(dude);
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

    socketOn(socketString, method)
    {
        this.socket.on(socketString, method.bind(this));
    }

    socketJoinPlayer(data)
    {
        this.player.uuid = data.uuid;

        this.forEachExistingPlayer(data.players, existing_player => this.addPlayer(existing_player));

        this.socket.emit('addPlayer', this.player.schema());
    }

    socketAddPlayer(data)
    {
        if (data.uuid != this.player.uuid)
        {
            this.addPlayer(data);
        }
    }

    socketRemovePlayer(uuid)
    {
        var ditcher = this.findPlayerByUuid(uuid);

        this.players.remove(ditcher);
    }

    socketUpdatePlayerPositions(data)
    {
        var self = this;

        this.forEachExistingPlayer(data, function(diff)
        {
            var other_players = self.findPlayerByUuid(diff.uuid);

            if (other_players.updateSchema)
            {
                other_players.updateSchema(diff);
            }
        });
    }

    socketDestroyPlayers()
    {
        this.players.forEach(item => item.destroy());
    }

}
