import AbstractCreep from 'AbstractCreep';
import Helper from 'Helper';

/**
 * A Miner's role is to travel to its defined source, and mine there forever.
 */
export default class CreepMiner extends AbstractCreep {
    constructor(game, creep, population, resourceManager) {
        super(game, creep);
        this.population      = population;
        this.resourceManager = resourceManager;

        this.resource = false;
    }

    init() {
        this.remember('role', 'CreepMiner');

        if (!this.remember('closestSpawn')) {
            let spawn = this.creep.pos.findClosest(FIND_MY_SPAWNS);
            if (spawn === null) {
                return;
            }

            this.remember('closestSpawn', spawn.name);
        }

        if (!this.remember('source')) {
            global.log(this.name + ' was not distributed. Finding a new source');
            var src = this.resourceManager.getAvailableResource();
            this.remember('source', src.id);
        }

        if (!this.remember('srcRoom')) {
            this.remember('srcRoom', this.creep.room.name);
        }

        if (this.moveToNewRoom() == true) {
            return;
        }

        this.resource = this.resourceManager.getResourceById(this.remember('source'));

        this.act();
    }

    /**
     * Checks the source to see where there is an open mining spot
     */
    getMiningSpot() {
        let spots = this.resourceManager.getAvailableResourcePositionsForSource(this.resource);
        for (let i = 0; i < spots.length; i++) {
            let spot = spots[i],
                look = spot.look();

            if (look.length === 0) {
                return
            }

            for (var n = 0; n < look.length; n++) {
                //if ()
            }
        }
    }

    /**
     * Creep will continue mining a single node until another creep is close enough,
     * then it will transfer the energy to the creep
     */
    act() {
        var avoidArea = this.getAvoidedArea();

        // Move to the resource
        let moveStatus = this.creep.moveTo(this.resource, {avoid: avoidArea});
        global.log(this.name + ' is moving to ', this.resource.pos);
        if (moveStatus === -2) {
            global.log(this.name + " has no path, moving to spawn");
            moveStatus = this.creep.moveTo(this.room.spawns[0]);
        }
        //global.log(this.name + ' is moving to ' + this.resource.id, moveStatus);

        // Attempt to harvest. If its not in range, and we have energy, try to pass it off to other miners
        // This will help give energy to miners that are in range of a carrier
        let harvest = this.creep.harvest(this.resource);
        if (harvest === ERR_NOT_IN_RANGE) {
            this.pickupEnergy();
        }

        this.giveEnergy();
    }

    /**
     * Picks up energy near the carrier
     *
     * @returns {boolean}
     */
    pickupEnergy() {
        var avoidArea = this.getAvoidedArea();
        if (this.creep.carry.energy == this.creep.carryCapacity) {
            return false;
        }

        var target = this.creep.pos.findInRange(FIND_DROPPED_ENERGY, 2, {avoid: avoidArea});
        if (target.length) {
            this.creep.pickup(target[0]);
        }
    }

    giveEnergy() {
        var creepsNear = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
        if (creepsNear.length === 0) {
            return;
        }
        for (let name in creepsNear) {
            if (!creepsNear.hasOwnProperty(name)) {
                continue;
            }

            let creep = creepsNear[name];
            if (Helper.isCreepA(creep, 'CreepMiner') && creep.carry.energy < creep.carryCapacity) {
                this.creep.transferEnergy(creep);
            }
        }
    }
}
