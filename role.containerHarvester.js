
/*

    a creep, that harvests a big amount, but has a low cargo (is near to container) and stores it in a container
*/

var source = undefined;
var containers = undefined;
var link = undefined;
var untilPathRecalc = 3;

var roleContainerHarvester = {
    /** @param {Creep} creep **/
    run: function(creep, sourceID, containerIDs, linkID) {

        if(creep.memory.state == undefined) creep.memory.state = 'harvest';
        if(linkID != undefined) link = Game.getObjectById(linkID);
        source = Game.getObjectById(sourceID);
        containers = [];
        for(var i = 0; i < containerIDs.length; ++i) containers[containers.length] = Game.getObjectById(containerIDs[i]);
    
        var notFullContainer = getNotFullContainer();
        if(creep.ticksToLive > 1) {
            //creep has no energy, go harvest
            if(creep.carry.energy < creep.carryCapacity) {
                creep.memory.state = 'harvest';
                var stateChanged = hasStateChanged(creep);
                harvestSource(creep, stateChanged);
            //creep can't carry more, goto container if it is not full and fill
            } else if(linkID != undefined && creep.carry.energy == creep.carryCapacity && link.energy < link.energyCapacity) {
                // creep.say('here');
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                fillLink(creep, stateChanged);
            } else if(creep.carry.energy == creep.carryCapacity && notFullContainer != undefined) {
               // creep.say('here');
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                fillContainer(creep, stateChanged, notFullContainer);
            //container is full
            } else if( _.sum(container.store) == container.storeCapacity) {
                creep.memory.state = 'idle';
                var stateChanged = hasStateChanged(creep);
            }
            creep.memory.stateBefore = creep.memory.state;
        } else {
            if(linkID == undefined)
                creep.transfer(container, RESOURCE_ENERGY);
            else creep.transfer(link, RESOURCE_ENERGY);
        }
	}
};

function harvestSource(creep, stateChanged) {

    if(source.energy > 0) {
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        gotoSource(creep, stateChanged);
      }
      
    //idle to reduce cpu load  
    } else {
        if(!creep.pos.isNearTo(source)) {
            creep.moveTo(source);
        }
    }
}

function gotoSource(creep, stateChanged) {
    if(creep.memory.sourcePath == undefined || stateChanged) {
        var path = newSourcePath(creep);
        creep.memory.sourcePath = path;
    }
    
    var gotoResult = 0;
    if((gotoResult = creep.moveByPath(creep.memory.sourcePath)) != -11) {
        //if path is blocked, count
        if(creep.pos.x == creep.memory.prevX && creep.pos.y == creep.memory.prevY) {
            if(creep.memory.pathRecalcCount == undefined) {
                creep.memory.pathRecalcCount = 0;
            }
            
            if(++creep.memory.pathRecalcCount >= untilPathRecalc) {
                //only recalc if on the way to the source, else second creep waiting to harvest will recalc everytime
                if(creep.memory.state != 'harvest') {
                    creep.memory.sourcePath = undefined;
                } else {
    
                    //if the other creep died, recalc path to start harvest
                    var contHarv = _.filter(Game.creeps, (cr) => cr.memory.role == creep.memory.role);
                    if(contHarv.length <= 1) {
                        creep.memory.sourcePath = undefined;
                    }
                }
                creep.memory.pathRecalcCount = 0;
            }
        } else {
            creep.memory.pathRecalcCount = 0;
        }
        creep.memory.prevX = creep.pos.x;
        creep.memory.prevY = creep.pos.y;
    }
    return gotoResult;
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function newSourcePath(creep) {
    return creep.pos.findPathTo(source, {algorithm: 'astar'});
}

function fillLink(creep, stateChanged) {
    if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(link); //TODO: replace with path
    }
    if(creep.pos.isNearTo(source)) {
        creep.harvest(source);
    }
}

function fillContainer(creep, stateChanged, cont) {
    if(creep.transfer(cont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(cont); //TODO: replace with path
    }
    if(creep.pos.isNearTo(source)) {
        creep.harvest(source);
    }
}

function getNotFullContainer() {
    var notFull = undefined;
    
    for(var i = 0; i < containers.length; ++i) {
        if(_.sum(containers[i].store) < containers[i].storeCapacity) {
            notFull = containers[i];
            break;
        }
    }
    return notFull;
}

module.exports = roleContainerHarvester;