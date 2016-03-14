/**
 * Created by petermares on 14/03/2016.
 */

module.exports = AutoClickPowerup;

function AutoClickPowerup(config) {
    this.clicks_per_second = config.clicks_per_second;
    this.expires = config.expires;
    this.buyOnce = config.buyOnce;
    this.lastTime = Date.now();

    this.onTick = function(clickEngine) {
        if ( Date.now() - this.lastTime > 1000 / this.clicks_per_second ) {
            clickEngine.click({x: 200, y: 200}, false);
            this.lastTime = Date.now();
        }
    }
}

