import SocketState from 'states/Socket';
import Player from 'objects/Player';
import Dude from 'objects/Dude';

export default class GameState extends SocketState
{

    create()
    {
        this.createPlayer();
        this.createPlayers();
        this.createSockets();
    }

    createPlayer()
    {
        this.player = new Player(this.game);
    }

    createPlayers()
    {
        this.players = this.game.add.group();
    }

    createSockets()
    {
        this.socketConnect();
        this.socketOn('joinPlayer', this.socketJoinPlayer);
        this.socketOn('addPlayer', this.socketAddPlayer);
        this.socketOn('removePlayer', this.socketRemovePlayer);
        this.socketOn('poll', this.socketUpdatePlayerPositions);
        this.socketOn('disconnect', this.socketRemovePlayers);
    }

    update()
    {
        if (this.player.uuid)
        {
            this.socketEmit('poll', this.player.schema());
        }

        this.game.physics.arcade.collide(this.player, this.players);
    }

    addPlayer(data)
    {
        var player = new Dude(this.game, data.x, data.y);

        player.tint = data.tint;
        player.uuid = data.uuid;

        this.players.add(player);

        return player;
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

    socketJoinPlayer(data)
    {
        this.player.uuid = data.uuid;

        this.forEachExistingPlayer(data.players, player => this.addPlayer(player));

        this.socketEmit('addPlayer', this.player.schema());

        return this;
    }

    socketAddPlayer(data)
    {
        if (data.uuid != this.player.uuid)
        {
            this.addPlayer(data);
        }

        return this;
    }

    socketRemovePlayer(uuid)
    {
        var ditcher = this.findPlayerByUuid(uuid);

        this.players.remove(ditcher);

        return this;
    }

    socketUpdatePlayerPositions(data)
    {
        var self = this;

        this.forEachExistingPlayer(data, function(player)
        {
            var other_players = self.findPlayerByUuid(player.uuid);

            if (other_players.updateSchema)
            {
                other_players.updateSchema(player);
            }
        });

        return this;
    }

    socketRemovePlayers()
    {
        this.players.forEach(player => player.kill());

        return this;
    }

}
