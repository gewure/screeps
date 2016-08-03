import Cache from "Cache";
import MainManager from 'MainManager';

global.Cache = new Cache();
global.log = function() {
    for (let index = 0; index < arguments.length; index++) {
        if (typeof arguments[index] === 'object') {
            arguments[index] = JSON.stringify(arguments[index]);
        }
    }

    console.log.apply(null, arguments);
};

const manager = new MainManager(Game);
manager.manage();

//for (let name in Game.creeps) { Game.creeps[name].suicide(); }; manager.garbageCollection();