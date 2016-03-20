/**
 * Created by petermares on 19/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Polygon = require('../objects/polygon');

    o.preload = function() {

    };

    o.create = function() {
        var numColumns = 10, numRows = 8;
        var hex, x = 0, y = 0;
        var size = 120;
        for ( var i = 0; i < numColumns*numRows; i++ ) {
            if ( i != 0 ) {
                y = i % 2 != 0 ? size*0.45 : 0;
                y += (Math.floor(i/numColumns))*size*0.88;
                x = (i%numColumns) * size*0.75;
            }
            hex = new Polygon(this.game, x, y, size, 6);
            hex.inputEnabled = true;
            hex.events.onInputOver.add(function(target, pointer) {
                if ( !target.selected ) {
                    target.fillColour = '#502050';
                    target.strokeColour = '#FFA0A0'
                    target.refresh();
                }
            });
            hex.events.onInputOut.add(function(target, pointer) {
                if ( !target.selected ) {
                    target.fillColour = '#202050';
                    target.strokeColour = '#A0A0FF'
                    target.refresh();
                }
            });
            hex.events.onInputDown.add(function(target, pointer) {
                target.selected = true;
                target.fillColour = '#205020';
                target.strokeColour = '#A0FFA0'
                target.refresh();
            });
            this.game.world.add(hex);
        }
    };

    o.update = function() {

    };

    return o;
})();

