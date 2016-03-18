/**
 * Created by petermares on 14/03/2016.
 */

// TODO: Refactor this so that the instance specific properties are actually part of the instance...

module.exports = (function () {

    function ClickerEngine() {
        this._score = 0;
        this._clickCount = 0;
        this._clickReward = 1;
        this._critCount = 0;
        this._critChance = 0.01;
        this._critRewardMultiplier = 2;
        this._comboRewardMultiplier = 1;
        this._comboClickCount = 0;
        this._comboClickThreshold = 10;
        this._lastClick = Date.now();
        this._subscribers = {
            reward: []
        };

    }

    ClickerEngine.prototype.click = function (metaData, canCombo) {
        var reward = {
            value: this._clickReward,
            isCritical: false,
            metaData: metaData
        };

        if ( Date.now() - this._lastClick < 500 ) {
            if ( canCombo ) {
                this._comboClickCount++;
                if ( this._comboClickCount >= this._comboClickThreshold-1 ) {
                    this._comboClickCount = 0;
                    this._comboRewardMultiplier += 0.01;
                }
            }
        } else {
            this._comboClickCount = 0;
            this._comboRewardMultiplier = 1;
        }

        reward.value *= this._comboRewardMultiplier;

        if ( Math.random() * 100000 < 100000*this._critChance ) {
            reward.value *= this._critRewardMultiplier;
            reward.isCritical = true;
            this._critCount++;
        }

        reward.value = Math.round(reward.value * 100) / 100;

        this._score += reward.value;
        this._score = Math.round(this._score * 100) / 100;

        this.dispatchEvent('reward', reward);

        if ( canCombo ) {
            this._clickCount++;
            this._lastClick = Date.now();
        }
    };

    ClickerEngine.prototype.setReward = function(v) {
        this._clickReward = v;
    };

    ClickerEngine.prototype.setScore = function(score) {
        this._score = Math.round(score * 100) / 100;
    };

    ClickerEngine.prototype.score = function() {
        return this._score;
    };

    ClickerEngine.prototype.setClickCount = function(v) {
        this._clickCount = v;
    };

    ClickerEngine.prototype.clickCount = function() {
        return this._clickCount;
    };

    ClickerEngine.prototype.setCritCount = function(v) {
        this._critCount = v;
    };

    ClickerEngine.prototype.critCount = function() {
        return this._critCount;
    };

    ClickerEngine.prototype.setCritChance = function(chance) {
        console.log('setCritChance(' + chance + ')');
        if ( chance <= 1 && chance >= 0 ) {
            this._critChance = Math.round(chance*100)/100;
            console.log('Crit Chance: ' + chance);
        }
    };

    ClickerEngine.prototype.critChance = function() {
        return this._critChance;
    };

    ClickerEngine.prototype.comboClickThreshold = function() {
        return this._comboClickThreshold;
    };

    ClickerEngine.prototype.setComboClickThreshold = function(v) {
        this._comboClickThreshold = v;
    };

    ClickerEngine.prototype.comboRewardMultiplier = function() {
        return Math.round(this._comboRewardMultiplier*100)/100;
    };

    ClickerEngine.prototype.setComboRewardMultiplier = function(v) {
        this._comboRewardMultiplier = v;
    };

    ClickerEngine.prototype.subscribe = function(type, callback) {
        this._subscribers[type] = this._subscribers[type] || [];
        this._subscribers[type].push(callback);
    };

    ClickerEngine.prototype.dispatchEvent = function(type, value) {
        if( this._subscribers[type] && this._subscribers[type].length ) {
            this._subscribers[type].forEach(function(f) {
                f(value);
            });
        }
    };

    return ClickerEngine;
})();


