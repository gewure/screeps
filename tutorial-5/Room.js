import Distributor from 'Distributor';
import Population from 'Population';
import DepositManager from 'DepositManager';
import ResourceManager from 'ResourceManager';
import ConstructionManager from 'ConstructionManager';
import CreepFactory from 'CreepFactory';

/**
 * Main logic class
 */
export default class Room {
    get game() {
        return this.roomManager.mainManager.game;
    }

    get name() {
        return this.room.name;
    }

    /**
     * Builds the room
     *
     * 1) Finds all spawns for the room
     * 2) Gets the population of the current room
     * 3) Builds the deposit manager (manages all the spawns and their deposit buildings in the room)
     * 4) Builds the resource manager (manages all the sources in the room)
     * 5) Builds the construction manager (manages the buildings in the room
     * 6) Sets the maxes for miners, builders, and carriers
     * 7) Builds the creep factory
     *
     * @param room
     * @param roomManager
     */
    constructor(room, roomManager) {
        this.room        = room;
        this.roomManager = roomManager;

        this.spawns = room.find(FIND_MY_SPAWNS);
        this.creeps = [];

        this.distributor         = new Distributor(this);
        this.population          = new Population(this.room);
        this.depositManager      = new DepositManager(this.game, this.room, this.spawns);
        this.resourceManager     = new ResourceManager(this.game, this.room, this.population);
        this.constructionManager = new ConstructionManager(this.game, this.room);

        this.population.distro.CreepBuilder.max = this.getBuilderMax();
        this.population.distro.CreepMiner.max   = this.getMinerMax();
        this.population.distro.CreepCarrier.max = (this.population.distro.CreepBuilder.total + this.population.distro.CreepMiner.total) * 2;

        this.creepFactory = new CreepFactory(this);
    }

    getBuilderMax() {
        let pop = this.population.getTotalPopulation();

        if (pop < 10) {
            return 1
        }

        if (pop < 20) {
            return 2;
        }

        if (pop < 50) {
            return 4;
        }

        return 6;
    }

    /**
     * @returns {number}
     */
    getMinerMax() {
        let allowedSlots = this.resourceManager.getAvailableResourcePositions().length,
            pop   = this.population.getTotalPopulation();

        if (allowedSlots === 0) {
            allowedSlots = 2;
        }


        if (pop < 6) {
            return allowedSlots > 2 ? 2 : allowedSlots;
        }

        return allowedSlots;
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

    askForReinforcements() {
        console.log(this.room.name + ': ask for reinforcements.');
        this.roomManager.requestReinforcement(this);
    }

    sendReinforcements(room) {
        global.log("Sending reinforcements?");
        return;

        if (!Memory[this.room.name]) {
            Memory[this.room.name] = {};
        }
        let alreadySending = false;
        for (let i = 0; i < this.population.creeps.length; i++) {
            let creep = this.population.creeps[i];
            if (creep.memory.targetRoom == room.room.name) {
                alreadySending = true;
                break;
            }
        }
        if (alreadySending) {
            console.log(this.room.name + ': already given reinforcements');
            return;
        }
        if (this.population.getTotalPopulation() < this.population.getMaxPopulation() * 0.8) {
            console.log(this.room.name + ': Not enough resources ' + '(' + this.population.getTotalPopulation() + '/' + this.population.getMaxPopulation() * 0.8 + ')');
            return;
        }

        let sentType = [];
        for (let i = 0; i < this.population.creeps.length; i++) {
            let creep = this.population.creeps[i];
            if (creep.ticksToLive < 1000) {
                continue;
            }
            if (sentType.indexOf(creep.memory.role) == -1) {
                sentType.push(creep.memory.role);
                console.log('sending: ' + creep.memory.role);
                creep.memory.targetRoom = room.room.name;
            }
        }
    }

    /**
     * Runs through the spawns, and creates new creeps if necessary
     */
    populate() {
        // Disabling for now
        // If there are no spawns in this room, and less than 10 creeps, ask for more reinforcements
        //if (this.depositManager.spawns.length == 0 && this.population.getTotalPopulation() < 10) {
        //    this.askForReinforcements()
        //}

        for (let i = 0; i < this.spawns.length; i++) {
            let spawn = this.spawns[i], toSpawn;


            toSpawn = this.getNextSpawn(spawn);

            if (toSpawn !== false) {
                //global.log(spawn.name + " is attempting to spawn a " + toSpawn);

                if (this.creepFactory.new(toSpawn, spawn)) {
                    //global.log("Spawned, forgetting spawn");
                    Cache.memoryForget('next-spawn-' + spawn.name);
                }
            } else {
                //global.log(spawn.name + " isn't spawning right now");
                Cache.memoryForget('next-spawn-' + spawn.name);
            }

        }
    }

    getNextSpawn(spawn) {
        return Cache.memoryRemember(
            'next-spawn-' + spawn.name,
            () => {
                // If we are currently spawning at this spawn, just skip it
                if (spawn.spawning) {
                    return false;
                }

                // If there's more than 20% of the energy capacity in storage, start the spawning process
                if ((this.depositManager.energy() / this.depositManager.energyCapacity()) <= 0.2) {
                    //return false;
                }

                return this.filterSpawnables(this.population.getTypes(), false);
            }
        );
    }

    filterSpawnables(spawnable, minCheck) {
        let filtered = {},
            counter  = 0;

        for (let name in spawnable) {
            if (!spawnable.hasOwnProperty(name)) {
                continue;
            }

            //global.log("Testing spawn of " + name);

            let type          = spawnable[name],
                currentNumber = this.getCreepsOfType(name).length;

            // Check to make sure we have a high enough population
            if (this.population.getTotalPopulation() < type.minPopulation) {
                continue;
            }

            //global.log(name + " passed the minPopulation check");

            // Check to make sure we have enough extension buildings for the given type
            if (this.depositManager.deposits.length < type.minExtensions) {
                continue;
            }

            //global.log(name + " passed the minExtensions check");

            //global.log(type.total, type.max);
            // Check to see if we've met the goal for the given number of creeps
            if (type.total >= type.max) {
                continue;
            }

            //global.log(name + " passed the max check");

            /**
             * If there are less creeps than required, do this:
             * 1) Check if we are currently running through with minCheck
             * 2) If we aren't, and we are on the first iteration, turn on the minCheck
             * 3) If we aren't, and we aren't on the first iteration, restart, with minCheck on
             * 4) If we are, keep checking
             *
             * If there are more creeps than the min required, keep checking
             */
            if (type.min > currentNumber) {
                if (!minCheck) {
                    //global.log("Setting the minCheck");
                    if (counter === 0) {
                        minCheck = true;
                    } else {
                        return this.filterSpawnables(spawnable, true);
                    }
                }
            }

            //global.log(name + ' passed the min check');

            type.chance = Math.floor((Math.random() * 10) + 1) * type.priority;
            //global.log(name + ' has a chance of' + type.chance);

            filtered[name] = type;
        }

        //global.log(filtered);

        let highest = 0, highestIndex = null;
        for (let name in filtered) {
            if (!filtered.hasOwnProperty(name)) {
                return name;
            }

            if (!minCheck) {
                return name;
            }

            if (filtered[name].chance > highest || highestIndex === null) {
                highest      = filtered[name].chance;
                highestIndex = name;
            }
        }

        return highestIndex === null ? false : highestIndex;
    }


    /**
     * Grabs all the creeps in the room, and runs them through the creep factory to get their type
     */
    loadCreeps() {
        let creeps = this.room.find(FIND_MY_CREEPS);
        for (let name in creeps) {
            try {
                let creep = this.creepFactory.load(creeps[name]);
                if (creep) {
                    this.creeps.push(creep);
                }
            } catch (error) {
                global.log("Error with creep: " + name, error);
                this.game.notify(error, 60);
            }
        }
    }

    distributeCreeps() {
        this.distributor.distribute();
    }
}
