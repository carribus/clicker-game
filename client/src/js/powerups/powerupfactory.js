/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var o = {};
    var _powerupObjects = {
        autoclick: require('./autoclick'),
        critbonus: require('./critbonus'),
        rewardincrease: require('./rewardincrease'),
        comboboost: require('./comboboost')
    };

    o.createPowerup = function(classname, data) {
        var powerup;

        if ( _powerupObjects[classname] ) {
            powerup = new _powerupObjects[classname](data);
        } else {
            throw "No powerup class " + classname + " exists!";
        }

        return powerup;
    };

    return o;
})();