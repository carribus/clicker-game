/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};
    var ClickerEngine = require('../engine/clickerengine');
    var PowerupFactory = require('../powerups/powerupfactory');
    var settings = require('../../settings');

    var ProgressBar = require('../objects/progressbar');

    var _clickEngine;
    var _clickSummary;
    var _clickTextObjects = [];
    var _asteroids = [];

    var _progressBars = {
        clickProgress: null,
        bonusProgress: null
    };

    var _lastTick = Date.now();

    var _activePowerups = {};

    var POWERUPS_PER_LINE = 4;
    var POWERUP_LINES = 3;

    o.preload = function() {
    };

    o.create = function() {
        _score = 0;

        _clickEngine = new ClickerEngine();
        _clickEngine.setScore(this.game.player.score);
        _clickEngine.setClickCount(this.game.player.clicks);
        _clickEngine.setCritCount(this.game.player.crits);
        _clickEngine.subscribe('reward', this.onReward.bind(this));

        _clickSummary = this.game.add.text(0, 0, _clickEngine.clickCount(), {
            font: '16pt Arial',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'center',
            fill: 'white'
        });
        _clickSummary.setTextBounds(5, 22, settings.display.width, 0);

        // create the progress bars
        _progressBars.clickProgress = new ProgressBar(this.game, 5, 5, settings.display.width-10, 10, '#8080FF', '#606060');
        this.game.world.add(_progressBars.clickProgress);
        _progressBars.bonusProgress = new ProgressBar(this.game, 5, 55, settings.display.width-10, 10, '#FF8080', '#606060');
        this.game.world.add(_progressBars.bonusProgress);
        _progressBars.clickProgress.progress = this.game.player.clickProgress;
        _progressBars.clickProgress.refresh();
        _progressBars.bonusProgress.progress = this.game.player.bonusProgress;
        _progressBars.bonusProgress.refresh();

        // create the asteroid(s)
        var numAsteroids = 3 + Math.floor(Math.random()*10);
        for ( var i = 0; i < numAsteroids; i ++ ) {
            var asteroid = this.game.add.sprite(settings.display.width/2, settings.display.height/2, 'asteroid', 0);
            asteroid.scale.set(1 + Math.floor(Math.random() * 3));
            asteroid.x = 100 + Math.random()*(settings.display.width - 100 - asteroid.width);
            asteroid.y = 150 + Math.random()*(settings.display.height - 150 - asteroid.height*2);
            //asteroid.anchor.set(0.5, 0.5);
            var asteroidFrameArray = [];
            for ( var j = 0; j < 31; j++ ) asteroidFrameArray.push(j);
            asteroid.animations.add('rotate', asteroidFrameArray, 10, true);

            asteroid.maxHealth = 1000 * asteroid.scale.x;
            asteroid.health = asteroid.maxHealth;

            asteroid.inputEnabled = true;
            asteroid.events.onInputDown.add(function(target, pointer) {
                _clickEngine.click({pos: pointer.positionDown, target: target}, true);
            });
            _asteroids.push(asteroid);
        }

        // create the powerup shop item sprites (buttons)
        var powerupSprite;
        var powerupArray = this.game.shop.items('powerups');
        for ( var i = 0, len = powerupArray.length; i < len; i++ ) {
            var powerup = powerupArray[i];

            if ( !playerHasPurchasedPowerup(this.game.player, powerup) || !powerup.metadata.buyOnce) {
                powerupSprite = this.game.add.sprite(0, 0, 'powerups', powerup.imageIndex);
                powerupSprite.shopItem = powerup;
                powerupSprite.width *= settings.display.dpi;
                powerupSprite.height *= settings.display.dpi;
                powerupSprite.x = (i%POWERUPS_PER_LINE) * powerupSprite.width*2;
                powerupSprite.y = settings.display.height - (powerupSprite.height * (POWERUP_LINES-Math.floor(i/POWERUPS_PER_LINE)));
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

        // apply already purchased powerups
        this.game.player.purchasedPowerups.forEach(function(powerup) {
            _activePowerups[powerup.classname] = PowerupFactory.createPowerup(powerup.classname, powerup.metadata);
        });
    };

    o.update = function() {
        _clickSummary.setText(this._generateClickText());

        // process game powerup effects
        this._processGamePowerupEffects();
        this._processClickAnimations();

        _asteroids.forEach(function(a) {
            a.animations.play('rotate');
        });

        // save the player every second
        if ( Date.now() - _lastTick > settings.gameMechanics.delayBetweenPlayerSaveMS ) {
            this._savePlayerObject();
            _lastTick = Date.now();
        }
    };

    o.onReward = function(value) {
        var pt = value.metaData.pos;
        var target = value.metaData.target;
        var clickProgress = _progressBars.clickProgress;
        var txt = this.game.add.text(pt.x, pt.y, value.value, {
            font: value.isCritical ? 'bold 18pt Arial' : '16pt Arial',
            align: 'center',
            fill: value.isCritical ? "#FF8080" : "#FFFFFF"
        });

        txt.anchor.set(0.5, 0.5);
        _clickTextObjects.push(txt);

        clickProgress.progress += settings.gameMechanics.clickProgressIncrement * (value.isCritical ? settings.gameMechanics.clickProgressCritMultiplier : 1);
        clickProgress.refresh();

        if ( !target && _asteroids.length > 0 ) {
            target = _asteroids[Math.floor(Math.random() * _asteroids.length)];
            txt.x = target.x + target.width/2;
            txt.y = target.y + target.height/2;
        }
        if ( target ) {
            console.log(target.health);
            target.damage(value.value);
        }

        if ( !target.alive ) {
            for ( var i = 0; i < _asteroids.length; i++ ) {
                if ( _asteroids[i] == target ) {
                    _asteroids.splice(i, 1);
                    console.log('removed asteroid - ' + _asteroids.length + ' asteroids remaining');
                    break;
                }
            }
        }

        if ( clickProgress.progress >= 1 ) {
            // Click Progress completed! Do something cool!
            _clickEngine.setComboRewardMultiplier( _clickEngine.comboRewardMultiplier() + 1 );
            clickProgress.progress = 0;
        }

        _score += value.value;
    };

    o._processGamePowerupEffects = function() {
        var powerupKeys = Object.keys(_activePowerups);
        for ( var i = 0, len = powerupKeys.length; i < len; i++ ) {
            _activePowerups[powerupKeys[i]].onTick(_clickEngine);
            if ( _activePowerups[powerupKeys[i]].expired ) {
                console.log('Removing powerup: ' + powerupKeys[i]);
                delete _activePowerups[powerupKeys[i]];
            }
        }
    };

    o._processClickAnimations = function() {
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

    o._savePlayerObject = function() {
        this.game.player.score = _clickEngine.score();
        this.game.player.clicks = _clickEngine.clickCount();
        this.game.player.crits = _clickEngine.critCount();
        this.game.player.clickProgress = _progressBars.clickProgress.progress;
        this.game.player.bonusProgress = _progressBars.bonusProgress.progress;
        this.game.savePlayerObject();
    };

    o._generateClickText = function() {
        return 'Score: ' + _clickEngine.score() + ' | Clicks: ' + _clickEngine.clickCount() + ' | Crits: ' + _clickEngine.critCount() +
            ' | Crit%: ' + (_clickEngine.critChance()*100).toFixed(2) + '% | Combo: x' + _clickEngine.comboRewardMultiplier() +
            ' | Asteroids: ' + _asteroids.length;
    };

    function onPowerupClicked(target, pointer) {
        var shopItem = target.shopItem;
        if ( _clickEngine.score() >= shopItem.price ) {
            console.log('Purchased ' + shopItem.name);
            _clickEngine.setScore(_clickEngine.score()-shopItem.price);
            _activePowerups[shopItem.classname] = PowerupFactory.createPowerup(shopItem.classname, shopItem.metadata);
            target.game.player.purchasedPowerups = target.game.player.purchasedPowerups || [];
            target.game.player.purchasedPowerups.push(shopItem);
            if ( shopItem.metadata.buyOnce ) {
                target.kill();
            }
        }
    }

    function playerHasPurchasedPowerup(player, powerup) {
        return player.purchasedPowerups.some(function(i) {
            return (i.classname == powerup.classname && i.name == powerup.name);
        })
    }


    return o;
})();