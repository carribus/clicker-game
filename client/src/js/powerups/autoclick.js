/**
 * Created by petermares on 14/03/2016.
 */

module.exports = AutoClickPowerup;

// TODO: Implement time based expiry on auto clicking

function AutoClickPowerup(config) {
    this.clicks_per_second = config.clicks_per_second;
    this.expiresAfter = config.expiresAfter;
    this.buyOnce = config.buyOnce;
    this.expired = false;
    this.lastTime = Date.now();
    this.expiryTimestamp;

    if ( this.expiresAfter ) {
        this.expireTimestamp = Date.now() + this.expiresAfter;
    }

    this.onTick = function(clickEngine) {
        var now = Date.now();

        if ( now <= this.expiryTimestamp || !this.expiryTimestamp ) {
            if ( now - this.lastTime > 1000 / this.clicks_per_second ) {
                clickEngine.click({x: 200, y: 200}, false);
                this.lastTime = Date.now();
            }
        } else {
            this.expired = true;
        }
    }
}

