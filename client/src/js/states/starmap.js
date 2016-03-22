/**
 * Created by petermares on 19/03/2016.
 */

var STARMAP_DEFINITION = [
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    },
    {
        cellType: 'asteroids'
    },
    {
        cellType: 'empty'
    }
];

module.exports = (function() {
    var o = {};
    var Settings = require('../../settings');
    var Polygon = require('../objects/polygon');

    var NUM_COLS = 7, NUM_ROWS = 5;
    var HEX_SIZE = 120;

    var _starmap;
    var _selectedHex;
    var _playerHex;
    var _pirate, _asteroid
    var _btnTravel;

    var _lastTick = Date.now();

    o.preload = function() {

    };

    o.create = function() {
        this.game.player.travel = null;

        if (this.game.player.mapIndex == undefined ) {
            this.game.player.mapIndex = Math.floor(NUM_ROWS/2)*NUM_COLS + Math.floor(NUM_COLS/2);
        }

        // create the starmap
        this.createStarmap();

        // create the pirate sprite
        _pirate = this.game.add.sprite(0, 0, 'pirate');
        _pirate.anchor.set(0.5, 0.5);
        _pirate.scale.set(0.4);

        // create the travel button
        var text = this.game.add.text(0, 0, 'Travel', {
            font: '24pt Arial',
            align: 'center',
            boundsAlignH: 'center',
            boundsAlignV: 'center',
            fill: 'white'
        });
        _btnTravel = this.game.add.sprite(Settings.display.width/2, Settings.display.height - 100);
        _btnTravel.addChild(text);
        _btnTravel.anchor.set(0.5, 0.5);
        _btnTravel.inputEnabled = true;
        _btnTravel.events.onInputDown.add(this.onTravelButtonPressed.bind(this));
        _btnTravel.visible = false;

        // refresh the starmap with the correct colouring per cell
        var index = this.game.player.mapIndex;
        _playerHex = _starmap.getChildAt(index);
        this.refreshStarmap();
        this.highlightHex(_playerHex, true);
        this.game.player.mapIndex = index;

        // position the player marker correctly on the map
        _pirate.x = _starmap.x + _playerHex.center().x + 6;
        _pirate.y = _starmap.y + _playerHex.center().y + 2;
    };

    o.onTravelButtonPressed = function(target) {
        if ( _selectedHex ) {
            this.game.player.travel = {
                fromHex: this.game.player.mapIndex,
                toHex: _selectedHex.index,
                cellType: _selectedHex.cellType
            };
            this.game.savePlayerObject();
            this.game.state.start('travel');
        }
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
        var size = HEX_SIZE;
        var gapX = size*0.77, gapY = size*0.90;
        var right = 0, bottom = 0;
        var fillColour, strokeColour;

        _starmap = this.game.add.sprite(0, 0);

        for ( var i = 0; i < numColumns*numRows; i++ ) {
            fillColour = '#202020';
            strokeColour = '#505050';
            if ( i != 0 ) {
                y = (i % numColumns) % 2 != 0 ? size*0.45 : 0;
                y += (Math.floor(i/numColumns))*/*size*0.88*/gapY;
                x = (i%numColumns) * gapX;
            }

            hex = new Polygon(this.game, x, y, size, 6, fillColour, strokeColour);
            hex.index = i;
            hex.alpha = 0.75;
            hex.inputEnabled = true;

            hex.events.onInputOver.add(function(target, pointer) {
                if ( target != _playerHex && target != _selectedHex && _this.isHexAdjacent(target, _playerHex)) {
                    _this.highlightHex(target, true);
                }
            });
            hex.events.onInputOut.add(function(target, pointer) {
                if ( target != _playerHex && target != _selectedHex && _this.isHexAdjacent(target, _playerHex)) {
                    _this.highlightHex(target, false);
                }
            });
            hex.events.onInputDown.add(function(target, pointer) {
                if ( _this.isHexAdjacent(target, _playerHex) ) {
                    if ( _selectedHex && _selectedHex != target ) {
                        _this.highlightHex(_selectedHex, false);
                    }
                    _this.selectHex(target, true);
                    _this.game.player.mapIndex = target.index;

                    _this.showTravelButton(true);
                }
            });
            _starmap.addChild(hex);

            if ( hex.x + hex.width > right )    right = hex.x + hex.width;
            if ( hex.y + hex.height > bottom )  bottom = hex.y + hex.height;
        }

        _starmap.x = Settings.display.width/2 - right/2;
        _starmap.y = Settings.display.height/2 - bottom/2;
    };

    o.refreshStarmap = function() {
        var hex;
        var fillColour, strokeColour;

        for ( var i = 0, len = NUM_COLS*NUM_ROWS; i < len; i++ ) {
            hex = _starmap.getChildAt(i);
            if ( this.isHexAdjacent(hex, _playerHex) ) {
                fillColour = '#202050';
                strokeColour = '#A0A0FF';
                hex.fillColour = fillColour;
                hex.strokeColour = strokeColour;
                hex.refresh();
            }

            hex.cellType = STARMAP_DEFINITION[i].cellType;
            switch ( STARMAP_DEFINITION[i].cellType ) {
                case    'asteroids':
                    // create the asteroid sprite
                    _asteroid = this.game.add.sprite(0, 0, 'asteroid', 0);
                    _asteroid.anchor.set(0.5);
                    _asteroid.scale.set(0.5);
                    _asteroid.x = _starmap.x + hex.center().x;
                    _asteroid.y = _starmap.y + hex.center().y;
                    this.game.world.sendToBack(_asteroid);
                    break;
                case    'empty':
                default:
                    break;
            }

        }
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

    o.isHexAdjacent = function(src, target) {
        var distance = HEX_SIZE*1;
        var sCenter = src.center();
        var tCenter = target.center();

        return ( Math.abs(sCenter.x-tCenter.x) <= distance && Math.abs(sCenter.y - tCenter.y) <= distance );
    };

    o.showTravelButton = function(show) {
        _btnTravel.visible = show;
    }

    return o;
})();

