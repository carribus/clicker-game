/**
 * Created by petermares on 27/03/2016.
 */

module.exports = DlgStarPort;

var Dialog = require('../objects/dialog');
var UIButton = require('../objects/uibutton');

var TRADE_ITEMS = [
    {
        name: 'Ore',
        buyPrice: 200,
        sellPrice: 150,
        quantity: 10000
    },
    {
        name: 'Crystal',
        buyPrice: 1000,
        sellPrice: 600,
        quantity: 1000
    },
    {
        name: 'Metal Scrap',
        buyPrice: 500,
        sellPrice: 300,
        quantity: 200
    },
    {
        name: 'Capacitors',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    },
    {
        name: 'Capacitors',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    },
    {
        name: 'Capacitors',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    },
    {
        name: 'Capacitors',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    },
    {
        name: 'Capacitors',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    },
    {
        name: 'Food Supplies',
        buyPrice: 200,
        sellPrice: 50,
        quantity: 5000
    }
];

function DlgStarPort(game, x, y, width, height) {
    Dialog.call(this, game, x, y, width, height, 'black', '#60FF60');
    this.alpha = 0.8;
    this.setTitle('Starport Options');

    // construct the UI objects
    this._createMainPanel(game, x, y, width, height);
    this._createTradePanel(game, x, y, width, height);

}

DlgStarPort.prototype = Object.create(Dialog.prototype);
DlgStarPort.prototype.constructor = DlgStarPort;

DlgStarPort.prototype.onTradeButtonPressed = function() {
    console.log('Trade button pressed');
    this.showPanel('trade', true);
    this.showPanel('main', false);
    this.setTitle('Starport Options: Trade');
};

DlgStarPort.prototype.onUpgradesButtonPressed= function() {
    console.log('Upgrades button pressed');
};

DlgStarPort.prototype.onShipButtonPressed = function() {
    console.log('Ship button pressed');
};

DlgStarPort.prototype._createMainPanel = function(game, x, y, width, height) {
    var mainPanel = this.addPanel('main', true);
    var button = new UIButton(game, 0, -150, width*0.5, 100, 'TRADE', this.onTradeButtonPressed, this);
    button.anchor.set(0.5);
    mainPanel.addChild(button);

    button = new UIButton(game, 0, 0, width*0.5, 100, 'UPGRADES', this.onUpgradesButtonPressed, this);
    button.anchor.set(0.5);
    mainPanel.addChild(button);

    button = new UIButton(game, 0, 150, width*0.5, 100, 'SHIP', this.onShipButtonPressed, this);
    button.anchor.set(0.5);
    mainPanel.addChild(button);
};

DlgStarPort.prototype._createTradePanel = function(game, x, y, width, height) {
    var tradePanel = this.addPanel('trade', false);
    var itemWidth = 200, itemHeight = 200;
    var padding = (this.width % itemWidth) / 4;
    var x = 0, y = 0;

    console.log('padding = ' + padding);

    console.log('this.x = ' + this.x);
    console.log('this.right = ' + (this.x + this.width));
    console.log('this.y = ' + this.y);
    for ( var i = 0, len = TRADE_ITEMS.length; i < len; i++ ) {
        var item = new TradeItemWidget(game, 0, 0, itemWidth, itemHeight, TRADE_ITEMS[i]);
        item.x = -this.width/2 + item.width/2 + padding + ((i%3)*(itemWidth+padding));
        item.y = -this.height/2 + item.height/2 + padding + this.titleHeight + (Math.floor(i/3)*(itemHeight+padding));
        game.world.add(item);
        tradePanel.addChild(item);

        x += item.width;
    }
};

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