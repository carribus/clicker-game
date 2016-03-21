/**
 * Created by petermares on 19/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var Polygon = require('../objects/polygon');

    var _starmap;
    var _selectedHex;

    o.preload = function() {

    };

    o.create = function() {
        this.createStarmap();
    };

    o.update = function() {

    };

    o.createStarmap = function() {
        var _this = this;
        var numColumns = 5, numRows = 5;
        var hex, x = 0, y = 0;
        var size = 120;
        var right = 0, bottom = 0;

        _starmap = this.game.add.sprite(0, 0);

        for ( var i = 0; i < numColumns*numRows; i++ ) {
            if ( i != 0 ) {
                y = (i % numColumns) % 2 != 0 ? size*0.45 : 0;
                y += (Math.floor(i/numColumns))*size*0.88;
                x = (i%numColumns) * size*0.75;
            }
            hex = new Polygon(this.game, x, y, size, 6);
            hex.index = i;
            hex.inputEnabled = true;
            hex.events.onInputOver.add(function(target, pointer) {
                if ( target != _selectedHex ) {
                    _this.highlightHex(target, true);
                }
            });
            hex.events.onInputOut.add(function(target, pointer) {
                if ( target != _selectedHex ) {
                    _this.highlightHex(target, false);
                }
            });
            hex.events.onInputDown.add(function(target, pointer) {
                if ( _selectedHex && _selectedHex != target ) {
                    _this.highlightHex(_selectedHex, false);
                }
                _this.selectHex(target, true);
                console.log(target.index + ' hex selected (w: ' + (target.x + target.width) + ')');
                console.log(_selectedHex.index + ' hex unselected: ' + _selectedHex.index%numColumns + ', ' + Math.floor(_selectedHex.index/numRows));
            });
            _starmap.addChild(hex);

            if ( hex.x + hex.width > right )    right = hex.x + hex.width;
            if ( hex.y + hex.height > bottom )  bottom = hex.y + hex.height;
        }

        _starmap.x = Settings.display.width/2 - right/2;
        _starmap.y = Settings.display.height/2 - bottom/2;
    };

    o.highlightHex = function(hex, highlightOn) {
        if ( highlightOn ) {
            hex.fillColour = '#502050';
            hex.strokeColour = '#FFA0A0'
        } else {
            hex.fillColour = '#202050';
            hex.strokeColour = '#A0A0FF';
        }

        hex.refresh();
    };

    o.selectHex = function(hex, selectOn) {
        _selectedHex = selectOn ? hex : null;
        if ( selectOn ) {
            hex.selected = true;
            hex.fillColour = '#205020';
            hex.strokeColour = '#A0FFA0';
        } else {
            this.highlightHex(hex, false);
        }

        hex.refresh();
    };

    return o;
})();

