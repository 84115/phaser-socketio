/*
 * Preload state
 * =============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a splash screen with a progress bar, showing how
 * much progress were made during the asset load.
 */

// import MainMenuState from 'states/MainMenu';
import GameState from 'states/Game';
import assets from '../assets';

export default class PreloadState extends Phaser.State
{

	preload()
	{
		this.showSplashScreen();

		this.load.pack('game', null, assets);
	}

	create()
	{
		// Here is a good place to initialize plugins that depend on any game
		// asset. Don't forget to `import` them first. Example:
		//this.add.plugin(MyPlugin/*, ... initialization parameters ... */);

        this.state.add('Game', GameState);

        this.state.start('Game');
	}

	// --------------------------------------------------------------------------

	showSplashScreen()
	{
		this.add.image(0, 0, 'splash-screen');

		this.load.setPreloadSprite(this.add.image(82, 282, 'progress-bar'));
	}

}
