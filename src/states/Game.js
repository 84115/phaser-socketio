import Player from 'objects/Player';

export default class GameState extends Phaser.State
{

    create()
    {
        this.game.stage.backgroundColor = '#000';

        this.player = new Player(this.game, 0, 3000, 'dude_sheet');

        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);
    }

    update()
    {
        this.game.physics.arcade.collide(this.player, this.platforms);
    }

}
