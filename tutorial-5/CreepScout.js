import AbstractCreep from 'AbstractCreep';

/**
 * A Scouts role is to find other controllers and conquer them
 */
export default class CreepScout extends AbstractCreep {
    constructor(game, creep, roomHandler) {
        super(game, creep);
        this.roomHandler = roomHandler;
    }

    init() {
        this.remember('role', 'CreepScout');
        if (this.remember('role')) {
            this.remember('roomName', this.creep.room.name);
        }
        if (this.moveToNewRoom() == true) {
            return;
        }
        if (this.avoidEnemy()) {
            return;
        }
        this.act();
    }

    act() {
        this.conquer();
    }

    findController() {
        return this.creep.room.find(
            FIND_STRUCTURES,
            {
                filter: function (structure) {
                    return structure.structureType == STRUCTURE_CONTROLLER;
                }
            }
        );
    }

    conquer() {
        var controller = this.findController();
        if (controller.length != 0) {
            controller = controller[0];
        }

        this.creep.moveTo(controller);
        this.creep.claimController(controller);
    }
}
