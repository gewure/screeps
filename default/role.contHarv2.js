var roomStat = require('roomStatistics');
var utils = require('utils');

var northSourceID = '576a9c7f57110ab231d892f6';
var containerNorthID = '57796949720916567dc376ca';

var southSourceID = '576a9c7f57110ab231d892fb';
var containerSouthID = '577efebce58c81923d18ea3f';
var linkID = '5790e50543f1b3f2295aaf0c';

var source = undefined;
var container = undefined;
var untilPathRecalc = 3;

var sisyphos = 'The gods had condemned Sisyphus to ceaselessly rolling a rock to the top of a mountain, whence the stone would fall back of its own weight. They had thought with some reason that there is no more dreadful punishment than futile and hopeless labor.If one believes Homer, Sisyphus was the wisest and most prudent of mortals. According to another tradition, however, he was disposed to practice the profession of highwayman. I see no contradiction in this. Opinions differ as to the reasons why he became the futile laborer of the underworld. To begin with, he is accused of a certain levity in regard to the gods. He stole their secrets. Egina, the daughter of Esopus, was carried off by Jupiter. The father was shocked by that disappearance and complained to Sisyphus. He, who knew of the abduction, offered to tell about it on condition that Esopus would give water to the citadel of Corinth. To the celestial thunderbolts he preferred the benediction of water. He was punished for this in the underworld. Homer tells us also that Sisyphus had put Death in chains. Pluto could not endure the sight of his deserted, silent empire. He dispatched the god of war, who liberated Death from the hands of her conqueror.It is said that Sisyphus, being near to death, rashly wanted to test his wifes love. He ordered her to cast his unburied body into the middle of the public square. Sisyphus woke up in the underworld. And there, annoyed by an obedience so contrary to human love, he obtained from Pluto permission to return to earth in order to chastise his wife. But when he had seen again the face of this world, enjoyed water and sun, warm stones and the sea, he no longer wanted to go back to the infernal darkness. Recalls, signs of anger, warnings were of no avail. Many years more he lived facing the curve of the gulf, the sparkling sea, and the smiles of earth. A decree of the gods was necessary. Mercury came and seized the impudent man by the collar and, snatching him from his joys, lead him forcibly back to the underworld, where his rock was ready for him.You have already grasped that Sisyphus is the absurd hero. He is, as much through his passions as through his torture. His scorn of the gods, his hatred of death, and his passion for life won him that unspeakable penalty in which the whole being is exerted toward accomplishing nothing. This is the price that must be paid for the passions of this earth. Nothing is told us about Sisyphus in the underworld. Myths are made for the imagination to breathe life into them. As for this myth, one sees merely the whole effort of a body straining to raise the huge stone, to roll it, and push it up a slope a hundred times over; one sees the face screwed up, the cheek tight against the stone, the shoulder bracing the clay-covered mass, the foot wedging it, the fresh start with arms outstretched, the wholly human security of two earth-clotted hands. At the very end of his long effort measured by skyless space and time without depth, the purpose is achieved. Then Sisyphus watches the stone rush down in a few moments toward tlower world whence he will have to push it up again toward the summit. He goes back down to the plain.It is during that return, that pause, that Sisyphus interests me. A face that toils so close to stones is already stone itself! I see that man going back down with a heavy yet measured step toward the torment of which he will never know the end. That hour like a breathing-space which returns as surely as his suffering, that is the hour of consciousness. At each of those moments when he leaves the heights and gradually sinks toward the lairs of the gods, he is superior to his fate. He is stronger than his rock.'.split(' ');
var roleContHarv2 = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
         if(creep.ticksToLive == 1499) {
            creep.memory.text = 0;
        }
        if(creep.memory.text == sisyphos.length) {
            creep.memory.text = 0;
        }
        
       // utils.creepSay(creep, '' +Math.ceil(roomStat.getTotalEnergy(creep.room)/1000)+'k', 3);
        
	      if(!creep.pos.isNearTo(Game.flags['extraResource'])) {
            console.log(creep.name + '[contHarv1] im in the wrong room ..');
            creep.move(BOTTOM);
            creep.moveByPath(Game.flags['extraResource']);
         
        }
        
        if(creep.ticksToLive==36) { // respawn yourself! 
            Game.spawns.StPetersburg.createCreep([WORK, WORK, WORK,WORK, WORK, CARRY, MOVE], undefined, {role:'contHarv2'});
        }
        if(creep.ticksToLive==1) {
            container = Game.getObjectById(containerSouthID);
             if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container); //TODO: replace with path
             }
        }
        
        if(creep.memory.state == undefined) {
            creep.memory.state = 'harvest';
        } else {
             creep.memory.state = 'idle';
            creep.memory.mineOccupied = true;
        }
        
        source = southSourceID;
        container = containerSouthID;
        var link = Game.getObjectById(linkID);
        
        if(creep.memory.role == 'contHarv2') {
            source = Game.getObjectById(southSourceID);
            container = Game.getObjectById(containerSouthID);
        } else {
            source = Game.getObjectById(southSourceID);
            container = Game.getObjectById(containerSouthID);
        } 

        //creep has no energy, go harvest
        if(creep.carry.energy < creep.carryCapacity) {
            
            creep.memory.state = 'harvest';
            var stateChanged = hasStateChanged(creep);
            //gotoSource(creep, stateChanged);
            harvestSource(creep, stateChanged);
        //creep can't carry more, goto container if it is not full and fill
        } else if(creep.carry.energy == creep.carryCapacity && link.energy + creep.carry.energy < link.energyCapacity) {
           // creep.say('here');
            creep.memory.state = 'fill';
            var stateChanged = hasStateChanged(creep);
            //fillContainer(creep, stateChanged);
            
            if(link.energy <= 750) {
                if(creep.transfer(link, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(link);
                }
                creep.harvest(source);
            }
        //container is full
        } else if( link.energy >= link.energyCapacity* 0.9|| creep.memory.mineOccupied) {
            //creep.say('are happy',true);
            creep.memory.state = 'idle';
            var stateChanged = hasStateChanged(creep);
            
          var containerSubst = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TERMINAL ) && _.sum(structure.store)+creep.carry.energy < structure.storeCapacity;
                    }
                    });
            if(containerSubst) {
                if(creep.transfer(containerSubst, RESOURCE_ENERGY, creep.carry.energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerSubst);
                }
            }
        } else if(creep.memory.mineOccupied && creep.memory.state=='harvesting' && creep.memory.stateBefore=='harvesting') {
            creep.memory.state='idle';
            creep.memory.stateBefore='idle';
            creep.memory.mineOccupied = false;
        }
        creep.memory.stateBefore = creep.memory.state;
	}
};

function harvestSource(creep, stateChanged) {
    creep.say(sisyphos[creep.memory.text],true);
    creep.memory.text++;
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
}

function hasStateChanged(creep) {
    if(creep.memory.state != creep.memory.stateBefore)
        return true;
    else return false;
}

function newSourcePath(creep) {
    return creep.pos.findPathTo(source, {algorithm: 'astar'});
}

function fillContainer(creep, stateChanged) {
    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container); //TODO: replace with path
    }
    if(creep.pos.isNearTo(source)) {
        creep.harvest(source);
    }
}

module.exports = roleContHarv2;