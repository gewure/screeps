
/*

    a creep, that harvests a big amount, but has a low cargo (is near to container) and stores it in a container
*/

var source = undefined;
var containers = undefined;
var link = undefined;
var untilPathRecalc = 3;
var mineralID = undefined;
var mineral = undefined;
var mineralTyp = undefined;

var roleOtherRoomMineralHarvester = {
    /** @param {Creep} creep **/
    run: function(creep, sourceID, containerIDs, linkID, minerID) {

        if(creep.memory.state == undefined) creep.memory.state = 'harvest';
        if(linkID != undefined) link = Game.getObjectById(linkID);
        source = Game.getObjectById(sourceID);
        mineralID = minerID;
        mineral = Game.getObjectById(mineralID);
        storageObj = Game.getObjectById('5785398b91941a441c38dd7e');
            //console.log(creep.carry[RESOURCE_LEMERGIUM]);
        containers = [];
        for(var i = 0; i < containerIDs.length; ++i) containers[containers.length] = Game.getObjectById(containerIDs[i]);
        
        var notFullContainer = getNotFullContainer();
        if(creep.ticksToLive > 10) {
            //creep has no energy, go harvest
            if(creep.carry[mineral.mineralType] == undefined || creep.carry[mineral.mineralType] < creep.carryCapacity) {
                creep.memory.state = 'harvest';
                var stateChanged = hasStateChanged(creep);
                harvestSource(creep, stateChanged);
            //creep can't carry more, goto container if it is not full and fill
            } else if(linkID != undefined && creep.carry[mineral.mineralType] == creep.carryCapacity && link.energy < link.energyCapacity) {
                // creep.say('here');
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                //fillLink(creep, stateChanged);
                fillContainer(creep, stateChanged, link); // TODODODODO
            } else if(creep.carry[mineral.mineralType] == creep.carryCapacity && notFullContainer != undefined) {
               // creep.say('here');
                creep.memory.state = 'fill';
                var stateChanged = hasStateChanged(creep);
                fillContainer(creep, stateChanged, link);
            //container is full
            } else if(notFullContainer == undefined) {
                creep.memory.state = 'idle';
                var stateChanged = hasStateChanged(creep);
            }
            creep.memory.stateBefore = creep.memory.state;
        } else {
            if(linkID == undefined)
                creep.transfer(notFullContainer, mineral.mineralType);
            else creep.transfer(link, RESOURCE_UTRIUM);
        }
	}
};

function harvestSource(creep, stateChanged) {
    var text = Math.random()+"!!!";
    creep.say(text);
    if(mineral.mineralAmount > 0) {
      if(creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
        gotoSource(creep, stateChanged);
      }
      
    //idle to reduce cpu load  
    } else {
        if(!creep.pos.isNearTo(mineral)) {
            creep.moveTo(mineral);
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
                creep.memory.sourcePath = undefined;
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
    return creep.pos.findPathTo(mineral, {algorithm: 'astar'});
}

function fillLink(creep, stateChanged) {
       // console.log('mineralminer BLALBLA FILL LINK');
        var ret = creep.transfer(link, RESOURCE_UTRIUM, creep.carry.L);
        console.log('retval of transfer:' + ret);
        console.log(creep.carry.L + '  ' + link);
    if(creep.transfer(link, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
           //     console.log('mineralminer BLALBLA FILL LINKdddddddd');

        creep.moveTo(link); //TODO: replace with path
    }
    if(creep.pos.isNearTo(mineral)) {
        creep.harvest(mineral);
    }
}

function fillContainer(creep, stateChanged, cont) {
    //console.log('mineralminer BLALBLA FILLCONTAINER');
    if(creep.transfer(cont,RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(cont); //TODO: replace with path
    }
    if(creep.pos.isNearTo(mineral)) {
        creep.harvest(mineral);
    }
}

function fillStorage(creep, stateChanged, cont) {
   // console.log('mineralminer BLALBLA fillStorage');
    if(creep.transfer(cont,RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(cont); //TODO: replace with path
    }
    if(creep.pos.isNearTo(mineral)) {
        creep.harvest(mineral);
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

module.exports = roleOtherRoomMineralHarvester;