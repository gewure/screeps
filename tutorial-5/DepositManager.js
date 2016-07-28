import settings from 'settings';
import _ from 'lodash';

export default class DepositManager {
    static EMPTY_LEVEL = 0.5;

    constructor(game, room, spawns) {
        this.game = game;
        this.room = room;
        this.spawns = spawns

        this.deposits = room.find(FIND_MY_STRUCTURES, {filter: this._filterExtensions});
        for (var i; i < spawns.length; i++) {
            this.deposits.push(spawns[i]);
        }
    }

    _filterExtensions(structure) {
        return structure.structureType == STRUCTURE_EXTENSION;
    }

    getSpawnDeposit() {
        return this.spawns.length != 0 ? this.spawns[0] : false;
    }

    getEmptyDeposits() {
        return global.Cache.remember(
            'empty-deposits',
            () => {
                let empty = [];
                for (var i = 0; i < this.deposits.length; i++) {
                    let res = this.deposits[i];
                    if (this.isEmptyDeposit(res)) {
                        empty.push(res);
                    }
                }

                return empty;
            }
        );
    }

    isEmptyDeposit(deposit) {
        return deposit.energy / deposit.energyCapacity < DepositManager.EMPTY_LEVEL;
    }

    getEmptyDepositById(id) {
        var resource = this.game.getObjectById(id);

        return resource && this.isEmptyDeposit(resource) ? resource : false;
    }

    getClosestEmptyDeposit(creep) {
        let resources = this.getEmptyDeposits(),
            resource  = false;

        if (resources.length != 0) {
            resource = creep.pos.findClosest(resources);
        }

        if (!resource) {
            return this.getSpawnDeposit();
        }

        return resource;
    }

    energy() {
        return global.Cache.remember(
            'deposits-energy',
            () => {
                let energy    = 0,
                    resources = this.deposits;

                for (let i = 0; i < resources.length; i++) {
                    let res = resources[i];
                    energy += res.energy;
                }

                for (let i = 0; i < this.spawns.length; i++) {
                    energy += this.spawns[i].energy;
                }

                return energy;
            }
        );
    }

    energyCapacity() {
        return global.Cache.remember(
            'deposits-energy-capacity',
            () => {
                let energyCapacity = 0,
                    resources      = this.deposits;

                for (let i = 0; i < resources.length; i++) {
                    let res = resources[i];
                    energyCapacity += res.energyCapacity;
                }

                for (let i = 0; i < this.spawns.length; i++) {
                    energyCapacity += this.spawns[i].energyCapacity;
                }

                return energyCapacity;
            }
        );
    }

    getFullDeposits() {
        return global.Cache.remember(
            'deposits-full',
            () => {
                let full     = [],
                    deposits = this.deposits;

                for (let i = 0; i < deposits.length; i++) {
                    let deposit = deposits[i];
                    if (deposit.energy == deposit.energyCapacity) {
                        full.push(deposit);
                    }
                }
                return full;
            }
        );
    }
}
