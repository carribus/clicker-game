/**
 * Created by petermares on 26/03/2016.
 */

module.exports = Dialog;

function Dialog(game, x, y, width, height, backgroundColour, borderColour) {
    this.backgroundColour = backgroundColour;
    this.borderColour = borderColour;
    this.bmp = game.add.bitmapData(width, height);

    Phaser.Sprite.call(this, game, x, y, this.bmp);

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

    ctx.lineWidth = 4;
    ctx.strokeStyle = this.borderColour;
    ctx.fillStyle = this.backgroundColour;
    ctx.fill();
    ctx.stroke();


    this.bmp.dirty = true;
};