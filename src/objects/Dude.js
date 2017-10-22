export default class Dude extends Phaser.Sprite
{

    constructor(game, x, y, key, frame)
    {
        super(game, x, y, key, frame);

        this.setPhysics();

        this.body.setSize(20, 32, 5, 16);
        this.animations.add('left', [0, 1, 2, 3], 9, true);
        this.animations.add('turn', [4], 20, true);
        this.animations.add('right', [5, 6, 7, 8], 9, true);
        this.animations.add('idle', [4], 20);
    }

    setPhysics()
    {
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.gravity.y = 500;
        this.body.maxVelocity.y = 500;
        this.body.collideWorldBounds = true;
    }

    setAnimation(animation='idle')
    {
        if (this.facing != animation) {
            this.animations.play(animation);
            this.facing = animation;
        }
    }

    moveToXY(x, y)
    {
        this.game.physics.arcade.moveToXY(this, x, y, 25, 25);
    }

    schema(object)
    {
        return {
            uuid: this.uuid,
            x: Math.round(this.x),
            y: Math.round(this.y),
            facing: this.facing,
            tint: this.tint
        }
    }

    schemaPoll(object)
    {
        return {
            uuid: this.uuid,
            x: Math.round(this.x),
            y: Math.round(this.y),
            facing: this.facing
        }
    }

}
