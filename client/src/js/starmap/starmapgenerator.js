/**
 * Created by petermares on 23/03/2016.
 */

module.exports = (function() {
    var Settings = require('../../settings');

    var o = {};
    var cellTypes = [
        {
            type: 'empty',
            weight: 0.5
        },
        {
            type: 'asteroids',
            weight: 0.40
        },
        {
            type: 'starport',
            weight: 0.10
        }
    ];

    /**
     * Generate a starmap array with placements of various celltypes based on their respective weighting
     * @param width
     * @param height
     */
    o.generate = function(numCols, numRows) {
        var map = {
            summary: {
                cols: numCols,
                rows: numRows
            },
            map: []
        };
        var threshold = 100000;
        var val, currentMarker;

        for ( var i = 0, len = numCols*numRows; i < len; i++ ) {
            val = Math.random() * threshold;

            currentMarker = 0;
            for ( var j = 0; j < cellTypes.length; j++ ) {
                currentMarker += cellTypes[j].weight;
                if ( currentMarker * threshold > val ) {
                    break;
                }
            }

            //map.map.push({
            //    cellType: cellTypes[j].type
            //});
            map.map.push(this.configureCell(cellTypes[j].type));
        }

        return map;
    };

    o.configureCell = function(cellType) {
        var cell = {
            cellType: cellType,
            data: {}
        };

        switch ( cellType ) {
            case    'asteroids':
                var numAsteroids = 3 + Math.floor(Math.random() * 10);

                cell.data.asteroids = [];
                for ( var i = 0; i < numAsteroids; i++ ) {
                    var size = 1 + Math.floor(Math.random() * 3);
                    cell.data.asteroids.push({
                        size: size,
                        maxHealth: Settings.gameMechanics.asteroidBaseHealth * size,
                        health: Settings.gameMechanics.asteroidBaseHealth * size
                    })
                }
                break;

            case    'starport':
                break;

            case    'empty':
                break;
        }

        return cell;
    };

    return o;
})();

