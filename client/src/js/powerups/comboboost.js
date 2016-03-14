/**
 * Created by petermares on 14/03/2016.
 */

module.exports = ComboBoostPowerup;

function ComboBoostPowerup(config) {
    this.comboThreshold = config.comboThreshold;
    this.buyOnce = config.comboThreshold;

    this.onTick = function(clickEngine) {
        clickEngine.setComboClickThreshold(this.comboThreshold);
    }
}