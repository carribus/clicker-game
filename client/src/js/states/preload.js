/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};
    var StarmapGenerator = require('../starmap/starmapgenerator');
    var ShopEngine = require('../models/shopengine');
    var PowerupList = require('../powerups/poweruplist');

    o.preload = function() {
        this.load.spritesheet('powerups', 'assets/images/powerups.png', 60, 63);
        this.load.spritesheet('bugship', 'assets/images/bug_spaceship_sheet.png', 79, 39);
        this.load.spritesheet('asteroid', 'assets/images/asteroid_spritesheet.png', 128, 128);
        this.load.image('pirate', 'assets/images/yuara_pirate.png');
        this.load.spritesheet('smallexplode', 'assets/images/smallexplosion_sheet.png', 40, 39);
        this.load.spritesheet('explode', 'assets/images/explosion-sprite.png', 96, 96);
        this.load.image('starbutton', 'assets/images/starbutton.png');
        this.load.image('spacestation', 'assets/images/spacestation.png');
        this.load.image('button_close', 'assets/images/close_button.png');
    };

    o.create = function() {
        var lastState = this.game.player.lastState || 'starmap';
        //lastState = 'travel';

        if ( !this.game.player.starmap ) {
        //if ( 1 ) {
            var NUM_COLS = 7, NUM_ROWS = 5;
            this.game.player.starmap = StarmapGenerator.generate(NUM_COLS, NUM_ROWS);

            // since we generated a new starmap, we need to position the player on an empty cell
            for ( var i = 0, len = NUM_COLS*NUM_ROWS; i < len; i++ ) {
                if ( this.game.player.starmap.map[i].cellType == 'empty' ) {
                    this.game.player.mapIndex = i;
                    break;
                }
            }
        }

        this.game.shop = new ShopEngine();
        this.configureShop(this.game.shop);

        // lets move along!
        this.state.start(lastState);
    };

    o.update = function() {
    };

    o.configureShop = function(shop) {
        PowerupList.forEach(function(powerup) {
            shop.add('powerups', powerup);
        });
    }

    return o;
})();