/**
 * Created by petermares on 29/03/2016.
 */

module.exports = Player;

function Player(id) {
    this.id = id;
    this.balance = 0;
    this.score = 0;
    this.clicks = 0;
    this.crits = 0;
    this.purchasedPowerups = [];
    this.starmap = null;
    this.mapIndex = -1;
    this.travel = null;
    this.lastState = null;
    this.distanceToTravel = null;
    this.distanceToTravel = null;
    this.inventorySize = 1;
    this.inventory = [];
}

Player.prototype.hasInventorySpace = function() {
    return this.inventory.length < this.inventorySize;
};

Player.prototype.addToInventory = function(item) {
    if ( this.hasInventorySpace() ) {
        this.inventory.push(item);
    }
};