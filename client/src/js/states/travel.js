/**
 * Created by petermares on 17/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var ClickerEngine = require('../models/clickerengine');
    var ProgressBar = require('../objects/progressbar');
    var Starfield = require('../objects/starfield');

    var SPACESHIP_START_X = 178, SPACESHIP_END_X = Settings.display.width - 100;
    var SPACESHIP_START_Y = Settings.display.height/2;

    var _travelDetail;
    var _clickEngine;
    var _clickArea;
    var _clickTextObjects = [];
    var _starfield;
    var _spaceShip;
    var _thruster;
    var _distanceBar;
    var _lastTick = Date.now();
    var _animationType = 'fly';

    o.preload = function() {
    };

    o.create = function() {
        _clickEngine = new ClickerEngine();
        _clickEngine.subscribe('reward', this.onReward.bind(this));
        _clickEngine.setReward(Settings.gameMechanics.distanceClickIncrement);

        _travelDetail = this.game.player.travel;

        console.log('Travelling to:');
        console.log(_travelDetail);

        this.game.player.distanceToTravel = this.game.player.distanceToTravel || Settings.gameMechanics.distanceBetweenSectors;
        this.game.player.distanceTravelled = this.game.player.distanceTravelled == undefined ? 0 : this.game.player.distanceTravelled;

        _starfield = new Starfield(this.game, 0, 0, Settings.display.width, Settings.display.height, 50);
        _starfield.speed = 2;
        this.game.world.add(_starfield);

        var ssXpos = SPACESHIP_START_X + (SPACESHIP_END_X - SPACESHIP_START_X)*(this.game.player.distanceTravelled / this.game.player.distanceToTravel);
        _spaceShip = this.game.add.sprite(ssXpos, SPACESHIP_START_Y, 'bugship', 0);
        _spaceShip.anchor.set(0.5, 0.5);
        _spaceShip.scale.set(1.5);
        _spaceShip.animations.add('fly', [0, 1, 2, 3, 2, 1, 0], 20, true);
        //_spaceShip.animations.add('fly', [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], 20, true);
        _spaceShip.animations.add('cruise', [0, 1], 10, true);

        //_thruster = this.game.add.sprite(100, Settings.display.height/2, 'smallexplode', 0);
        _thruster = this.game.add.sprite(-52, 3, 'smallexplode', 0);
        _thruster.anchor.set(0.5, 0.5);
        //_thruster.scale.set(1.5);
        _thruster.animations.add('blowup', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        _spaceShip.addChild(_thruster);

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
        _spaceShip.x = SPACESHIP_START_X + (SPACESHIP_END_X - SPACESHIP_START_X)*(this.game.player.distanceTravelled / this.game.player.distanceToTravel);
        _spaceShip.animations.play(_animationType);
        _thruster.animations.play('blowup');

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
        var pt = value.metaData.pos;

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
            switch ( this.game.player.travel.cellType ) {
                case    'asteroids':
                    this.state.start('mining');
                    break;

                case    'starport':
                    this.state.start('starport');
                    break;

                case    'empty':
                    this.state.start('starmap');
                    break;
            }
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