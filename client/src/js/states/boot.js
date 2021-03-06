/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    var ClickerEngine = require('../models/clickerengine');
    var Player = require('../models/player');
    var o = {};

    o.preload = function() {
        // force portrait mode
        if ( !this.game.device.desktop ) {
            this.scale.forceOrientation(false, true);
            this.scale.enterIncorrectOrientation.add(function() {
                // generic handler for when the device is rotated into the incorrect orientation
            });
            this.scale.refresh();
        }
    };

    o.create = function() {
        // ensure that during scaling, the original proportions are maintained
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // start the physics system
        //this.game.physics.startSystem(Phaser.Physics[settings.physicsEngine]);

        this.game.player = localStorage.getItem('player');
        //if ( 1 ) {
        if ( !this.game.player ) {
            this.game.player = new Player(generateID());
            localStorage.setItem('player', JSON.stringify(this.game.player));
        } else {
            this.game.player = JSON.parse(this.game.player);
        }

        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        // lets move along!
        this.state.start('preload');
    };

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