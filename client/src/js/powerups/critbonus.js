/**
 * Created by petermares on 14/03/2016.
 */

module.exports = CritBonusPowerup;

function CritBonusPowerup(config) {
    // TODO: If you create a base powerup object, it should have an 'apply once' property for this kind of effect
    this.applied = false;
    this.expired = false;
    this.critChanceIncrease = config.critChanceIncrease;
    this.expiresAfter = config.expiresAfter;
    this.appliedTimestamp = null;
    this.expiryTimestamp = null;

    console.log(this);

    this.onTick = function(_clickEngine) {
        if ( !this.applied ) {
            this.applied = true;
            this.appliedTimestamp = Date.now();
            if ( this.expiresAfter ) {
                this.expiryTimestamp = this.appliedTimestamp + this.expiresAfter;
            }
            _clickEngine.setCritChance( _clickEngine.critChance() + this.critChanceIncrease );
        } else {
            if ( this.expiresAfter ) {
                if ( Date.now() > this.expiryTimestamp ) {
                    _clickEngine.setCritChance( _clickEngine.critChance() - this.critChanceIncrease );
                    this.expired = true;
                }
            }
        }
    }
}