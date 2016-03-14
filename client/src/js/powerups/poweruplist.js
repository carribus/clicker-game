/**
 * Created by petermares on 14/03/2016.
 */

module.exports = [
    {
        classname: 'rewardincrease',
        name: 'Reward Increase 1',
        description: 'Increase reward per click to 3',
        price: 100,
        image: 'powerup',
        imageIndex: 2,
        metadata: {
            rewardValue: 3,
            buyOnce: true
        }
    },
    {
        classname: 'autoclick',
        name: 'Auto-click 1',
        description: 'Automatically click once per second',
        price: 100.00,
        image: 'powerups',
        imageIndex: 0,
        metadata: {
            clicks_per_second: 1,
            buyOnce: true
        }
    },
    {
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
    },
    {
        classname: 'rewardincrease',
        name: 'Reward Increase 2',
        description: 'Increase reward per click to 6',
        price: 600,
        image: 'powerup',
        imageIndex: 10,
        metadata: {
            rewardValue: 6,
            buyOnce: true
        }
    },
    {
        classname: 'autoclick',
        name: 'Auto-click 2',
        description: 'Automatically click 3 times per second',
        price: 250.00,
        image: 'powerups',
        imageIndex: 8,
        metadata: {
            clicks_per_second: 3,
            buyOnce: true
        }
    },
    {
        classname: 'critbonus',
        name: 'CritBonus 2',
        description: 'Increase Critical Chance by 10% for 25 seconds',
        price: 1000.00,
        image: 'powerups',
        imageIndex: 9,
        metadata: {
            critChanceIncrease: 0.10,
            expiresAfter: 25*1000
        }
    },
    {
        classname: 'rewardincrease',
        name: 'Reward Increase 3',
        description: 'Increase reward per click to 15',
        price: 2500,
        image: 'powerup',
        imageIndex: 18,
        metadata: {
            rewardValue: 15,
            buyOnce: true
        }
    },
    {
        classname: 'autoclick',
        name: 'Auto-click 3',
        description: 'Automatically click 6 times per second',
        price: 5000.00,
        image: 'powerups',
        imageIndex: 16,
        metadata: {
            clicks_per_second: 6,
            expiresAfter: 0,
            buyOnce: true
        }
    },
    {
        classname: 'critbonus',
        name: 'CritBonus 2',
        description: 'Increase Critical Chance by 25% for 25 seconds',
        price: 5000.00,
        image: 'powerups',
        imageIndex: 17,
        metadata: {
            critChanceIncrease: 0.25,
            expiresAfter: 25*1000
        }
    }

];