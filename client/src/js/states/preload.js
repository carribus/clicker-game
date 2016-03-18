/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};

    o.preload = function() {
        this.load.spritesheet('powerups', 'assets/images/powerups.png', 60, 63);
        this.load.spritesheet('spaceship', 'assets/images/ship_sheet.png', 135, 69);
        this.load.spritesheet('asteroid', 'assets/images/asteroid_spritesheet.png', 128, 128);
        //this.load.spritesheet('spaceship', 'assets/images/ship_sheet.jpeg', 56, 99);
    };

    o.create = function() {
        var lastState = this.game.player.lastState || 'travel';
        //lastState = 'travel';

        // lets move along!
        this.state.start(lastState);

    };

    o.update = function() {

    };

    return o;
})();