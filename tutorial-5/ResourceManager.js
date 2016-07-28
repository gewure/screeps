import Helper from 'Helper';

export default class ResourceManager {
    constructor(game, room, population) {
        this.game       = game;
        this.room       = room;
        this.population = population;
    }

    getAvailableResource() {
        // Some kind of unit counter per resource (with Population)
        let srcs     = this.getSources(),
            srcIndex = Math.floor(Math.random() * srcs.length);

        return srcs[srcIndex];
    }

    getResourceById(id) {
        return this.game.getObjectById(id);
    }

    getSources() {
        return global.Cache.remember(
            'sources-'+this.room.id,
            () => {
                return this.room.find(
                    FIND_SOURCES,
                    {
                        filter: function (src) {
                            return src.pos.findInRange(FIND_HOSTILE_CREEPS, 3).length == 0;
                        }
                    }
                );
            }
        );
    }

    getAvailableResourcePositions() {
        return global.Cache.remember(
            'sources-available-' + this.room.name,
            () => {
                let positions = [];

                this.getSources().forEach((source) => {
                    this.getAvailableResourcePositionsForSource(source).forEach((position) => {
                        positions.push(position);
                    })
                });

                return positions;
            }
        );
    }

    getAvailableResourcePositionsForSource(source) {
        let sourcePositions = [];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    continue;
                }

                let pos   = this.room.getPositionAt(source.pos.x + x, source.pos.y + y),
                    look  = pos.look(),
                    added = false;

                for (let i = 0; i < look.length; i++) {
                    let position = look[i];
                    if (position.type === 'terrain' && position.terrain === 'wall') {
                        continue;
                    }

                    sourcePositions.push(pos);
                    added        = true;
                    break;
                }
            }
        }

        //global.log(source.pos, sourcePositions.length);
        Cache.memorySet(source.id + '-totalSpaces', sourcePositions.length);

        return sourcePositions;
    }
}
