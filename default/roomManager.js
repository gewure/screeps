var roomE31N1 = require('room.E31N1');
var roomE31N2 = require('room.E31N2');
var roomE28N3 = require('room.E28N3');
var utils = require('utils');

var roomManager = {
  
  rooms : {'E31N2':roomE31N2, 'E31N1':roomE31N1, 'E28N3':roomE28N3},
  foreignRooms : ['E27N3','E29N3'],
  
  //
  // Code for auto street generation
  //
  clearNegativeStreetPheromons: function(room, streetKeys)
  {
    for(var key in room.memory.streetPheromons)
    {
      if(room.memory.streetPheromons[key] <= 0 || streetKeys.indexOf(key) >= 0)
      {
        delete room.memory.streetPheromons[key];
        
        this.clearNegativeStreetPheromons(room, streetKeys);
        return;
      }
    }
  },
  updateStreetPheromons: function(roomName, roomStatistics)
  {
    var testWhetherBuildEveryCycle = 500;
    var renewStreetsEveryCycle = 3600*24;
    var increaseRate = 500;
    var decreaseRatePerCycle = 50;
    var borderToBuild = 30000;
    var maxMemory = 20;
    var room = Game.rooms[roomName];
    
    if(room.memory.streetPheromons == undefined)
    room.memory.streetPheromons = {};
    if(room.memory.streetPheromonsShouldBuild == undefined)
    room.memory.streetPheromonsShouldBuild = [];
    
    delete room.memory.streets;
    utils.onlyDoTicks(function()
    {
      console.log('Update street building...');
      room.memory.streetPheromonsShouldBuild = [];
    }, testWhetherBuildEveryCycle);
    
    var streets = roomStatistics.findStructuresByType(room, STRUCTURE_ROAD);
    var streetKeys = [];
    for(var s in streets)
    {
      streetKeys.push(streets[s].pos.x + '.' + streets[s].pos.x);
    }
    
    //console.log('Streets: ' + JSON.stringify(room.memory.streets));
    //console.log(JSON.stringify(room.memory.streetPheromons));
    
    for(var name in Game.creeps)
    {
      var creep = Game.creeps[name];
      if(creep.room.name == roomName)
      {
        var x = creep.pos.x;
        var y = creep.pos.y;
        var key = x + '.' + y;
        
        // Add pheromons only when its not a known street
        if(streetKeys.indexOf(key) < 0)
        {
          if(room.memory.streetPheromons[key] == undefined)
          {
            if(Object.keys(room.memory.streetPheromons).length < maxMemory)
            room.memory.streetPheromons[key] = increaseRate;
          }
          else
          room.memory.streetPheromons[key] += increaseRate;
        }
      }
    }
    
    
    // Test whether pheromons are streets
    utils.onlyDoTicks(function(){
      for(var key in room.memory.streetPheromons)
      {
        if(room.memory.streetPheromons[key] != undefined && room.memory.streetPheromons[key] >= borderToBuild)
        {
          var foundRoad = false;
          var objects = room.lookAt(x, y);
          for(var o in objects)
          {
            var obj = objects[o];
            if(obj.type == 'structure' && obj.structure.structureType == STRUCTURE_ROAD)
            foundRoad = true;
          }
          
          if(foundRoad == false)
          {
            var keyLT = (x-1) + '.' + (y-1);
            var keyCT = (x-0) + '.' + (y-1);
            var keyRT = (x+1) + '.' + (y-1);
            var keyLC = (x-1) + '.' + (y-0);
            var keyRC = (x+1) + '.' + (y-0);
            var keyLB = (x-1) + '.' + (y+1);
            var keyCB = (x-0) + '.' + (y+1);
            var keyRB = (x+1) + '.' + (y+1);
            // Test whether another road arround
            if(streetKeys.indexOf(keyLT) >= 0 ||
            streetKeys.indexOf(keyCT) >= 0 ||
            streetKeys.indexOf(keyRT) >= 0 ||
            streetKeys.indexOf(keyLC) >= 0 ||
            streetKeys.indexOf(keyRC) >= 0 ||
            streetKeys.indexOf(keyLB) >= 0 ||
            streetKeys.indexOf(keyCB) >= 0 ||
            streetKeys.indexOf(keyRB) >= 0)
            room.memory.streetPheromonsShouldBuild.push(key);
            else
            delete room.memory.streetPheromons[key];
          }
          else
          {
            delete room.memory.streetPheromons[key];
          }
        }
        
        if(room.memory.streetPheromonsShouldBuild.indexOf(key) >= 0)
        room.createConstructionSite(x,y, STRUCTURE_ROAD);
      }
    }, testWhetherBuildEveryCycle);
    
    console.log('You should build a street in room ' + room.name + ' at:' + JSON.stringify(room.memory.streetPheromonsShouldBuild));
    
    for(var key in room.memory.streetPheromons)
    {
      room.memory.streetPheromons[key] -= decreaseRatePerCycle;
    }
    
    this.clearNegativeStreetPheromons(room, streetKeys);
  }
  
};

module.exports = roomManager;