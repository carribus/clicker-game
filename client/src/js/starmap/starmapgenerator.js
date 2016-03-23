/**
 * Created by petermares on 23/03/2016.
 */

module.exports = (function() {
    var o = {};
    var cellTypes = [
        {
            type: 'empty',
            weight: 0.6
        },
        {
            type: 'asteroids',
            weight: 0.25
        },
        {
            type: 'starport',
            weight: 0.15
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
        var val;

        for ( var i = 0, len = numCols*numRows; i < len; i++ ) {
            val = Math.random() * 100000;

            // TODO: you left off here - generate celltypes based on their respective weighting
            map.map.push({
                cellType: cellTypes[Math.floor(Math.random()*cellTypes.length)]
            });
        }

        return map;
    };

    return o;
})();

