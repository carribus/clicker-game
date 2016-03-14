/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function () {
    var _score = 0;
    var _clickCount = 0;
    var _clickReward = 1;
    var _critCount = 0;
    var _critChance = 0.01;
    var _critRewardMultiplier = 2;
    var _comboRewardMultiplier = 1;
    var _comboClickCount = 0;
    var _comboClickThreshold = 10;
    var _lastClick = Date.now();

    var _subscribers = {
        reward: []
    };

    function ClickerEngine() {
    }

    ClickerEngine.prototype.click = function (metaData, canCombo) {
        var reward = {
            value: _clickReward,
            isCritical: false,
            metaData: metaData
        };

        if ( Date.now() - _lastClick < 500 ) {
            if ( canCombo ) {
                _comboClickCount++;
                if ( _comboClickCount >= _comboClickThreshold-1 ) {
                    _comboClickCount = 0;
                    _comboRewardMultiplier += 0.01;
                }
            }
        } else {
            _comboClickCount = 0;
            _comboRewardMultiplier = 1;
        }

        reward.value *= _comboRewardMultiplier;

        if ( Math.random() * 100000 < 100000*_critChance ) {
            reward.value *= _critRewardMultiplier;
            reward.isCritical = true;
            _critCount++;
        }

        reward.value = Math.round(reward.value * 100) / 100;

        _score += reward.value;
        _score = Math.round(_score * 100) / 100;

        this.dispatchEvent('reward', reward);

        if ( canCombo ) {
            _clickCount++;
            _lastClick = Date.now();
        }
    };

    ClickerEngine.prototype.setReward = function(v) {
        _clickReward = v;
    };

    ClickerEngine.prototype.setScore = function(score) {
        _score = Math.round(score * 100) / 100;
    };

    ClickerEngine.prototype.score = function() {
        return _score;
    };

    ClickerEngine.prototype.setClickCount = function(v) {
        _clickCount = v;
    };

    ClickerEngine.prototype.clickCount = function() {
        return _clickCount;
    };

    ClickerEngine.prototype.setCritCount = function(v) {
        _critCount = v;
    };

    ClickerEngine.prototype.critCount = function() {
        return _critCount;
    };

    ClickerEngine.prototype.setCritChance = function(chance) {
        console.log('setCritChance(' + chance + ')');
        if ( chance <= 1 && chance >= 0 ) {
            _critChance = Math.round(chance*100)/100;
            console.log('Crit Chance: ' + chance);
        }
    };

    ClickerEngine.prototype.critChance = function() {
        return _critChance;
    };

    ClickerEngine.prototype.comboClickThreshold = function() {
        return _comboClickThreshold;
    };

    ClickerEngine.prototype.setComboClickThreshold = function(v) {
        _comboClickThreshold = v;
    };

    ClickerEngine.prototype.comboRewardMultiplier = function() {
        return Math.round(_comboRewardMultiplier*100)/100;
    }

    ClickerEngine.prototype.subscribe = function(type, callback) {
        _subscribers[type] = _subscribers[type] || [];
        _subscribers[type].push(callback);
    };

    ClickerEngine.prototype.dispatchEvent = function(type, value) {
        if( _subscribers[type] && _subscribers[type].length ) {
            _subscribers[type].forEach(function(f) {
                f(value);
            });
        }
    };

    return ClickerEngine;
})();


