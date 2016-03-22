/**
 * Created by petermares on 19/03/2016.
 */

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var Polygon = require('../objects/polygon');

    var NUM_COLS = 7, NUM_ROWS = 5;

    var _starmap;
    var _selectedHex;
    var _pirate;
    var _lastTick = Date.now();

    o.preload = function() {

    };

    o.create = function() {
        // create the starmap
        this.createStarmap();
        // create the pirate sprite
        _pirate = this.game.add.sprite(0, 0, 'pirate');
        _pirate.anchor.set(0.5, 0.5);
        _pirate.scale.set(0.4);

        var index = this.game.player.mapIndex || Math.floor(NUM_ROWS/2)*NUM_COLS + Math.floor(NUM_COLS/2);
        var centerHex = _starmap.getChildAt(index);
        this.highlightHex(centerHex, true);

        this.game.player.mapIndex = index;

        _pirate.x = _starmap.x + centerHex.center().x + 6;
        _pirate.y = _starmap.y + centerHex.center().y + 2;
    };

    o.update = function() {
        // save the player every second
        if ( Date.now() - _lastTick > Settings.gameMechanics.delayBetweenPlayerSaveMS ) {
            this.game.savePlayerObject();
            _lastTick = Date.now();
        }
    };

    o.createStarmap = function() {
        var _this = this;
        var numColumns = NUM_COLS, numRows = NUM_ROWS;
        var hex, x = 0, y = 0;
        var size = 120;
        var gapX = size*0.77, gapY = size*0.90;
        var right = 0, bottom = 0;

        _starmap = this.game.add.sprite(0, 0);

        for ( var i = 0; i < numColumns*numRows; i++ ) {
            if ( i != 0 ) {
                y = (i % numColumns) % 2 != 0 ? size*0.45 : 0;
                y += (Math.floor(i/numColumns))*/*size*0.88*/gapY;
                x = (i%numColumns) * gapX;
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
                _this.game.player.mapIndex = target.index;
                //console.log(target.index + ' hex selected (w: ' + (target.x + target.width) + ')');
                //console.log(_selectedHex.index + ' hex unselected: ' + _selectedHex.index%numColumns + ', ' + Math.floor(_selectedHex.index/numRows));
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

