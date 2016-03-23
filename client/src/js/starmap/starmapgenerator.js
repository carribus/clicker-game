/**
 * Created by petermares on 23/03/2016.
 */

module.exports = (function() {
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

            // TODO: you left off here - generate celltypes based on their respective weighting
            currentMarker = 0;
            for ( var j = 0; j < cellTypes.length; j++ ) {
                currentMarker += cellTypes[j].weight;
                if ( currentMarker * threshold > val ) {
                    break;
                }
            }
            map.map.push({
                cellType: cellTypes[j].type
            });
        }

        return map;
    };

    return o;
})();

