/**
 * Created by petermares on 14/03/2016.
 */

(function() {
    console.log("Game booting!");
    var settings = require('../settings');

    settings.display.dpi = window.devicePixelRatio;

    var Game = new Phaser.Game(settings.display.width,
        settings.display.height,
        Phaser.AUTO,
        ''
    );

    Game.state.add('boot', require('./states/boot'));
    Game.state.add('preload', require('./states/preload'));
    //Game.state.add('mainmenu', require('./states/mainmenu'));
    Game.state.add('game', require('./states/game'));

    Game.state.start('boot');

})();