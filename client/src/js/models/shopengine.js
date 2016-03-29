/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {

    var _items = {};

    function ShopEngine() {
    }

    ShopEngine.prototype.add = function(category, item) {
        if ( _validateItem(item) ){
            _items[category] = _items[category] || [];
            _items[category].push(item);

        }
    };

    ShopEngine.prototype.categories = function() {
        var cats = [];

        for ( c in _items ) {
            cats.push(c);
        }
        return cats;
    };

    ShopEngine.prototype.items = function(category) {
        var items = [];

        if ( _items[category] ) {
            _items[category].forEach(function(i) {
                items.push(i);
            })
        }

        return items;
    };

    ShopEngine.prototype.allItems = function() {
        return _items;
    };

    function _validateItem(item) {
        return (
            item.classname != null &&
            item.name != null &&
            item.description != null &&
            item.price != null &&
            item.image != null &&
            item.metadata != null
        )
    }

    return ShopEngine;

})();