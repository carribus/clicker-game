/**
 * Created by petermares on 18/03/2016.
 */

module.exports = Starfield;

function Starfield(game, x, y, width, height, numStars) {
    this.stars = this._generateStars(numStars, width, height);
    this.bmp = game.add.bitmapData(width, height);
    this.lastTick = Date.now();
    this.speed = 1;

    Phaser.Sprite.call(this, game, x, y, this.bmp);
    this.update();
}

Starfield.prototype = Object.create(Phaser.Sprite.prototype);
Starfield.prototype.constructor = Starfield;

Starfield.prototype.update = function() {
    var colour;

    if ( Date.now() - this.lastTick > 20 ) {

        this.bmp.ctx.fillStyle = '#000000';

        for (var i = 0, len = this.stars.length; i < len; i++) {
            star = this.stars[i];

            // clear out the old star
            this.bmp.ctx.fillStyle = '#000000';
            this.bmp.ctx.fillRect(star.x-1, star.y-1, 4, 4);

            // update the stars position
            star.x -= (5 - star.z) * this.speed;
            if (star.x < 0) {
                star.x = this.width;
            }

            switch (star.z) {
                case 0:
                    colour = '#FFFFFF';
                    break;

                case 1:
                    colour = '#CCCCCC';
                    break;

                case 2:
                    colour = '#909090';
                    break;

                case 3:
                    colour = '#505050';
                    break;
            }

            this.bmp.ctx.fillStyle = colour;
            this.bmp.ctx.fillRect(star.x, star.y, 2, 2);
        }

        this.bmp.dirty = true;

        this.lastTick = Date.now();
    }
};

Starfield.prototype._generateStars = function(numStars, width, height) {
    var stars = [];
    var star;

    for ( var i = 0; i < numStars; i++ ) {
        star = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
            z: Math.floor(Math.random() * 4)
        };
        stars.push(star);
    }

    return stars;
};