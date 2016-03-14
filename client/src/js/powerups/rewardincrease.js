/**
 * Created by petermares on 14/03/2016.
 */

module.exports = RewardIncreasePowerup;

function RewardIncreasePowerup(config) {
    this.rewardValue = config.rewardValue;
    this.buyOnce = config.buyOnce;

    this.onTick = function(clickEngine) {
        clickEngine.setReward(this.rewardValue);
    }
}