export default class RoomManager {
    rooms = {};

    constructor(mainManager) {
        this.mainManager = mainManager;
    }

    set(name, room) {
        this.rooms[name] = room;
    }

    getRooms() {
        return this.rooms;
    }

    getRoomNames() {
        return this.rooms.keys();
    }

    get(name) {
        return this.isOurRoom(name) ? this.rooms[name] : false;
    }

    isOurRoom(name) {
        return rooms.indexOf(name) != -1;
    }

    requestReinforcement(room) {
        let rooms = this.getRoomHandlers();
        for (let n in rooms) {
            if (rooms[n].name != room.name) {
                rooms[n].sendReinforcements(room);
            }
        }
    }

    loadRooms() {
        for (let name in this.rooms) {
            let room = this.rooms[name];

            //**
            console.log(
                room.room.name + ' | ' +
                'goals met:' +
                room.population.goalsMet() +
                ', population: ' +
                room.population.getTotalPopulation() + '/' + room.population.getMaxPopulation() +
                ' (b:' + room.population.getType('CreepBuilder').total + ' m:' +
                room.population.getType('CreepMiner').total + ' c:' +
                room.population.getType('CreepCarrier').total + ' d:' +
                room.population.getType('CreepDefender').total + ' a:' +
                room.population.getType('CreepAttacker').total + ' h:' +
                room.population.getType('CreepHealer').total +
                '), ' +
                'resources at: ' + parseInt((room.depositManager.energy() / room.depositManager.energyCapacity()) * 100) + '%, ' +
                'resources: ' + room.depositManager.energy() + '/' + room.depositManager.energyCapacity() + ', ' +
                'next death: ' + room.population.getNextExpectedDeath() + ' ticks'
            );
            //*/

            room.loadCreeps();
            room.populate();
            room.distributeCreeps();
        }
    }
}
