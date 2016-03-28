/**
 * Created by petermares on 27/03/2016.
 */

module.exports = UIButton;

function UIButton(game, x, y, width, height, label, callback, callbackContext) {
    this.fillColour = 'black';
    this.strokeColour = '#60FF60';
    this.bmp = game.add.bitmapData(width, height);
    this.callback = callback;
    this.callbackContext = callbackContext;
    Phaser.Image.call(this, game, x, y, this.bmp, callback, callbackContext);

    this.inputEnabled = true;
    this.input.priorityID = 1;
    this.input.useHandCursor = true;
    this.events.onInputOver.add(this.onInputOverHandler, this);
    this.events.onInputOut.add(this.onInputOutHandler, this);
    this.events.onInputDown.add(this.onInputDownHandler, this);
    this.events.onInputUp.add(this.onInputUpHandler, this);

    var fontSize = height * 0.3;
    this.label = game.add.text(0, 4, label, {
        font: fontSize + 'pt Arial',
        boundsAlignH: 'center',
        boundsAlignV: 'middle',
        fill: 'white'
    });
    this.label.anchor.set(0.5);
    this.addChild(this.label);

    this.refresh();
}

UIButton.prototype = Object.create(Phaser.Image.prototype);
UIButton.prototype.constructor = UIButton;

UIButton.prototype.refresh = function() {
    var ctx = this.bmp.ctx;

    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(this.width, 0);
    ctx.lineTo(this.width, this.height-10);
    ctx.lineTo(this.width-10, this.height);
    ctx.lineTo(0, this.height);
    ctx.lineTo(0, 10);
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.strokeColour;
    ctx.fillStyle = this.fillColour;
    ctx.fill();
    ctx.stroke();

    this.bmp.dirty = true;

};

UIButton.prototype.onInputOverHandler = function(target, pointer) {
    var oldFill = this.fillColour;
    this.fillColour = '#206020';
    this.refresh();
    this.fillColour = oldFill;
};

UIButton.prototype.onInputOutHandler = function(target, pointer) {
    this.refresh();
};

UIButton.prototype.onInputDownHandler = function(target, pointer) {
    this.onInputOverHandler();
    if ( this.callback ) {
        this.callback.call(this.callbackContext, target, pointer);
    }
};

UIButton.prototype.onInputUpHandler = function(target, pointer) {
    this.refresh();
}