/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};
    var StarmapGenerator = require('../starmap/starmapgenerator');

    o.preload = function() {
        this.load.spritesheet('powerups', 'assets/images/powerups.png', 60, 63);
        //this.load.spritesheet('spaceship', 'assets/images/ship_sheet.png', 135, 69);
        //this.load.spritesheet('spaceship2', 'assets/images/chainsaw_spaceship.gif');
        this.load.spritesheet('bugship', 'assets/images/bug_spaceship_sheet.png', 79, 39);
        this.load.spritesheet('asteroid', 'assets/images/asteroid_spritesheet.png', 128, 128);
        this.load.image('pirate', 'assets/images/yuara_pirate.png');
        this.load.spritesheet('smallexplode', 'assets/images/smallexplosion_sheet.png', 40, 39);
        this.load.spritesheet('explode', 'assets/images/explosion-sprite.png', 96, 96);
        this.load.image('starbutton', 'assets/images/starbutton.png');
        this.load.image('spacestation', 'assets/images/spacestation.png');
    };

    o.create = function() {
        var lastState = this.game.player.lastState || 'starmap';
        //lastState = 'starmap';

        if ( !this.game.player.starmap ) {
        //if ( 1 ) {
            var NUM_COLS = 7, NUM_ROWS = 5;
            this.game.player.starmap = StarmapGenerator.generate(NUM_COLS, NUM_ROWS);
        }

        // lets move along!
        this.state.start(lastState);

    };

    o.update = function() {
    };

    return o;
})();