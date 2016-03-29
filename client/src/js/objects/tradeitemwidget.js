/**
 * Created by petermares on 29/03/2016.
 */
(function() {
    var UIButton = require('./uibutton');

    module.exports = TradeItemWidget;

    function TradeItemWidget(game, x, y, width, height, item) {
        UIButton.call(this, game, x, y, width, height, item.name);

        var fontSize = height * 0.1;
        this.anchor.set(0.5);
        this.label.fontWeight = 'bold';
        this.label.boundsAlignH = 'left';
        this.label.fontSize = fontSize + 'pt';
        this.label.y -= 60;

        var fontSize = height * 0.1;
        this.txtQuantity = game.add.text(0, 0, 'Qty: ' + item.quantity, {
            font: fontSize + 'pt Arial',
            boundsAlignH: 'left',
            boundsAlignV: 'middle',
            fill: 'white'
        });
        this.txtQuantity.anchor.set(0.5);
        this.addChild(this.txtQuantity);

        this.sellPrice = game.add.text(0, 40, 'Sell: ' + item.sellPrice, {
            font: fontSize + 'pt Arial',
            boundsAlignH: 'left',
            boundsAlignV: 'middle',
            fill: 'green'
        });
        this.sellPrice.anchor.set(0.5);
        this.addChild(this.sellPrice);

        this.buyPrice = game.add.text(0, 70, 'Buy: ' + item.buyPrice, {
            font: fontSize + 'pt Arial',
            boundsAlignH: 'left',
            boundsAlignV: 'middle',
            fill: 'red'
        });
        this.buyPrice.anchor.set(0.5);
        this.addChild(this.buyPrice);
    }
    TradeItemWidget.prototype = Object.create(UIButton.prototype);
    TradeItemWidget.prototype.constructor = TradeItemWidget;
})();
