export default class ConstructionManager {
    constructor(game, room) {
        this.game = game;
        this.room = room;

        this.sites                 = this.room.find(FIND_CONSTRUCTION_SITES);
        this.structures            = this.room.find(FIND_MY_STRUCTURES);
        this.damagedStructures     = this.getDamagedStructures();
        this.upgradeableStructures = this.getUpgradeableStructures();
        this.controller            = this.room.controller;
    }

    getDamagedStructures() {
        return global.Cache.remember(
            'damaged-structures',
            () => {
                return this.room.find(
                    FIND_MY_STRUCTURES,
                    {
                        filter: function (s) {
                            let targets = s.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                            if (targets.length != 0) {
                                return false;
                            }
                            if ((s.hits < s.hitsMax / 2 && s.structureType != STRUCTURE_RAMPART) || (s.structureType == STRUCTURE_RAMPART && s.hits < CONST.RAMPART_FIX)) {
                                return true;
                            }
                        }
                    }
                );
            }
        );
    }

    getUpgradeableStructures() {
        return global.Cache.remember(
            'upgradeable-structures',
            () => {
                return this.room.find(
                    FIND_MY_STRUCTURES,
                    {
                        filter: function (s) {
                            let targets = s.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                            if (targets.length != 0) {
                                return false;
                            }

                            if ((s.hits < s.hitsMax && s.structureType != STRUCTURE_RAMPART) || (s.structureType == STRUCTURE_RAMPART && s.hits < CONST.RAMPART_MAX)) {

                                return true;
                            }
                        }
                    }
                );
            }
        );
    }

    getConstructionSiteById(id) {
        return global.Cache.remember(
            'object-id-' + id,
            () => {
                return this.game.getObjectById(id);
            }
        );
    }

    getController() {
        return this.controller;
    }

    getClosestConstructionSite(creep) {
        let site = false;
        if (this.sites.length != 0) {
            site = creep.pos.findClosest(this.sites);
        }

        return site;
    }

    constructStructure(creep) {
        let avoidArea = creep.getAvoidedArea(),
            site, moveTo, buildRep;

        if (this.damagedStructures.length != 0) {
            site     = creep.creep.pos.findClosest(this.damagedStructures);
            moveTo   = creep.creep.moveTo(site, {avoid: avoidArea});
            buildRep = creep.creep.repair(site);
            //global.log(creep.name, "move: " + moveTo, "repair: " + buildRep);

            return site;
        }

        if (this.sites.length != 0) {
            site     = creep.creep.pos.findClosest(this.sites);
            moveTo   = creep.creep.moveTo(site, {avoid: avoidArea});
            buildRep = creep.creep.build(site);
            //global.log(creep.name, "move: " + moveTo, "build: " + buildRep);

            return site;
        }

        if (this.upgradeableStructures.length != 0) {
            site     = creep.creep.pos.findClosest(this.upgradeableStructures);
            moveTo   = creep.creep.moveTo(site, {avoid: avoidArea});
            buildRep = creep.creep.repair(site);
            //global.log(creep.name, "move: " + moveTo, "repair: " + buildRep);

            return site;
        }

        site = this.getController();
        creep.creep.moveTo(site, {avoid: avoidArea});
        creep.creep.upgradeController(site);
    }

    prioritize(sites) {

    }
}
