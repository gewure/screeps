import Room from 'Room';
import RoomManager from 'RoomManager';

export default class MainManager {
    constructor(game) {
        this.game = game;
    }

    manage() {
        this.initializeRooms();

        this.garbageCollection();
    }

    initializeRooms() {
        this.roomManager = new RoomManager(this);

        for (let name in this.game.rooms) {
            let room = new Room(this.game.rooms[name], this.roomManager);
            this.roomManager.set(name, room);
        }

        this.roomManager.loadRooms();
    }

    garbageCollection() {
        let counter = 0;
        for (let name in Memory.creeps) {
            let c = this.game.creeps[name];
            if (!c) {
                delete Memory.creeps[name];
                counter++;
            }
        }
    }
}
