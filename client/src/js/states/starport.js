/**
 * Created by petermares on 24/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var Starfield = require('../objects/starfield');
    var Dialog = require('../objects/dialog');
    var DlgStarPort = require('../dialogs/dlgstarport');

    var _starport;
    var _btnStarmap;
    var _dlgStarport;

    var _lastTick = Date.now();

    o.preload = function() {

    };

    o.create = function() {
        var _starfield = new Starfield(this.game, 0, 0, Settings.display.width, Settings.display.height, 50);
        _starfield.speed = 0.2;
        this.game.world.add(_starfield);

        _starport = this.game.add.image(Settings.display.width/2, 400, 'spacestation');
        _starport.anchor.set(0.5);
        _starport.scale.set(1.5);
        _starport.inputEnabled = true;
        _starport.input.useHandCursor = true;
        _starport.events.onInputDown.add(this.openStarportDialog.bind(this));

        // create the starmap button
        _btnStarmap = this.game.add.image(0, 0, 'starbutton');
        _btnStarmap.scale.set(0.6);
        _btnStarmap.x = Settings.display.width - _btnStarmap.width - 10;
        _btnStarmap.y = Settings.display.height - _btnStarmap.height - 10;
        _btnStarmap.inputEnabled = true;
        _btnStarmap.input.useHandCursor = true;
        _btnStarmap.events.onInputDown.add(this.gotoStarmap.bind(this));

        _dlgStarport = new DlgStarPort(this.game, Settings.display.width/2, Settings.display.height/2-100, Settings.display.width*0.8, Settings.display.height*0.7);
        this.game.world.add(_dlgStarport);
        _dlgStarport.visible = false;
        _dlgStarport.onCloseButtonPressed.add(function() {
            if ( _dlgStarport.visible ) {
                var tween = _dlgStarport.game.add.tween(_dlgStarport.scale).to({x: 0.1, y: 0.1}, 150, Phaser.Easing.Linear.In, true);
                tween.onComplete.add(function() {
                    _dlgStarport.visible = false;
                });
            }
        });
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
        if ( _dlgStarport.visible === false ) {
            _dlgStarport.showPanel('main', true);
            _dlgStarport.setTitle('Starport Options');
            _dlgStarport.scale.set(0.1);
            _dlgStarport.visible = true;
            tween = this.game.add.tween(_dlgStarport.scale).to({x: 1, y:1}, 750, Phaser.Easing.Bounce.Out, true);
        }
    };

    o.gotoStarmap = function(target) {
        this.state.start('starmap');
    };

    return o;
})();