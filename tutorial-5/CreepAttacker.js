import AbstractCreep from 'AbstractCreep';

/**
 * An Attacker is a creep that goes to other rooms, and attacks
 */
export default class CreepAttacker extends AbstractCreep {
    init() {
        this.remember('role', 'CreepAttacker');
        if (!this.remember('srcRoom')) {
            this.remember('srcRoom', this.creep.room.name);
        }

        if (this.moveToNewRoom() == true) {
            return;
        }

        this.act();
    }

    act() {
        var avoidArea = this.getAvoidedArea();

        if (this.attackHostiles()) {
            return;
        }
        if (this.attackSpawns()) {
            return;
        }

        this.creep.moveTo(25, 25, {avoid: avoidArea});
    }

    attackHostiles() {
        var targets = this.creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function (t) {
                return t.name != 'Source Keeper';
            }
        });
        if (targets.length) {
            // Do something other if targets[0].owner == 'Source Keeper';
            var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            if (rangedTargets.length > 0) {
                this.creep.rangedAttack(rangedTargets[0]);

                return true;
            }

            this.creep.moveTo(targets[0], {avoid: avoidArea});

            return true;
        }
    }

    attackSpawns() {
        var targets = this.creep.room.find(FIND_HOSTILE_SPAWNS);
        if (targets.length) {
            var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_SPAWNS, 3);
            if (rangedTargets.length > 0) {
                this.creep.rangedAttack(rangedTargets[0]);

                return true;
            }

            this.creep.moveTo(targets[0], {avoid: avoidArea});

            return true;
        }
    }
}
