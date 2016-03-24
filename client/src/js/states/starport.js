/**
 * Created by petermares on 24/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var Starfield = require('../objects/starfield');

    var _starport;
    var _btnStarmap;

    var _lastTick = Date.now();

    o.preload = function() {

    };

    o.create = function() {
        var _starfield = new Starfield(this.game, 0, 0, Settings.display.width, Settings.display.height, 50);
        _starfield.speed = 0.2;
        this.game.world.add(_starfield);

        _starport = this.game.add.sprite(Settings.display.width/2, 400, 'spacestation');
        _starport.anchor.set(0.5);
        _starport.scale.set(1.5);
        _starport.inputEnabled = true;
        _starport.events.onInputDown.add(this.openStarportDialog.bind(this));

        // create the starmap button
        _btnStarmap = this.game.add.sprite(0, 0, 'starbutton');
        _btnStarmap.scale.set(0.6);
        _btnStarmap.x = Settings.display.width - _btnStarmap.width - 10;
        _btnStarmap.y = Settings.display.height - _btnStarmap.height - 10;
        _btnStarmap.inputEnabled = true;
        _btnStarmap.events.onInputDown.add(this.gotoStarmap.bind(this));
    };

    o.update = function() {
        // rotate the starport
        _starport.angle += 0.03;

        // save the player every second
        if ( Date.now() - _lastTick > Settings.gameMechanics.delayBetweenPlayerSaveMS ) {
            this.game.savePlayerObject();
            _lastTick = Date.now();
        }
    };

    o.openStarportDialog = function() {
        console.log("Opening starport dialog");
    };

    o.gotoStarmap = function(target) {
        this.state.start('starmap');
    };

    return o;
})();