/**
 * Created by petermares on 16/03/2016.
 */

module.exports = ProgressBar;

function ProgressBar(game, x, y, width, height, fillColour, backgroundColour) {
    this.fillColour = fillColour;
    this.backgroundColour = backgroundColour;
    this.progress = 0;
    this.bmp = game.add.bitmapData(width, height);

    Phaser.Sprite.call(this, game, x, y, this.bmp);
    this.refresh();
}

ProgressBar.prototype = Object.create(Phaser.Sprite.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.refresh = function() {
    var progress = Phaser.Math.clamp(this.progress, 0, 1);
    var fillWidth = this.width * progress;

    this.bmp.clear();
    this.bmp.ctx.fillStyle = this.backgroundColour;
    this.bmp.ctx.fillRect(0, 0, this.width, this.height);
    this.bmp.ctx.fillStyle = this.fillColour;
    this.bmp.ctx.fillRect(0, 0, fillWidth, this.height);

    this.bmp.dirty = true;
};