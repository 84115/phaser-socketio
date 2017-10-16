export default class Dude extends Phaser.Sprite
{

    constructor(game, x, y, key, frame)
    {
        super(game, x, y, key, frame);

        this.setPhysics();
    }

    setPhysics()
    {
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.gravity.y = 500;
        this.body.maxVelocity.y = 500;
        this.body.bounce.y = 0.1;
        this.body.collideWorldBounds = true;
    }

}
