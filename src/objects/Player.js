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

    constructor(game, x=0, y=0, key='dude_sheet')
    {
        super(game, x, y, key);

        this.createHealth(75);
        this.createControls();

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

    createHealth(health)
    {
        this.health = health;
        this.maxHealth = this.health;
    }

    createControls()
    {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    }

}
