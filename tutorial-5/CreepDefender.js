import AbstractCreep from 'AbstractCreep';

/**
 * A Defender defends any room with a friendly spawn in it.
 *
 * Moves around randomly
 */
export default class CreepDefender extends AbstractCreep {
    init() {
        this.remember('role', 'CreepDefender');

        if (!this.remember('srcRoom')) {
            this.remember('srcRoom', this.creep.room.name);
        }

        this.remember('targetRoom', false);
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

        const rally = this.findRallyPoint();
        if (rally !== false) {
            this.creep.moveTo(rally);
        } else {
            this.creep.moveTo(25, 25, {avoid: avoidArea});
        }
    }



    attackHostiles() {
        var avoidArea = this.getAvoidedArea();
        var targets   = this.creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function (t) {
                if (t.name == 'Source Keeper') {
                    return false;
                }
            }
        });
        if (targets.length) {
            this.creep.moveTo(targets[0], {avoid: avoidArea});
            this.creep.attack(targets[0]);

            return true;
        }

        return false;
    }

    attackSpawns() {
        var avoidArea = this.getAvoidedArea();
        var targets   = this.creep.room.find(FIND_HOSTILE_SPAWNS);
        if (targets.length) {
            //var rangedTargets = this.creep.pos.findInRange(FIND_HOSTILE_SPAWNS, 3);
            //if (rangedTargets.length > 0) {
            //    this.creep.rangedAttack(rangedTargets[0]);
            //}

            this.creep.moveTo(targets[0], {avoid: avoidArea});
            this.creep.attack(targets[0]);

            return true;
        }

        return false;
    }

    findRallyPoint() {
        const flags = this.creep.room.find(FIND_FLAGS);
        for (let i = 0; i < flags.length; i++) {
            if (flags[i].name.indexOf('Rally') === -1) {
                continue;
            }

            let name = flags[i].name.split('-')[1];
            if (name === 'Defender') {
                return flags[i];
            }
        }

        return false;
    }
}
