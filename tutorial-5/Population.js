import settings from 'settings';
import _ from 'lodash';

export default class Population {
    constructor(room) {
        this.room = room;

        this.population = 0;
        this.multiplier = 9;
        this.creeps     = this.room.find(FIND_MY_CREEPS);
        this.distro     = {};

        _.assign(this.distro, settings.creeps);

        for (var i = 0; i < this.creeps.length; i++) {
            let creepType, memory = this.creeps[i].memory;
            //if (undefined === memory.role) {
                memory.role = this.creeps[i].memory.role = this.creeps[i].name.split('-')[0];
            //}
            creepType = memory.role;

            if (!this.distro[creepType]) {
                throw Error("Unknown creep type: " + creepType);
            }

            this.distro[creepType].total++;
        }

        for (var name in this.distro) {
            if (this.distro[name].total === undefined) {
                this.distro[name].total = 0;
            }

            var curr = this.distro[name];

            this.distro[name].currentPercentage = curr.total / this.getTotalPopulation();
        }
    }

    goalsMet() {
        for (let name in this.distro) {
            let type = this.distro[name],
                goal = settings.creeps[name].goalPercentage,
                max  = settings.creeps[name].max;

            if (type.currentPercentage < (goal - goal / 4) && type.total < max || type.total == 0 || type.total < max * 0.75) {
                return false;
            }
        }

        return true;
    }

    getType(type) {
        return this.distro[type];
    }

    getTypes() {
        return this.distro;
    }

    getTotalPopulation() {
        return this.creeps.length;
    }

    getMaxPopulation() {
        return global.Cache.remember(
            'max-population',
            () => {
                let population = 0;
                let types      = this.getTypes();
                for (var n in types) {
                    population += types[n].max;
                }

                return population;
            }
        );
    }

    getNextExpectedDeath() {
        return global.Cache.remember(
            'creep-ttl',
            () => {
                var ttl = 100000;
                for (var i = 0; i < this.creeps.length; i++) {
                    var creep = this.creeps[i];

                    if (creep.ticksToLive < ttl) {
                        ttl = creep.ticksToLive;
                    }
                }

                return ttl;
            }
        );
    }
}
