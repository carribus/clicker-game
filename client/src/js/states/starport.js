/**
 * Created by petermares on 24/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var Starfield = require('../objects/starfield');
    var Dialog = require('../objects/dialog')

    var _starport;
    var _btnStarmap;

    var _lastTick = Date.now();

    o.preload = function() {

    };

    o.create = function() {
        var _starfield = new Starfield(this.game, 0, 0, Settings.display.width, Settings.display.height, 50);
        _starfield.speed = 0.2;
        this.game.world.add(_starfield);
0
        _starport = this.game.add.sprite(Settings.display.width/2, 400, 'spacestation');
        _starport.anchor.set(0.5);
        _starport.scale.set(1.5);
        _starport.inputEnabled = true;
        _starport.input.useHandCursor = true;
        _starport.events.onInputDown.add(this.openStarportDialog.bind(this));

        // create the starmap button
        _btnStarmap = this.game.add.sprite(0, 0, 'starbutton');
        _btnStarmap.scale.set(0.6);
        _btnStarmap.x = Settings.display.width - _btnStarmap.width - 10;
        _btnStarmap.y = Settings.display.height - _btnStarmap.height - 10;
        _btnStarmap.inputEnabled = true;
        _btnStarmap.input.useHandCursor = true;
        _btnStarmap.events.onInputDown.add(this.gotoStarmap.bind(this));

        var dlg = new Dialog(this.game, 100, 100, Settings.display.width-200, Settings.display.height-300, 'black', '#60FF60');
        dlg.setTitle("Starport Options");
        dlg.alpha = 0.8;
        dlg.inputEnabled = true;
        dlg.input.enableDrag();
        this.game.world.add(dlg);

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