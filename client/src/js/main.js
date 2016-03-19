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

    Game.savePlayerObject = function() {
        if (this.player) {
            this.player.lastState = this.state.getCurrentState().key;
            localStorage.setItem('player', JSON.stringify(this.player));
        }
    };

    Game.state.add('boot', require('./states/boot'));
    Game.state.add('preload', require('./states/preload'));
    Game.state.add('travel', require('./states/travel'));
    Game.state.add('starmap', require('./states/starmap'));
    Game.state.add('mining', require('./states/mining'));

    Game.state.start('boot');
})();