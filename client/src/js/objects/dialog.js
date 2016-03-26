/**
 * Created by petermares on 26/03/2016.
 */

module.exports = Dialog;

function Dialog(game, x, y, width, height, backgroundColour, borderColour) {
    this.backgroundColour = backgroundColour;
    this.borderColour = borderColour;
    this.bmp = game.add.bitmapData(width, height);
    this.titleHeight = 80;
    this.closeButton = game.add.button(0, 10, 'button_close', this.onCloseButtonPressed, this);
    this.closeButton.scale.set(1.2);
    this.txtTitle = game.add.text(20, 2, 'Untitled Dialog', {
        font: '28pt Arial',
        boundsAlignH: 'left',
        boundsAlignV: 'middle',
        fill: 'white'
    });
    this.txtTitle.setTextBounds(0, 0, width, this.titleHeight);

    Phaser.Sprite.call(this, game, x, y, this.bmp);
    this.addChild(this.txtTitle);
    this.addChild(this.closeButton);
    this.closeButton.input.priorityID = 1;
    this.closeButton.x = width - 10 - this.closeButton.width;

    this.refresh();
}

Dialog.prototype = Object.create(Phaser.Sprite.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype.refresh = function() {
    var ctx = this.bmp.ctx;

    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(this.width, 0);
    ctx.lineTo(this.width, this.height-10);
    ctx.lineTo(this.width-10, this.height);
    ctx.lineTo(0, this.height);
    ctx.lineTo(0, 10);
    ctx.closePath();

    ctx.moveTo(0, this.titleHeight);
    ctx.lineTo(this.width, this.titleHeight);

    ctx.lineWidth = 4;
    ctx.strokeStyle = this.borderColour;
    ctx.fillStyle = this.backgroundColour;
    ctx.fill();
    ctx.stroke();

    this.bmp.dirty = true;
};

Dialog.prototype.setTitle = function(title) {
    this.txtTitle.text = title;
    this.refresh();
};

Dialog.prototype.onCloseButtonPressed = function(target) {
    console.log('Dialog: Close Button Pressed');
};