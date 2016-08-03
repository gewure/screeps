import AbstractCreep from 'AbstractCreep';

/**
 * A Builders role is to upgrade the room controller
 */
export default class CreepBuilder extends AbstractCreep {
    constructor(game, creep, depositManager, constructionManager) {
        super(game, creep);
        this.depositManager      = depositManager;
        this.constructionManager = constructionManager;

        this.forceControllerUpgrade = false;
    }

    init() {
        this.remember('role', 'CreepBuilder');
        if (!this.remember('srcRoom')) {
            this.remember('srcRoom', this.creep.room.name);
        }

        if (this.moveToNewRoom() == true) {
            return;
        }

        //this.forceControllerUpgrade = this.remember('forceControllerUpgrade');

        this.act();
    }

    act() {
        // Finds a site to construct, and goes to it
        let site = this.constructionManager.constructStructure(this);

        // Transfers energy to creeps that are close
        /**
        if (this.creep.pos.inRangeTo(site, 3)) {
            this.giveEnergy(site);
        }
        //*/

        this.remember('last-energy', this.creep.carry.energy);
    }

    /**
     * Transfers energy to the closest creep that has no energy
     * This should help when a builder doesn't have direct access to a site, because there are others in the way
     */
    giveEnergy(site) {
        var creepsNear = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
        if (creepsNear.length) {
            if (site) {


                var closest = site.pos.findClosest(creepsNear.concat(this.creep), {
                    filter: function (c) {
                        if (c.energy == 0) {
                            return true;
                        }
                    }
                });

                if (closest != this.creep) {
                    this.creep.transferEnergy(closest);
                }
                return;
            }
            for (var n in creepsNear) {
                if (creepsNear[n].memory.role === 'CreepBuilder') {
                    if (creepsNear[n].memory['last-energy'] > creepsNear[n].energy) {
                        this.creep.transferEnergy(creepsNear[n]);
                    }
                }
            }
        }
    }
}
