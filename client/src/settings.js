/**
 * Created by petermares on 14/03/2016.
 */
module.exports = {
    server: {
        host: 'localhost',
        port: 5555
    },
    display: {
        width: window.innerWidth,
        height: window.innerHeight
        //width: window.innerWidth * window.devicePixelRatio,
        //height: window.innerHeight * window.devicePixelRatio
        //width: 1024,
        //height: 768
    },
    gameMechanics: {
        delayBetweenPlayerSaveMS: 1000,
        clickProgressIncrement: 0.001,
        clickProgressCritMultiplier: 2,
        distanceIdleIncrement: 2.5,
        distanceClickIncrement: 5000,
        distanceBetweenSectors: 100000,
        asteroidBaseHealth: 100
    }
};