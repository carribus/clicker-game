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

        // create the click area
        var clickGraphic = this.game.add.graphics(0, 0);
        clickGraphic.beginFill(0x80C080);
        clickGraphic.drawRect(0, 0, settings.display.width, 600);
        var clickArea = this.game.add.sprite(0, 75);
        clickArea.addChild(clickGraphic);
        clickArea.inputEnabled = true;
        clickArea.events.onInputDown.add(function(target, pointer) {
            _clickEngine.click(pointer.positionDown, true);
        });

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
        _progressBars.clickProgress.refresh()
        _progressBars.bonusProgress.progress = this.game.player.bonusProgress;
        _progressBars.bonusProgress.refresh()

        // create the powerup shot item sprites (buttons)
        var powerupSprite;
        var powerupArray = this.game.shop.items('powerups');
        for ( var i = 0, len = powerupArray.length; i < len; i++ ) {
            var powerup = powerupArray[i];

            if ( !playerHasPurchasedPowerup(this.game.player, powerup) || !powerup.metadata.buyOnce) {
                powerupSprite = this.game.add.sprite(0, 0, 'powerups', powerup.imageIndex)
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
                    font: '10pt Arial',
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

        // save the player every second
        if ( Date.now() - _lastTick > settings.gameMechanics.delayBetweenPlayerSaveMS ) {
            this._savePlayerObject();
        }
    };

    o.onReward = function(value) {
        var pt = value.metaData;
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

        if ( clickProgress.progress >= 1 ) {
            // Click Progress completed! Do something cool!
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
        localStorage.setItem('player', JSON.stringify(this.game.player));
    };

    o._generateClickText = function() {
        return 'Score: ' + _clickEngine.score() + ' | Clicks: ' + _clickEngine.clickCount() + ' | Crits: ' + _clickEngine.critCount() +
            ' | Crit%: ' + (_clickEngine.critChance()*100).toFixed(2) + '% | Combo: x' + _clickEngine.comboRewardMultiplier();
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