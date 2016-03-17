/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};

    o.preload = function() {
        this.load.spritesheet('powerups', 'assets/images/powerups.png', 60, 63);
        this.load.spritesheet('spaceship', 'assets/images/ship_sheet.png', 135, 69);
        //this.load.spritesheet('spaceship', 'assets/images/ship_sheet.jpeg', 56, 99);
    };

    o.create = function() {
        // lets move along!
        this.state.start('travel');

    };

    o.update = function() {

    };

    return o;
})();