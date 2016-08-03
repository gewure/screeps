var creepUtils = require('creepUtils');
var combatUtils = require('combatUtils');
var utils = require('utils');
var roomStatistics = require('roomStatistics');
var formations = require('formations');

var roleScouter = {
  alwaysRunBefore: function(creep, squad)
  {
  },
  /** @param {Creep} creep **/
  run: function(creep, squad, messages) {
    var posBefore = creep.pos;
    
    // Todo: wenn leader: ganzer block steuern
    if(messages.doSuicide == true)
    {
      utils.creepSay(creep, 'SUICIDE!');
      creepUtils.moveToNearestSpawnAnDie(creep, Game.rooms[creep.memory.additional.room]);
    }
    else if(messages.doSuicideNow == true)
    {
      utils.creepSay(creep, 'SUICIDE NOW!');
      creep.suicide();
    }
    else
    {
      utils.logCombat(utils.getCreepInfo(creep) + '[attacked:' + squad.currentRoomAttacked + ']: ' + squad.creeps.all.length + ' leader:' + squad.creeps.leader);
      if(messages.say != undefined)
      utils.creepSay(creep, messages.say);
      
      var followObject = null;
      if(messages.followIdWhenSeen != undefined)
      followObject = Game.getObjectById(messages.followIdWhenSeen);
      /*
      console.log(creep.name + messages.followIdWhenSeen + ': ' + followObject);*/
      
      if(followObject != null && followObject != undefined)
      {
        creepUtils.followCreep(creep, followObject);
      }
      else if(messages.moveToFlag != undefined)
      {
        var flag = Game.flags[messages.moveToFlag];
        
        // Set all other creeps to me
        if(this.isLeader(creep, squad) == true && flag != undefined && flag.room != undefined  && creep.room.name == flag.room.name && creepUtils.isNearEntrance(squad.creeps.leader, 4) == false)
        {
          var formation = formations.getFormation(messages.followFormation);
          
          if(formation != null)
          {
            var nextPos = creepUtils.getNextMoveToPosition(creep, flag);
            var diffX = nextPos.pos.x - creep.pos.x;
            var diffY = nextPos.pos.y - creep.pos.y;
            console.log('diff:' + diffX + '.' + diffY);
            var i = 1;
            
            if(diffX == 0 && diffX == 0)
            utils.sortPosInsquadTarget(squad.creeps.all);
            else
            utils.sortNearestTarget(flag, squad.creeps.all);
            
            for(var c in squad.creeps.all)
            {
              var ccreep = squad.creeps.all[c];
              // leader must have id 0
              var currI = i;
              if(this.isLeader(ccreep,squad) == true)
              currI = 0;
              
              var newCPos = new RoomPosition(ccreep.pos.x + diffX, ccreep.pos.y + diffY, creep.room.name);
              var squadPos = new RoomPosition(nextPos.pos.x + formation[currI][0], nextPos.pos.y + formation[currI][1], creep.room.name);
              
              //console.log(ccreep.name + currI + ' = ' + formation[currI][0] + '.' + formation[currI][1]);
              if(diffX == 0 && diffY == 0) // Reorder
              {
                newCPos = squadPos;
              }
              
              if(utils.getDistanceBetweenTargets({pos:squadPos}, ccreep) > 5 && this.isLeader(ccreep,squad) == false)
              {
                utils.creepSay(ccreep, '2FORMATION');
                ccreep.moveTo(squadPos);
              }
              else {
                var result = ccreep.moveTo(newCPos);
                if(result == ERR_INVALID_TARGET || result == ERR_NO_PATH)
                {
                  screep.moveTo(squadPos);
                  utils.creepSay(ccreep, 'IT');
                }
              }
              
              if(this.isLeader(ccreep,squad) == false && ccreep.room.name == creep.room.name)
              i++;
            }
          }
        }else
        creepUtils.moveToFlagOrId(creep, creep.room, messages.moveToFlag, undefined, messages.moveToFlag);
      }
      else if(messages.followLeader == true && this.isLeader(creep, squad) == false)
      {
        if(squad.creeps.leader == undefined || creepUtils.isNearEntrance(squad.creeps.leader, 4) == true)
        {
          if(messages.backupFlag != undefined)
          {
            utils.logCombat(utils.getCreepInfo(creep) + ': No leader found! Move to backup flag: ' + messages.backupFlag);
            creepUtils.moveToFlagOrId(creep, creep.room, messages.backupFlag, undefined, messages.backupFlag);
          }
          else
          utils.logCombat(utils.getCreepInfo(creep) + ': No leader found!');
        }
        else {
          creepUtils.followCreep(creep, squad.creeps.leader);
        }
      }
    }
  },
  isLeader: function(creep, squad)
  {
    if(squad.creeps.leader == undefined)
    return false;
    
    return squad.creeps.leader.name == creep.name;
  },
};

module.exports = roleScouter;