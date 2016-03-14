(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by petermares on 14/03/2016.
 */

(function() {
    console.log("Game booting!");
    var settings = require('../settings');

    var Game = new Phaser.Game(settings.display.width,
        settings.display.height,
        Phaser.AUTO,
        ''
    );

    Game.state.add('boot', require('./states/boot'));
    //Game.state.add('preloader', require('./states/preloader'));
    //Game.state.add('mainmenu', require('./states/mainmenu'));
    //Game.state.add('game', require('./states/game'));

    Game.state.start('boot');

})();
},{"../settings":3,"./states/boot":2}],2:[function(require,module,exports){
/**
 * Created by petermares on 14/03/2016.
 */

module.exports = (function() {
    var settings = require('../../settings');
    var o = {};

    o.preload = function() {
    };

    o.create = function() {

        // ensure that during scaling, the original proportions are maintained
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // set the background colour
        this.game.stage.backgroundColor = '#000';

        // start the physics system
        //this.game.physics.startSystem(Phaser.Physics[settings.physicsEngine]);

        //var playerId = localStorage.getItem('playerId');
        //if(!playerId) {
        //    playerId = generateID();
        //    localStorage.setItem('playerId', playerId);
        //}

        // generate the player ID
        //settings.playerID = playerId;
        //console.log("PlayerID = " + settings.playerID);

        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        // lets move along!
        //this.state.start('preloader');

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
},{"../../settings":3}],3:[function(require,module,exports){
/**
 * Created by petermares on 14/03/2016.
 */
module.exports = {
    server: {
        host: 'localhost',
        port: 5555
    },
    display: {
        width: 1024,
        height: 768
    }
};
},{}]},{},[1]);
