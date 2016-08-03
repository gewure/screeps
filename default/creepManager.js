var roleManager = require('roleManager');
var creepUtils = require('creepUtils');
var combatManager = require('combatManager');

var creepManager = {
  foundCreeps: {},
  getFoundCreeps(room)
  {
    if(this.foundCreeps[room.name] == undefined)
    return [];
    
    return this.foundCreeps[room.name];
  },
  findCreeps: function(room)
  {
    var numberCreeps = {};
    var creepsByRole = {};
    for(var r in roleManager.roles)
    {
      var role = roleManager.roles[r].name;
      var found = _.filter(Game.creeps, (creep) => creep.memory.role == role && (creep.memory.additional.room == room.name || creep.room.name == room.name));
      if(found.length > 0)
      {
        numberCreeps[role] = {};
        creepsByRole[role] = {nr:0};
        
        for(var c in found)
        {
          var creep = found[c];
          var special = JSON.stringify(creep.memory.additional);
          
          // Don't count creep as living when it is almost death
          if(!(creep.memory.additional.createBeforeDie != undefined && creep.ticksToLive <= creep.memory.additional.createBeforeDie))
          {
            if(numberCreeps[role][special] == undefined)
            numberCreeps[role][special] = {nr:0, ticks:''};
            
            //console.log(creep.name + ' ' + role + '.' + special);
            numberCreeps[role][special].nr += 1;
            numberCreeps[role][special].ticks += creep.name + ': ' + creep.ticksToLive + 'TTL;';
            creepsByRole[role].nr += 1;
          }
        }
      }
    }
    this.foundCreeps[room.name] = {creepsByRoleSpecial:numberCreeps,creepsByRole:creepsByRole};
    
    // console.log(JSON.stringify(numberCreeps));
    return {creepsByRoleSpecial:numberCreeps,creepsByRole:creepsByRole};
  },
  getByNeeded: function(foundCreeps, needed)
  {
    //console.log(needed.role + '.' + JSON.stringify([needed.additional]));
    //console.log(JSON.stringify(foundCreeps));
    if(foundCreeps[needed.role] == undefined  || foundCreeps[needed.role][JSON.stringify(needed.additional)] == undefined)
    return {nr:0, ticks: ''}
    
    return foundCreeps[needed.role][JSON.stringify(needed.additional)];
  },
  runRoom: function(room, foundCreeps, neededCreeps)
  {
    var totalCosts = 0;
    for(var i = 0; i < neededCreeps.length; i++)
    {
      var needed = neededCreeps[i];
      
      // && creep.body == needed.body
      var found = this.getByNeeded(foundCreeps, needed).nr;
      var ticks = this.getByNeeded(foundCreeps, needed).ticks;
      var bodyCosts = 0;
      for(var b in needed.body)
      {
        var bodyPart = needed.body[b];
        if(bodyPart == MOVE || bodyPart == CARRY)
        bodyCosts += 50;
        if(bodyPart == WORK)
        bodyCosts += 100;
        if(bodyPart == ATTACK)
        bodyCosts += 80;
        if(bodyPart == RANGED_ATTACK)
        bodyCosts += 150;
        if(bodyPart == HEAL)
        bodyCosts += 250;
        if(bodyPart == TOUGH)
        bodyCosts += 10;
        if(bodyPart == CLAIM)
        bodyCosts += 600;
      }
      totalCosts += bodyCosts * needed.nr;
      console.log(room.name + ' creep role ' + needed.role + '(' + needed.additional.name + ')' + '(' + bodyCosts + '$): ' + found +  '/' + needed.nr + '(' + ticks + ')'  + ' ' + needed.body);
      
      if(found < needed.nr)
      {
        var created = false;
        var name = creepUtils.getNewName(needed.additional.room + '_' + needed.additional.name);
        
        for(var j in Game.spawns)
        {
          var spawn = Game.spawns[j];
          
          if(spawn.room.name == room.name && spawn.canCreateCreep(needed.body) == OK)
          {
            var newName = spawn.createCreep(needed.body, name, {role: needed.role, posInsquad:found, additional: needed.additional});
            console.log(room.name + '/' + spawn.name + ' create creep (name:' + name + ', role ' + needed.role + '): ' + newName + '; body: ' + needed.body);
            created = true;
            break;
          }
          //else if(spawn.room.name == room.name)
          //{
          //    console.log(room.name + '/' + spawn.name + ': canCreateCreep failed(In ' + spawn.room.name + ')');
          //}
        }
        
        if(created == false)
        console.log(room.name + ' creep ' + name + ': Creation failed');
      }
    }
    console.log(room.name + ' costs: ' + totalCosts + '$, ' + (totalCosts/1500.0) + '$ per tick');
  },
  findCreepsBysquad: function(squadname)
  {
    var resultList = [];
    var leader = null;
    for(var c in Game.creeps)
    {
      var creep = Game.creeps[c];
      if(creep.memory.additional.squad == squadname)
      {
        resultList.push(creep);
        
        if(creep.memory.additional.isLeader == true)
        leader = creep;
      }
    }
    return {all:resultList, leader:leader};
  },
  run: function(roomStatistics)
  {
    var allNames = roomStatistics.getAllOwnCreepsNamesSortedByLeaderFirst();
    
    for(var id in allNames)
    {
      var name = allNames[id];
      var creep = Game.creeps[allNames[id]];
      
      if(creepUtils.moveToDieIfTTLInMemory(creep) == true)
      return;
      
      if(creep.ticksToLive <= 1)
      {
        console.log('Creep ' + name + ' dies...');
      }
      else
      {
        //console.log(name + ' ticks: ' + creep.ticksToLive);
        try
        {
          //if(creep.memory.role == 'foreignHarvester')
          //creep.memory.role = 'harvester';
          var squad = undefined;
          var messages = undefined;
          if(creep.memory.additional.squad != undefined)
          {
            messages = {};
            squad = combatManager.getsquad(creep.memory.additional.squad);
            if(squad.messages == undefined)
            {
              console.log('squad.messages undefined for ' + squad.name + '. Define in combatManager.setsquadMessages()');
            }
            else {
              squad.creeps = this.findCreepsBysquad(squad.name);
              squad.attackers = roomStatistics.findHostileCreeps(creep.room);
              squad.currentRoomAttacked = squad.attackers.length > 0;
              for(var m in squad.messages)
              {
                messages[m] = squad.messages[m];
              }
              if(creep.memory.additional.isLeader)
              {
                var overwrite = squad.messages._leaderOverwrite;
                if(overwrite != undefined)
                {
                  for(var m in overwrite)
                  {
                    messages[m] = overwrite[m];
                  }
                }
              }
            }
            
          }
          try {
            roleManager.getByName(creep.memory.role).run(creep, squad, messages);
            
          } catch (err) {
            
            console.log('Exception in running creep ' + name + '(' + creep.ticksToLive + 'TTL): ' + err);
            console.log(err.stack);
          }
        }
        catch(err)
        {
          console.log('Exception in running creep ' + name + '(' + creep.ticksToLive + 'TTL): ' + err);
          console.log(err.stack);
        }
      }
    }
  }
};

module.exports = creepManager;