/**
 * Created by petermares on 24/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');

    var _lastTick = Date.now();

    o.preload = function() {

    };

    o.create = function() {

    };

    o.update = function() {

        // save the player every second
        if ( Date.now() - _lastTick > Settings.gameMechanics.delayBetweenPlayerSaveMS ) {
            this.game.savePlayerObject();
            _lastTick = Date.now();
        }
    };

    return o;
})();