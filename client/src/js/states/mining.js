/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function () {
    var o = {};
    var ClickerEngine = require('../models/clickerengine');
    var PowerupFactory = require('../powerups/powerupfactory');
    var Settings = require('../../settings');

    var ProgressBar = require('../objects/progressbar');

    var _clickEngine;
    var _clickSummary;
    var _clickTextObjects = [];
    var _asteroids = [];
    var _btnStarmap;

    var _currentCell, _currentIndex;

    var _progressBars = {
        clickProgress: null,
        bonusProgress: null
    };

    var _lastTick = Date.now();

    var _activePowerups = {};

    var POWERUPS_PER_LINE = 4;
    var POWERUP_LINES = 3;

    o.preload = function () {
    };

    o.create = function () {
        var i;

        _currentIndex = this.game.player.travel.toHex;
        _currentCell = this.game.player.starmap.map[_currentIndex]
        console.log(this.game.player.travel);
        console.log(_currentCell);

        _clickEngine = new ClickerEngine();
        _clickEngine.setScore(this.game.player.score || 0);
        _clickEngine.setClickCount(this.game.player.clicks || 0);
        _clickEngine.setCritCount(this.game.player.crits || 0);
        _clickEngine.subscribe('reward', this.onReward.bind(this));

        _clickSummary = this.game.add.text(0, 0, _clickEngine.clickCount(), {
            font: '16pt Arial',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'center',
            fill: 'white'
        });
        _clickSummary.setTextBounds(5, 22, Settings.display.width, 0);

        // create the progress bars
        _progressBars.clickProgress = new ProgressBar(this.game, 5, 5, Settings.display.width - 10, 10, '#8080FF', '#606060');
        this.game.world.add(_progressBars.clickProgress);
        _progressBars.bonusProgress = new ProgressBar(this.game, 5, 55, Settings.display.width - 10, 10, '#FF8080', '#606060');
        this.game.world.add(_progressBars.bonusProgress);
        _progressBars.clickProgress.progress = this.game.player.clickProgress || 0;
        _progressBars.clickProgress.refresh();
        _progressBars.bonusProgress.progress = this.game.player.bonusProgress || 0;
        _progressBars.bonusProgress.refresh();

        // create the asteroid(s)
        var numAsteroids = _currentCell.data.asteroids.length;
        for (i = 0; i < numAsteroids; i++) {
            if ( _currentCell.data.asteroids[i].health <= 0 )   continue;

            var asteroid = this.game.add.sprite(Settings.display.width / 2, Settings.display.height / 2, 'asteroid', 0);
            asteroid.scale.set(_currentCell.data.asteroids[i].size);
            asteroid.x = 100 + Math.random() * (Settings.display.width - 100 - asteroid.width);
            asteroid.y = 150 + Math.random() * (Settings.display.height - 150 - asteroid.height * 2);
            // generate the animation frame array
            var asteroidFrameArray = [];
            for (var j = 0; j < 31; j++) asteroidFrameArray.push(j);
            // create the animation 'rotate'
            asteroid.animations.add('rotate', asteroidFrameArray, 10, true);
            asteroid.animations.play('rotate');

            // attach the asteroid's model data to the sprite for easy reference
            asteroid.model = _currentCell.data.asteroids[i];
            // set the sprite's health object
            asteroid.maxHealth = _currentCell.data.asteroids[i].maxHealth;
            asteroid.health = _currentCell.data.asteroids[i].health;

            asteroid.inputEnabled = true;
            asteroid.events.onInputDown.add(function (target, pointer) {
                _clickEngine.click({pos: pointer.positionDown, target: target}, true);
            });
            _asteroids.push(asteroid);
        }

        // create the powerup shop item sprites (buttons)
        var powerupSprite;
        var powerupArray = this.game.shop.items('powerups');
        for (i = 0, len = powerupArray.length; i < len; i++) {
            var powerup = powerupArray[i];

            if (!playerHasPurchasedPowerup(this.game.player, powerup) || !powerup.metadata.buyOnce) {
                powerupSprite = this.game.add.sprite(0, 0, 'powerups', powerup.imageIndex);
                powerupSprite.shopItem = powerup;
                powerupSprite.width *= Settings.display.dpi;
                powerupSprite.height *= Settings.display.dpi;
                powerupSprite.x = (i % POWERUPS_PER_LINE) * powerupSprite.width;
                powerupSprite.y = Settings.display.height - (powerupSprite.height * (POWERUP_LINES - Math.floor(i / POWERUPS_PER_LINE)));
                powerupSprite.inputEnabled = true;
                powerupSprite.events.onInputUp.add(onPowerupClicked);

                var powerupText = this.game.add.text(0, 0, '$' + powerup.price, {
                    font: '10pt Arial',
                    align: 'center',
                    boundsAlignH: 'center',
                    boundsAlignV: 'bottom',
                    fill: 'white'
                });
                powerupText.setTextBounds(0, 0, powerupSprite.width, powerupSprite.height);
                powerupSprite.addChild(powerupText);

                powerupText = this.game.add.text(0, 0, powerup.name, {
                    font: '8pt Arial',
                    align: 'center',
                    boundsAlignH: 'center',
                    boundsAlignV: 'top',
                    fill: 'white'
                });
                powerupText.setTextBounds(0, 0, powerupSprite.width, powerupSprite.height);
                powerupSprite.addChild(powerupText);
            }
        }

        // create the starmap button
        _btnStarmap = this.game.add.sprite(0, 0, 'starbutton');
        _btnStarmap.scale.set(0.6);
        _btnStarmap.x = Settings.display.width - _btnStarmap.width - 10;
        _btnStarmap.y = Settings.display.height - _btnStarmap.height - 10;
        _btnStarmap.inputEnabled = true;
        _btnStarmap.events.onInputDown.add(this.gotoStarmap.bind(this));

        // apply already purchased powerups
        this.removeTemporaryPowerups();
        this.game.player.purchasedPowerups.forEach(function (powerup) {
            _activePowerups[powerup.classname] = PowerupFactory.createPowerup(powerup.classname, powerup.metadata);
        });
    };

    o.update = function () {
        _clickSummary.setText(this.generateClickText());

        // process game powerup effects
        this._processGamePowerupEffects();
        this._processClickAnimations();

        // save the player every second
        if (Date.now() - _lastTick > Settings.gameMechanics.delayBetweenPlayerSaveMS) {
            this._savePlayerObject();
            _lastTick = Date.now();
        }
    };

    o.shutdown = function() {
        this.removeTemporaryPowerups();
    };

    o.removeTemporaryPowerups = function() {
        var powerups = this.game.player.purchasedPowerups;

        for (var i = 0, len = powerups.length; i < len; i++) {
            switch (powerups[i].classname) {
                case    'autoclick':
                    powerups.splice(i--, 1);
                    len--;
                    break;

                default:
                    break;
            }
        }

        this.game.savePlayerObject();
    };

    o.onReward = function (value) {
        var pt = value.metaData.pos;
        var target = value.metaData.target;
        var clickProgress = _progressBars.clickProgress;
        var txt;

        clickProgress.progress += Settings.gameMechanics.clickProgressIncrement * (value.isCritical ? Settings.gameMechanics.clickProgressCritMultiplier : 1);
        clickProgress.refresh();

        // in the case of an autoclick, there is no target so we can randomly pick one
        if (!target && _asteroids.length > 0) {
            target = _asteroids[Math.floor(Math.random() * _asteroids.length)];
            pt.x = target.x + target.width / 2;
            pt.y = target.y + target.height /2;
        }

        // if we have a target, lets do some damage!
        if (target) {
            txt = this.game.add.text(pt.x, pt.y, value.value, {
                font: value.isCritical ? 'bold 18pt Arial' : '16pt Arial',
                align: 'center',
                fill: value.isCritical ? "#FF8080" : "#FFFFFF"
            });
            txt.anchor.set(0.5, 0.5);
            _clickTextObjects.push(txt);

            target.damage(value.value);
            target.model.health = target.health > 0 ? target.health : 0;

        } else {
            // no asteroids left so we should stop the auto-click powerup
            for (k in _activePowerups) {
                if (k == 'autoclick') {
                    _activePowerups[k].expired = true;
                }
            }
        }

        if (target && !target.alive) {
            for (var i = 0; i < _asteroids.length; i++) {
                if (_asteroids[i] == target) {
                    _asteroids.splice(i, 1);
                    console.log('removed asteroid - ' + _asteroids.length + ' asteroids remaining');

                    var explosion = this.game.add.sprite(target.x + target.width / 2, target.y + target.height / 2, 'explode', 0);
                    explosion.anchor.set(0.5);
                    explosion.scale.set(target.scale.x, target.scale.y);
                    explosion.animations.add('blowup', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], false);
                    explosion.play('blowup', 15, false, true);

                    break;
                }
            }
        }

        if (clickProgress.progress >= 1) {
            // Click Progress completed! Do something cool!
            _clickEngine.setComboRewardMultiplier(_clickEngine.comboRewardMultiplier() + 1);
            clickProgress.progress = 0;
        }
    };

    o._processGamePowerupEffects = function () {
        var powerupKeys = Object.keys(_activePowerups);
        for (var i = 0, len = powerupKeys.length; i < len; i++) {
            _activePowerups[powerupKeys[i]].onTick(_clickEngine);
            if (_activePowerups[powerupKeys[i]].expired) {
                console.log('Removing powerup: ' + powerupKeys[i]);
                delete _activePowerups[powerupKeys[i]];

            }
        }
    };

    o._processClickAnimations = function () {
        for (var i = 0, len = _clickTextObjects.length; i < len; i++) {
            var o = _clickTextObjects[i];
            if (o.alpha > 0) {
                o.y -= 2;
                o.alpha -= 0.01;
            } else {
                _clickTextObjects.splice(i--, 1);
                len--;
                o.kill();
            }
        }
    };

    o._savePlayerObject = function () {
        this.game.player.score = _clickEngine.score();
        this.game.player.clicks = _clickEngine.clickCount();
        this.game.player.crits = _clickEngine.critCount();
        this.game.player.clickProgress = _progressBars.clickProgress.progress;
        this.game.player.bonusProgress = _progressBars.bonusProgress.progress;
        this.game.savePlayerObject();
    };

    o.generateClickText = function () {
        return 'Score: ' + _clickEngine.score() + ' | Clicks: ' + _clickEngine.clickCount() + ' | Crits: ' + _clickEngine.critCount() +
            ' | Crit%: ' + (_clickEngine.critChance() * 100).toFixed(2) + '% | Combo: x' + _clickEngine.comboRewardMultiplier() +
            ' | Asteroids: ' + _asteroids.length;
    };

    o.gotoStarmap = function(target) {
        this.state.start('starmap');
    };

    function onPowerupClicked(target, pointer) {
        var shopItem = target.shopItem;
        if (_clickEngine.score() >= shopItem.price) {
            console.log('Purchased ' + shopItem.name);
            _clickEngine.setScore(_clickEngine.score() - shopItem.price);
            _activePowerups[shopItem.classname] = PowerupFactory.createPowerup(shopItem.classname, shopItem.metadata);
            target.game.player.purchasedPowerups = target.game.player.purchasedPowerups || [];
            target.game.player.purchasedPowerups.push(shopItem);
            if (shopItem.metadata.buyOnce) {
                target.kill();
            } else {
                target.visible = false;
            }
        }
    }

    function playerHasPurchasedPowerup(player, powerup) {
        return player.purchasedPowerups.some(function (i) {
            return (i.classname == powerup.classname && i.name == powerup.name);
        })
    }


    return o;
})();