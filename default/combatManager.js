var utils = require('utils');
var roomStatistics = require('roomStatistics');
var squads = require('squads');

var combatManager = {
  squads: [],
  
  // Define squads here
  setsquads: function()
  {
    this.squads = [
      //{name:'Infantery_1', room:'E31N2', usualTargetRoom:'E30N2', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: 15, clearMemoryNow: false},
     // {name:'Infantery_2', room:'E31N2', usualTargetRoom:'E30N2', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: 15, clearMemoryNow: false},
      //{name:'Infantery_3', room:'E31N2', usualTargetRoom:'E30N2', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: 15, clearMemoryNow: false},
      //{name:'Infantery_4', room:'E31N4', usualTargetRoom:'E31N3', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: 15, clearMemoryNow: false},
      
      //{name:'WAR_ROOM_SCOUT', room:'E31N4', usualTargetRoom:'undefined', squad:squads.singleScout, recreate: false, createOnAttackPeriod: 10, clearMemoryNow: false},
      //{name:'WAR_SCOUT3', room:'E32N5', usualTargetRoom:'undefined', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: 10, clearMemoryNow: false},
      //{name:'war_E29N3_DEL', room:'E31N4', usualTargetRoom:'undefined', squad:squads.singleScout, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},
      
      // Clears an area TODO AFTER WAR: set fales!!
      //{name:'CLEANER', room:'E31N1', usualTargetRoom:'undefined', squad:squads.attackscouter, recreate: true, createOnAttackPeriod: 10, clearMemoryNow: false},
      
      // Claims an area to transport
      //{name:'CLAIMER', room:'E31N1', usualTargetRoom:'undefined', squad:squads.singleScout, recreate: true, createOnAttackPeriod: 10, clearMemoryNow: false},
      //{name:'CLAIM_E29N3', room:'E31N1', usualTargetRoom:'E29N4', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: 10, clearMemoryNow: false},
      
      //  {name:'JASPER_SCOUT', room:'E31N4', usualTargetRoom:'undefined', squad:squads.singleScout, recreate: true, createOnAttackPeriod: 10, clearMemoryNow: false},
      
      // WAR! MASS SUICIDE
      //{name:'SUICIDE', room:'E31N4', usualTargetRoom:'undefined', squad:squads.massSuicide, recreate: false, createOnAttackPeriod: 10, clearMemoryNow: false},
      
     // {name:'Education_1', room:'E31N1', usualTargetRoom:'E30N4', squad:squads.trainers, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},
     // {name:'Education_A', room:'E31N1', usualTargetRoom:'undefined', squad:squads.attackscouter, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},
      
      // TODO AFTER WAR
      //{name:'M1', room:'E32N5', usualTargetRoom:'undefined', squad:squads.pawns, recreate: true, createOnAttackPeriod: undefined, clearMemoryNow: false},
      /*{name:'M2', room:'E31N4', usualTargetRoom:'undefined', squad:squads.pawns, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},
      {name:'M3', room:'E32N5', usualTargetRoom:'undefined', squad:squads.pawns, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},
      {name:'M4', room:'E31N4', usualTargetRoom:'undefined', squad:squads.pawns, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},
      {name:'M5', room:'E31N4', usualTargetRoom:'undefined', squad:squads.pawns, recreate: false, createOnAttackPeriod: undefined, clearMemoryNow: false},*/
    ];
  },
  
  // Set actions for squads here
  setsquadMessages: function(name)
  {
    //return {doSuicideNow:true};
    // doSuicide:true, doSuicideNow:true
    // backupFlag definieren, sonst hängen sie im spawn!
    
    if(name == 'CLEANER')// Clears an area
    return {say:'CLEAN AREA!', moveToFlag:'warClear'};
    //  if(name == 'JASPER_SCOUT')// Clears an area
    //  return {say:'CLAIM', moveToFlag:'jasper_E28N3'};
    //
    //if(name == 'SUICIDE')// Clears an area
    //return {say:'HIHI', moveToFlag:'war_E29N3T'};
    
    if(name == 'CLAIMER')
    return {say:'CLAIM', moveToFlag:'war_E29N3'};
    if(name == 'CLAIM_E29N3')
    return {say:'CLAIM', moveToFlag:'war_E29N3'};
    
    if(name == 'Infantery_1')
    return {say:'SIR!', followLeader:true, backupFlag:'flag_squad1', _leaderOverwrite:{say:'1.Leader', moveToFlag:'flag_squad1'}};
    if(name == 'Infantery_2')
    return {say:'SIR!', followLeader:true, backupFlag:'flag_squad2', _leaderOverwrite:{say:'2.Leader', moveToFlag:'flag_squad2'}};
    if(name == 'Infantery_3')
    return {say:'SIR!', followLeader:true, backupFlag:'flag_squad3', _leaderOverwrite:{say:'3.Leader', moveToFlag:'flag_squad3'}};
    if(name == 'Infantery_4')
    return {say:'SIR!', followLeader:true, backupFlag:'flag_squad4', _leaderOverwrite:{say:'4.Leader', moveToFlag:'flag_squad4'}};
    if(name == 'WAR_ROOM_SCOUT')
    return {say:'SCOUT!', moveToFlag:'flag_warRoomScout'};
    if(name == 'Education_1')
    return {say:'EDUCATION!', moveToFlag:'flag_Education1'};
    if(name == 'Education_A')
    return {say:'E_ATTACK!', moveToFlag:'flag_Education1'};
    
    
    //if(name == 'Ed_form')
    //return {followLeader:true, followFormation:'testudo', backupFlag:'flag_Education1', _leaderOverwrite:{say:'Leader', moveToFlag:'flag_Education1'}};
    //return {followLeader:true, followFormation:'testudo', backupFlag:'flag_Education1', _leaderOverwrite:{say:'Leader', moveToFlag:'flag_Education1'}};
    
    //if(name == 'Ed_form')
    //return {followLeader:true, followFormation:'testudo', backupFlag:'flag_Education1', _leaderOverwrite:{say:'Leader', moveToFlag:'flag_Education1'}};
    //return {followLeader:true, followFormation:'testudo', backupFlag:'flag_Education1', _leaderOverwrite:{say:'Leader', moveToFlag:'flag_Education1'}};
    
    // War code
    var flagTarget = 'T';
    if(name == 'M1')
    return {followLeader:true, followFormation:'testudo', backupFlag:'war_E29N3' + flagTarget, _leaderOverwrite:{say:'P1', moveToFlag:'war_E29N3' + flagTarget}};
  },
  
  definesquads: function()
  {
    this.setsquads();
    
    if(Memory.squads == undefined)
    Memory.squads = {};
    var names = [];
    for(var s in this.squads)
    {
      names.push(this.squads[s].name);
      this.squads[s].messages = this.setsquadMessages(this.squads[s].name);
      
      if(Memory.squads[this.squads[s].name] == undefined || this.squads[s].clearMemoryNow == true)
      Memory.squads[this.squads[s].name] = {};
    }
    
    for(var k in Memory.squads)
    {
      if(names.indexOf(k) < 0)
      delete Memory.squads[k];
    }
  },
  
  getsquad: function(name)
  {
    for(var s in this.squads)
    {
      if(this.squads[s].name == name)
      return this.squads[s];
    }
    
    throw new Error('squad ' + name + ' not found.');
  },
  getNeededsquads: function(room)
  {
    var neededsquads = [];
    for(var s in this.squads)
    {
      var squad = this.squads[s];
      
      var attacked = false;
      if(Game.rooms[squad.usualTargetRoom] != undefined)
      {
        var attacked = roomStatistics.getRoomAttackNr(Game.rooms[squad.usualTargetRoom]) > 0;
        if(attacked == true)
        console.log(Game.rooms[squad.usualTargetRoom] + ' Warning!!!! Hostiles found!!!!!!!!');
      }
      if(squad.room == room.name && (squad.recreate == true || (squad.createOnAttackPeriod != undefined && squad.createOnAttackPeriod <= roomStatistics.getRoomAttackPeriod(Game.rooms[squad.usualTargetRoom]) && attacked == true)))
      {
        var needed = squad.squad.getNeededCreeps(squad.name, room);
        for(var n in needed)
        neededsquads.push(needed[n]);
      }
    }
    return neededsquads;
  }
}


module.exports = combatManager;