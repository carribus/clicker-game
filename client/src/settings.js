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
        clickProgressCritMultiplier: 2
    }
};