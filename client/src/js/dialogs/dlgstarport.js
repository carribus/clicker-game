/**
 * Created by petermares on 27/03/2016.
 */

module.exports = DlgStarPort;

var Dialog = require('../objects/dialog');
var UIButton = require('../objects/uibutton');

function DlgStarPort(game, x, y, width, height) {
    Dialog.call(this, game, x, y, width, height, 'black', '#60FF60');
    this.alpha = 0.8;
    this.setTitle('Starport Options');

    // construct the UI objects
    var mainPanel = this.addPanel('main', true);
    var button = new UIButton(game, 0, -100, width*0.5, height/10, 'TRADE', this.onTradeButtonPressed, this);
    button.anchor.set(0.5);
    mainPanel.addChild(button);

    button = new UIButton(game, 0, 0, width*0.5, height/10, 'UPGRADES', this.onUpgradesButtonPressed, this);
    button.anchor.set(0.5);
    mainPanel.addChild(button);

    button = new UIButton(game, 0, 100, width*0.5, height/10, 'SHIP', this.onShipButtonPressed, this);
    button.anchor.set(0.5);
    mainPanel.addChild(button);

}

DlgStarPort.prototype = Object.create(Dialog.prototype);
DlgStarPort.prototype.constructor = DlgStarPort;

DlgStarPort.prototype.onTradeButtonPressed = function() {
    console.log('Trade button pressed');
};

DlgStarPort.prototype.onUpgradesButtonPressed= function() {
    console.log('Upgrades button pressed');
};

DlgStarPort.prototype.onShipButtonPressed= function() {
    console.log('Ship button pressed');
};