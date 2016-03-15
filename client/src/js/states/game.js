/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};
    var ClickerEngine = require('../engine/clickerengine');
    var PowerupFactory = require('../powerups/powerupfactory');
    var settings = require('../../settings');

    var _clickEngine;
    var _clickSummary;
    var _clickTextObjects = [];

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
        clickGraphic.beginFill(0x60600B);
        clickGraphic.drawRect(0, 0, settings.display.width, 400);
        var clickArea = this.game.add.sprite(0, 50);
        clickArea.addChild(clickGraphic);
        clickArea.inputEnabled = true;
        clickArea.events.onInputDown.add(function(target, pointer) {
            _clickEngine.click(pointer.positionDown, true);
        });

        _clickSummary = this.game.add.text(0, 0, _clickEngine.clickCount(), {
            font: '16pt Arial',
            align: 'center',
            boundsAlignH: 'left',
            boundsAlignV: 'top',
            fill: 'white'
        });
        _clickSummary.setTextBounds(10, 10, 150, 0);

        // create the powerup shot item sprites (buttons)
        var powerupSprite;
        var powerupArray = this.game.shop.items('powerups');
        for ( var i = 0, len = powerupArray.length; i < len; i++ ) {
            var powerup = powerupArray[i];

            if ( !playerHasPurchasedPowerup(this.game.player, powerup) || !powerup.metadata.buyOnce) {
                powerupSprite = this.game.add.sprite(0, 0, 'powerups', powerup.imageIndex)
                powerupSprite.shopItem = powerup;
                powerupSprite.x = (i%POWERUPS_PER_LINE) * 60;
                powerupSprite.y = settings.display.height - (powerupSprite.height * (POWERUP_LINES-Math.floor(i/POWERUPS_PER_LINE)));
                powerupSprite.inputEnabled = true;
                powerupSprite.events.onInputUp.add(onPowerupClicked);

                var priceText = this.game.add.text(0, 0, '$' + powerup.price, {
                    font: '10pt Arial',
                    align: 'center',
                    fill: 'white'
                });
                powerupSprite.addChild(priceText);
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
        if ( Date.now() - _lastTick > 1000 ) {
            this._savePlayerObject();
        }
    };

    o.onReward = function(value) {
        var pt = value.metaData;
        var txt = this.game.add.text(pt.x, pt.y, value.value, {
            font: value.isCritical ? 'bold 18pt Arial' : '16pt Arial',
            align: 'center',
            fill: value.isCritical ? "#FF8080" : "#FFFFFF"
        });

        txt.anchor.set(0.5, 0.5);
        _clickTextObjects.push(txt);

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
                o.alpha -= 0.02;
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