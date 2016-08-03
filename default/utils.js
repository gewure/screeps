var utils = {
  
  initialise: function()
  {
    utils.onlyDoTicks(function()
    {
      Memory.lastgclBefore = Memory.lastgcl;
      Memory.lastgcl = Game.gcl.progress;
    }, 20);
  },
  getGCLPerTick: function()
  {
    return (Memory.lastgcl - Memory.lastgclBefore)/20.0;
  },
  isFriendlyCreep: function(creep)
  {
    if(creep.owner.username == 'bldinator')
    return true;
    return false;
  },
  creepSay(creep, message, eachCycle = 1)
  {
    utils.onlyDoTicks(function() {creep.say(message)}, eachCycle, 4);
  },
  isNear: function(targetA, targetB)
  {
    return this.getDistanceBetweenTargets(targetA, targetB) < 4;
  },
  isCreepLiving: function(room, name)
  {
    for(var c in Game.creeps)
    {
      if(Game.creeps[c].room.name == room.name && Game.creeps[c].name.indexOf(name) >= 0)
      return true;
    }
    
    return false;
  },
  onlyDoTicks: function(callback, ticks, howLong = 1)
  {
    for(var i = 0; i < howLong; i++){
      if((Game.time % ticks) == i)
      {
        callback();
        return;
      }
    }
  },
  logCreep: function(message)
  {
    return;
    console.log(message);
  },
  logCombat: function(message)
  {
    console.log(message);
  },
  logTower: function(message)
  {
    return;
    console.log(message);
  },
  logLink: function(message)
  {
    console.log(message);
  },
  getRandomTarget(targets)
  {
    return targets[Math.ceil(Math.random()*(targets.length -1))];
  },
  getCreepInfo: function(creep)
  { // TODO away with the comments!
    var squadName = '';
   // if(creep.memory.additional.squad != undefined)
    squadName = ' [' + /*creep.memory.additional.squad */ 'TODO ' + ']';
    
    return '';  //TODO:  creep.name + squadName + '(' + creep.room.name + ';' + creep.ticksToLive + 'TTL;' + creep.carry[RESOURCE_ENERGY] + 'E/' + creep.carryCapacity + ')';
  },
  
  getDistanceBetweenTargets: function(targetA, targetB)
  {
    return Math.sqrt(Math.pow(targetA.pos.x - targetB.pos.x, 2) + Math.pow(targetA.pos.y - targetB.pos.y, 2));
  },
  
  tryFilterId: function(obj, targets, state)
  {
    if(state == undefined)
    return targets;
    if(obj.memory.additional[state] == undefined)
    return targets;
    
    for(var t in targets)
    {
      if(targets[t].id == obj.memory.additional[state])
      return [targets[t]];
    }
    return [];
  },
  sortNearestTarget: function(obj, targets)
  {
    targets.sort(function(targetA, targetB)
    {
      return utils.getDistanceBetweenTargets(targetA, obj) - utils.getDistanceBetweenTargets(targetB, obj);
    });
  },
  sortPosInsquadTarget: function(targets)
  {
    targets.sort(function(targetA, targetB)
    {
      return targetA.memory.posInsquad - targetB.memory.posInsquad;
    });
  },
  
  
};

module.exports = utils;