/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};

    o.preload = function() {
        this.load.spritesheet('powerups', 'assets/images/powerups.png', 60, 62);
    };

    o.create = function() {
        // lets move along!
        this.state.start('game');

    };

    o.update = function() {

    };

    return o;
})();