/**
 * Created by petermares on 27/03/2016.
 */

module.exports = DlgStarPort;

var Dialog = require('../objects/dialog');
var UIButton = require('../objects/uibutton');
var TradeItemWidget = require('../objects/tradeitemwidget');

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
        name: 'Food Supplies',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    },
    {
        name: 'Alcohol',
        buyPrice: 2500,
        sellPrice: 1500,
        quantity: 100
    }
];

function DlgStarPort(game, x, y, width, height) {
    Dialog.call(this, game, x, y, width, height, 'black', '#60FF60');
    this.alpha = 0.8;
    this.setTitle('Starport Options');

    // construct the UI objects
    this._createMainPanel(game, x, y, width, height);
    this._createTradePanel(game, x, y, width, height);
    this._createUpgradesPanel(game, x, y, width, height);

}

DlgStarPort.prototype = Object.create(Dialog.prototype);
DlgStarPort.prototype.constructor = DlgStarPort;

DlgStarPort.prototype.onTradeButtonPressed = function() {
    console.log('Trade button pressed');
    this.switchToPanel('trade');
    this.setTitle('Starport Options: Trade');
};

DlgStarPort.prototype.onUpgradesButtonPressed= function() {
    console.log('Upgrades button pressed');
    this.switchToPanel('upgrades');
    this.setTitle('Starport options: Upgrades');
};

DlgStarPort.prototype.onShipButtonPressed = function() {
    console.log('Ship button pressed');
};

DlgStarPort.prototype.onBackButtonPressed = function() {
    this.switchToPanel('main');
};

DlgStarPort.prototype.switchToPanel = function(panelName) {
    for ( k in this.panels ) {
        this.panels[k].visible = (k == panelName);
    }
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
    var numItemsPerRow = 3; //Math.floor(this.width / itemWidth);
    //var padding = this.width % itemWidth / numItemsPerRow;
    var padding = Math.floor((this.width - (numItemsPerRow * itemWidth)) / numItemsPerRow) / 2;
    var x, y;

    console.log('numItemsPerRow = ' + numItemsPerRow);
    console.log('padding = ' + padding);

    x = -this.width/2 + itemWidth/2 + padding;
    y = -this.height/2 + itemHeight/2 + this.titleHeight + padding;

    for ( var i = 0, len = TRADE_ITEMS.length; i < len; i++ ) {
        var item = new TradeItemWidget(game, 0, 0, itemWidth, itemHeight, TRADE_ITEMS[i]);
        item.x = padding + x;
        item.y = y;

        if ( item.x + itemWidth/2 > this.width/2 ) {
            x = -this.width/2 + itemWidth/2 + padding;
            y += itemHeight + padding;
            item.x = padding + x;
            item.y = y;
        }
        game.world.add(item);
        tradePanel.addChild(item);

        x += itemWidth + padding;
    }

    var backButton = new UIButton(game, 0, this.height/2-110, this.width*0.8, 100, 'Back', this.onBackButtonPressed, this);
    backButton.anchor.set(0.5);
    tradePanel.addChild(backButton);
};

DlgStarPort.prototype._createUpgradesPanel = function(game, x, y, width, height) {
    var panel = this.addPanel('upgrades', false);

    var upgrades = [
        {

        }
    ]


};