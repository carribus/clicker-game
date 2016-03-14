/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    //var ClickerEnginePlugin = require('../plugins/clickerplugin');
    var ClickerEngine = require('../engine/clickerengine');
    var ShopEngine = require('../engine/shopengine');
    var PowerupList = require('../powerups/poweruplist');
    var o = {};

    o.preload = function() {
    };

    o.create = function() {

        // ensure that during scaling, the original proportions are maintained
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // set the background colour
        this.game.stage.backgroundColor = '#161616';

        // start the physics system
        //this.game.physics.startSystem(Phaser.Physics[settings.physicsEngine]);

        this.game.player = localStorage.getItem('player');
        if ( !this.game.player ) {
            this.game.player = {
                id: generateID(),
                score: 0,
                clicks: 0,
                crits: 0,
                purchasedPowerups: []
            };
            localStorage.setItem('player', JSON.stringify(this.game.player));
        } else {
            this.game.player = JSON.parse(this.game.player);
        }

        console.log('Player: ' + JSON.stringify(this.game.player));

        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        this.game.shop = new ShopEngine();
        configureShop(this.game.shop);

        // lets move along!
        this.state.start('preload');

    };

    function configureShop(shop) {
        PowerupList.forEach(function(powerup) {
            shop.add('powerups', powerup);
        });
/*
        shop.add('powerups', {
            classname: 'autoclick',
            name: 'Auto-click 1',
            description: 'Automatically click once per second',
            price: 100.00,
            image: 'powerups',
            imageIndex: 0,
            metadata: {
                clicks_per_second: 1,
                expiresAfter: 0
            }
        });
        shop.add('powerups', {
            classname: 'critbonus',
            name: 'CritBonus 1',
            description: 'Increase Critical Chance by 5% for 10 seconds',
            price: 250.00,
            image: 'powerups',
            imageIndex: 1,
            metadata: {
                critChanceIncrease: 0.05,
                expiresAfter: 10*1000
            }
        })
*/
    }

    function generateID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    return o;
})();