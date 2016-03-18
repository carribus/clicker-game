/**
 * Created by petermares on 17/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var ClickerEngine = require('../engine/clickerengine');
    var ProgressBar = require('../objects/progressbar');

    var _clickEngine;
    var _clickArea;
    var _clickTextObjects = [];
    var _spaceShip;
    var _distanceBar;
    var _lastTick = Date.now();
    var _animationType = 'cruise';

    o.preload = function() {
    };

    o.create = function() {
        _clickEngine = new ClickerEngine();
        _clickEngine.subscribe('reward', this.onReward.bind(this));
        _clickEngine.setReward(Settings.gameMechanics.distanceClickIncrement);

        this.game.player.distanceToTravel = 100000;
        this.game.player.distanceTravelled = 0;

        _spaceShip = this.game.add.sprite(100, Settings.display.height/2, 'spaceship', 0);
        _spaceShip.anchor.set(0.5, 0.5);
        _spaceShip.animations.add('fly', [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], 20, true);
        _spaceShip.animations.add('cruise', [0, 1], 10, true);

        _distanceBar = new ProgressBar(this.game, 10, 25, Settings.display.width-20, 10, '#C0C0FF', '#404080');
        this.game.world.add(_distanceBar);

        this.game.add.sprite(-40, 0, 'pirate');

        // create a clickable area over the whole thing
        _clickArea = this.game.add.sprite(0, 0);
        _clickArea.width = Settings.display.width;
        _clickArea.height = Settings.display.height;
        _clickArea.inputEnabled = true;
        _clickArea.events.onInputDown.add(function(target, pointer) {
            _clickEngine.click({pos: pointer.positionDown, target: target}, false);
        });
    };

    o.update = function() {
        this.game.player.distanceTravelled += Settings.gameMechanics.distanceIdleIncrement;
        this.updateDistanceBar();
        this.processClickAnimations();
        _spaceShip.animations.play(_animationType);

        // save the player every second
        if ( Date.now() - _lastTick > Settings.gameMechanics.delayBetweenPlayerSaveMS ) {
            this.game.savePlayerObject();
            _lastTick = Date.now();
        }
    };

    o.shutdown = function() {
        console.log('Travel State shutting down');
        _clickArea.kill();
    };

    o.onReward = function(value) {
        var pt = value.metaData;

        var txt = this.game.add.text(pt.x, pt.y, value.value, {
            font: '16pt Arial',
            align: 'center',
            fill: "#FFFFFF"
        });

        txt.anchor.set(0.5, 0.5);
        _clickTextObjects.push(txt);

        this.game.player.distanceTravelled += Settings.gameMechanics.distanceClickIncrement;
        this.updateDistanceBar();

        if ( this.game.player.distanceTravelled >= this.game.player.distanceToTravel ) {
            this.state.start('mining');
        }
    };

    o.updateDistanceBar = function() {
        _distanceBar.progress = this.game.player.distanceTravelled / this.game.player.distanceToTravel;
        _distanceBar.refresh();
    };

    o.processClickAnimations = function() {
        for ( var i = 0, len = _clickTextObjects.length; i < len; i++ ) {
            var o = _clickTextObjects[i];
            if (o.alpha > 0 ) {
                o.y -= 2;
                o.alpha -= 0.01;
            } else {
                _clickTextObjects.splice(i--, 1);
                len--;
                o.kill();
            }
        }
    };

    return o;
})();