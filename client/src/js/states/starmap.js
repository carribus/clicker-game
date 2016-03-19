/**
 * Created by petermares on 19/03/2016.
 */

module.exports = (function() {
    var o = {};
    Polygon = require('../objects/polygon');

    o.preload = function() {

    };

    o.create = function() {
        var numBlockPerLine = 10;
        var hex, x = 0, y = 0;
        var size = 120;
        for ( var i = 0; i < 40; i++ ) {
            if ( i != 0 ) {
                y = i % 2 != 0 ? size*0.45 : 0;
                y += (Math.floor(i/numBlockPerLine))*size*0.88;
                x = (i%numBlockPerLine) * size*0.75;
            }
            hex = new Polygon(this.game, x, y, size, 6);
            hex.inputEnabled = true;
            hex.events.onInputOver.add(function(target, point) {
                target.fillColour = '#502050';
                target.strokeColour = '#FFA0A0'
                target.refresh();
            });
            this.game.world.add(hex);
        }
    };

    o.update = function() {

    };

    return o;
})();

