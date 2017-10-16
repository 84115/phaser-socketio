import Dude from 'objects/Dude';

/*
 * Player
 * ====
 *
 * A sample prefab (extended game object class), for displaying the Phaser
 * logo.
 */

export default class Player extends Dude
{

    constructor(game, x, y, key, frame)
    {
        super(game, x, y, key, frame);

        this.setHealth(75);
        this.setControls();
        this.body.setSize(20, 32, 5, 16);
        this.animations.add('left', [0, 1, 2, 3], 9, true);
        this.animations.add('turn', [4], 20, true);
        this.animations.add('right', [5, 6, 7, 8], 9, true);
        this.animations.add('idle', [4], 20);

        // this.body.allowGravity = true;
        // this.body.gravity.y = 800;

        game.add.existing(this);
    }

    update()
    {
        if (this.alive)
        {
            if (this.body.blocked.down || this.body.touching.down)
            {
                if (this.upKey.isDown)
                {
                    if (this.game.time.now)
                    {
                        this.body.velocity.y = -800;
                        this.health--;
                    }
                }
            }

            if (this.leftKey.isDown)
            {
                this.setAnimation('left');
                this.body.velocity.x = -125;
                this.x--;
            }
            else if (this.rightKey.isDown)
            {
                this.setAnimation('right');
                this.body.velocity.x = 125;
                this.x++;
            }
            else
            {
                this.setAnimation('idle');
                this.body.velocity.x = 0;
            }
        }
    }

    render()
    {

    }

    setHealth(health)
    {
        this.health = health;
        this.maxHealth = this.health;
    }

    setControls()
    {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    }

    setAnimation(animation='idle')
    {
        if (this.facing != animation) {
            this.animations.play(animation);
            this.facing = animation;
        }
    }

}
