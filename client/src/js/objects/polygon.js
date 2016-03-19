/**
 * Created by petermares on 19/03/2016.
 */

module.exports = Polygon;

function Polygon(game, x, y, size, numberOfSides) {
    this.backgroundColour = '#000000';
    this.fillColour = '#202050';
    this.strokeColour = '#A0A0FF'
    this.lineWidth = 5;
    this.bmp = game.add.bitmapData(size, size);

    Phaser.Sprite.call(this, game, x, y, this.bmp);

    this.refresh();
}

Polygon.prototype = Object.create(Phaser.Sprite.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.refresh = function() {
    var numberOfSides = 6;
    var ctx = this.bmp.ctx;
    var size = this.width/2 - this.lineWidth;
    var centerX = this.width / 2;
    var centerY = this.height / 2;

    this.bmp.clear();
    ctx.fillStyle = this.fillColour;

    ctx.beginPath();
    ctx.moveTo(centerX + size * Math.cos(0), centerY + size * Math.sin(0));

    for ( var i = 1; i <= numberOfSides; i++ ) {
        ctx.lineTo(centerX + size * Math.cos(i * 2 * Math.PI / numberOfSides),
            centerY + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }

    ctx.strokeStyle = this.strokeColour;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.fillStyle = this.fillColour;
    ctx.fill();
    ctx.closePath();

    this.bmp.dirty = true;
};