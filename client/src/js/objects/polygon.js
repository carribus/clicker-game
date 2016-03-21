/**
 * Created by petermares on 19/03/2016.
 */

module.exports = Polygon;

function Polygon(game, x, y, size, numberOfSides) {
    this.backgroundColour = '#000000';
    this.fillColour = '#202050';
    this.strokeColour = '#A0A0FF'
    this.lineWidth = 1;
    this.numberOfSides = numberOfSides || 6;
    this.bmp = game.add.bitmapData(size, size);
    this.polygon;

    Phaser.Sprite.call(this, game, x, y, this.bmp);

    this.refresh();
}

Polygon.prototype = Object.create(Phaser.Sprite.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.refresh = function() {
    var numberOfSides = this.numberOfSides;
    var ctx = this.bmp.ctx;
    var size = this.width/2 - this.lineWidth;
    var centerX = this.width / 2;
    var centerY = this.height / 2;
    var points = [];

    this.bmp.clear();
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.beginPath();
    ctx.arc(this.width/2, this.height/2, this.width/2, 0, 2*Math.PI);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.fillStyle = this.fillColour;
    ctx.beginPath();

    // first point
    points.push(new Phaser.Point(centerX + size * Math.cos(0), centerY + size * Math.sin(0)));
    console.log(centerY + size * Math.sin(0));
    ctx.moveTo(points[0].x, points[0].y);
    for ( var i = 1; i <= numberOfSides; i++ ) {
        // add the next point to the array (for hit test area creation)
        points.push(new Phaser.Point(centerX + size * Math.cos(i * 2 * Math.PI / numberOfSides),
                                     centerY + size * Math.sin(i * 2 * Math.PI / numberOfSides)));
        console.log(centerY + size * Math.sin(i * 2 * Math.PI / numberOfSides));
        // add the edge
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.strokeStyle = this.strokeColour;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.fillStyle = this.fillColour;
    ctx.fill();
    ctx.closePath();

    this.bmp.dirty = true;

    // set the hittest area
    this.polygon = new Phaser.Polygon();
    this.polygon.setTo(points);
    this.hitArea = this.polygon;
};

Polygon.prototype.center = function() {
    return {x: this.x + this.width/2, y: this.y + this.height/2};
};