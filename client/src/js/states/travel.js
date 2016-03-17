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
    var _spaceShip;
    var _distanceBar;
    var _totalDistance, _distanceTravelled;

    o.preload = function() {
    };

    o.create = function() {
        _clickEngine = new ClickerEngine();
        _clickEngine.subscribe('reward', this.onReward.bind(this));

        _totalDistance = 100000;
        _distanceTravelled = 0;

        _spaceShip = this.game.add.sprite(100, Settings.display.height/2, 'spaceship', 0);
        _spaceShip.anchor.set(0.5, 0.5);
        _spaceShip.animations.add('fly', [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], 20, true);
        _spaceShip.animations.add('cruise', [0, 1], 10, true);

        _distanceBar = new ProgressBar(this.game, 10, 25, Settings.display.width-20, 10, '#C0C0FF', '#404080');
        this.game.world.add(_distanceBar);

        // create a clickable area over the whole thing
        _clickArea = this.game.add.sprite(0, 0);
        _clickArea.width = Settings.display.width;
        _clickArea.height = Settings.display.height;
        _clickArea.inputEnabled = true;
        _clickArea.events.onInputDown.add(function(target, pointer) {
            _clickEngine.click(pointer.positionDown, true);
        });
    };

    o.update = function() {
        _distanceTravelled += 2.5;
        this.updateDistanceBar();
        _spaceShip.animations.play('cruise');
    };

    o.shutdown = function() {
        console.log('State shutting down');
        _clickArea.kill();
    };

    o.onReward = function(value) {
        var pt = value.metaData;

        console.log('Travel onReward');
        _distanceTravelled += 20;
        this.updateDistanceBar();

        if ( _distanceTravelled >= _totalDistance ) {
            this.state.start('game');
        }
    };

    o.updateDistanceBar = function() {
        _distanceBar.progress = _distanceTravelled / _totalDistance;
        _distanceBar.refresh();
    }

    return o;
})();