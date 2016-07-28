import AbstractCreep from 'AbstractCreep';

/**
 * A Healers role is to heal creeps in the room
 */
export default class CreepHealer extends AbstractCreep {
    init() {
        this.remember('role', 'CreepHealer');
        if(!this.remember('srcRoom')) {
            this.remember('srcRoom', this.creep.room.name);
        }

        return this.moveToNewRoom() ? null: this.act();
    };
    
    act() {
        var avoidArea = this.getAvoidedArea(),
            injured = this.getInjuredCreep();

        if(injured) {
            this.creep.moveTo(injured, {avoid: avoidArea});
            this.creep.heal(injured);
        }
    
    }
    
    getInjuredCreep() {
        return this.creep.pos.findClosest(FIND_MY_CREEPS, {
            filter: function(c) {
                if(c.hits < c.hitsMax) {
                    return true;
                }
            }
        })
    }
}
