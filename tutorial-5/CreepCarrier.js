import AbstractCreep from 'AbstractCreep';

/**
 * A Carrier's role is to take energy from the miners, and bring it to the closet spawn
 */
export default class CreepCarrier extends AbstractCreep {
    static ACTIONS = {
        HARVEST: 1,
        DEPOSIT: 2
    };

    static DEPOSIT_FOR = {
        CONSTRUCTION: 1,
        POPULATION:   2
    };

    constructor(game, creep, depositManager, resourceManager, constructionManager) {
        super(game, creep);
        this.depositManager      = depositManager;
        this.resourceManager     = resourceManager;
        this.constructionManager = constructionManager;
    }

    onRandomMovement() {
        this.remember('last-action', CreepCarrier.ACTIONS.DEPOSIT);
    }

    setDepositFor(type) {
        this.remember('depositFor', type);
    }

    getDepositFor() {
        return this.remember('depositFor');
    }

    init() {
        this.remember('role', 'CreepCarrier');
        this.depositFor = this.remember('depositFor') || 2;

        if (this.depositFor == CreepCarrier.DEPOSIT_FOR.CONSTRUCTION) {
            //this.creep.say('w');
        }
        if (!this.remember('srcRoom')) {
            this.remember('srcRoom', this.creep.room.name);
        }

        if (this.moveToNewRoom() == true) {
            return;
        }

        if (this.randomMovement() == false) {
            this.act();
        }
    }

    act() {
        var continueDeposit = false;
        if (this.creep.carry.energy != 0 && this.remember('last-action') == CreepCarrier.ACTIONS.DEPOSIT) {
            continueDeposit = true;
        }

        // If for some reason we are on top of an energy ball, pick it up
        this.pickupEnergy();

        // If we can take more energy, and we arent already depositing, get some, otherwise, deposit energy
        if (this.creep.carry.energy < this.creep.carryCapacity && continueDeposit == false) {
            //global.log(this.name + ' is harvesting');
            this.harvestEnergy();
        } else {
            //global.log(this.name + ' is depositing');
            this.depositEnergy();
        }
    }

    /**
     * Deposits energy into a depository
     */
    depositEnergy() {
        var avoidArea = this.getAvoidedArea();

        // If there are no empty deposits, and the spawn is at maximum capacity, give the energy to construction (builders)
        if (this.depositManager.getEmptyDeposits().length == 0 && this.depositManager.getSpawnDeposit().energy == this.depositManager.getSpawnDeposit().energyCapacity) {
            this.depositFor = CreepCarrier.DEPOSIT_FOR.CONSTRUCTION;
        }

        // If the total energy of the room is less than 30% of the capacity, override to population energy (new creeps)
        if (this.depositManager.energy() / this.depositManager.energyCapacity() < 0.3) {
            this.depositFor = CreepCarrier.DEPOSIT_FOR.POPULATION;
        }

        // If we are depositing for population, move to the target depository, and transfer
        if (this.depositFor == CreepCarrier.DEPOSIT_FOR.POPULATION) {
            var deposit = this.getDeposit();
            this.creep.moveTo(deposit, {avoid: avoidArea});
            this.creep.transferEnergy(deposit);
        }

        // If we are depositing for construction, move to the target worker, and transfer
        if (this.depositFor == CreepCarrier.DEPOSIT_FOR.CONSTRUCTION) {
            var builder = this.getBuilder();
            var range  = 1;
            if (builder === false) {
                this.forget('target-builder');
                global.log(this.name + "'s target builder is dead. Lets grab a new one");
                builder = this.constructionManager.controller;
                range  = 2;
            }

            if (!this.creep.pos.isNearTo(builder, range)) {
                this.creep.moveTo(builder, {avoid: avoidArea});
            } else {
                this.remember('move-attempts', 0);
            }
            this.harvest();
        }

        this.remember('last-action', CreepCarrier.ACTIONS.DEPOSIT);
    }

    getBuilder() {
        if (this.remember('target-builder')) {
            return this.game.creeps[this.remember('target-builder')];
        }

        return false;
    }

    getMiner() {
        if (this.remember('target-miner')) {
            return this.game.creeps[this.remember('target-miner')];
        }

        return false;
    }

    /**
     * Tries to get the best deposit to deposit to
     * @returns {*}
     */
    getDeposit() {
        return global.Cache.remember(
            'selected-deposit',
            () => {
                var deposit = false;

                // Deposit energy
                if (this.remember('closest-deposit')) {
                    deposit = this.depositManager.getEmptyDepositById(this.remember('closest-deposit'));
                }

                if (!deposit) {
                    deposit = this.depositManager.getClosestEmptyDeposit(this.creep);
                    this.remember('closest-deposit', deposit.id);
                }

                if (!deposit) {
                    deposit = this.depositManager.getSpawnDeposit();
                }

                return deposit;
            }
        )
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

    harvestEnergy() {
        //this.creep.moveTo(0,0);
        let avoidArea = this.getAvoidedArea(),
            miner     = this.getMiner();

        if (miner === undefined) {
            this.forget('target-miner');
            global.log(this.name + "'s target miner is dead. Lets grab a new one");
            return;
        }

        this.creep.moveTo(miner, {avoid: avoidArea});
        if (this.creep.pos.inRangeTo(miner, 3)) {
            this.harvest();
        }

        this.remember('last-action', CreepCarrier.ACTIONS.HARVEST);
        this.forget('closest-deposit');
    }

    harvest() {
        var creepsNear = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);

        if (creepsNear.length > 0) {
            for (let i = 0; i < creepsNear.length; i++) {
                let creep = creepsNear[i],
                    role  = creep.memory.role === undefined ? creep.name.split('-')[0] : creep.memory.role;

                if (role === 'CreepMiner' && creep.carry.energy != 0) {
                    //global.log(creep.name + ' is transfering energy to ' + this.creep.name);
                    creep.transferEnergy(this.creep);
                }
                if (role === 'CreepBuilder') {
                    //global.log(this.creep.name + ' is transfering energy to ' + creep.name);
                    this.creep.transferEnergy(creep);
                }
            }
        }
    }
}
