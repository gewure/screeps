export default class Distributor {
    get creeps() {
        return this.room.creeps;
    }

    get spawns() {
        return this.room.spawns;
    }

    get game() {
        return this.room.game;
    }

    get sources() {
        return this.room.resourceManager.getSources();
    }

    get population() {
        return this.room.population;
    }

    constructor(room) {
        this.room = room;
    }

    /**
     * Finds all creeps of the given type
     *
     * @param type
     * @returns {Array}
     */
    getCreepsOfType(type) {
        let creeps = [];

        for (let i = 0; i < this.creeps.length; i++) {
            let creep = this.creeps[i];
            if (creep.remember('role') !== type) {
                continue;
            }

            creeps.push(creep);
        }

        return creeps;
    }

    distribute() {
        this.distributeMiners();
        this.distributeBuilders();
        this.distributeCarriers();
    }

    /**
     * Moves an equal number of miners to each source in the room
     * @todo Get the number of miners a source can actually use, and attempt to put them in the right places
     */
    distributeMiners() {
        let sources       = this.sources,
            creeps        = this.getCreepsOfType('CreepMiner'),
            counter       = 0,
            sourceCounter = 0;

        // Runs through all the creeps of the given type
        for (let i = 0; i < creeps.length; i++) {
            let source = sources[sourceCounter],
                creep  = creeps[i];

            // If there are no more sources, but there are still creeps, there's an issue.
            if (source === undefined) {
                //global.log(creeps.length, sources.length, this.room.resourceManager.getAvailableResourcePositions().length);
                global.log("You have too many CreepMiner creeps per spawn. Should do something about that");
                return;
            }

            let totalSpaces = Cache.memoryGet(source.id + '-totalSpaces');
            //global.log(source.pos, 'total: ' + totalSpaces, 'Counter: ' + (counter+1));
            if (totalSpaces !== undefined && totalSpaces <= counter + 1) {
                counter = 0;
                sourceCounter++;
            }

            // Tell the creep which source id it should be moving to
            creep.remember('source', source.id);
            //global.log(creep.name, source.pos);

            // Add to counter for source
            counter++;
        }
    }

    /**
     * Gets the builders to upgrade the controllers
     */
    distributeBuilders() {
        let builders = this.getCreepsOfType('CreepBuilder');

        // If there are no spawns in the room, why is there a builder here?
        // @todo Tell builder to move to a room with a spawn
        if (this.spawns.length === 0) {
            for (let i = 0; i < this.creeps.length; i++) {
                let creep = this.creeps[i];
                if (creep.remember('role') != 'CreepBuilder') {
                    continue;
                }

                creep.remember('forceControllerUpgrade', false);
            }
            return;
        }


        // Run through the builders and tell them what to do
        for (let i = 0; i < builders.length; i++) {
            // Make sure theres one builder always on the controller
            //builders[i].forget('forceControllerUpgrade');
            //builders[i].remember('forceControllerUpgrade', i < this.getBuildersOnController(builders.length));
        }
    }

    getBuildersOnController(pop) {
        if (pop <= 2) {
            return pop;
        }

        if (pop <= 10) {
            return 2;
        }

        return 3;
    }

    /**
     * Runs through the carriers and assigns them to a miner, or a builder
     */
    distributeCarriers() {
        let counter        = 0,
            minerCounter   = 0,
            builderCounter = 0,
            miners         = this.getCreepsOfType('CreepMiner'),
            builders       = this.getCreepsOfType('CreepBuilder'),
            carriers       = this.getCreepsOfType('CreepCarrier');


        // Run through all the creeps
        // Tell the carriers which
        let forPop = false;
        for (let i = 0; i < carriers.length; i++) {
            let creep = carriers[i];

            if (!creep.getDepositFor()) {
                if (!(counter % 2) || forPop) {
                    // Population
                    creep.setDepositFor(2);
                } else {
                    // Construction
                    creep.setDepositFor(1);
                }
            }

            if (miners[minerCounter] !== undefined) {
                let id = creep.remember('target-miner');

                if (id === undefined) {
                    creep.remember('target-miner', miners[minerCounter].name);
                }

                minerCounter++;
                if (minerCounter >= miners.length) {
                    minerCounter = 0;
                }
            }

            if (builders[builderCounter] !== undefined) {
                let id = creep.remember('target-builder');

                if (id === undefined) {
                    creep.remember('target-builder', builders[builderCounter].name);
                }

                builderCounter++;
                if (builderCounter >= builders.length) {
                    builderCounter = 0;
                }
            }

            counter++;
        }
    }
}
