var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleScouter = require('role.scouter');
var roleContainerWorker = require('role.containerWorker');
var roleTower = require('role.tower');
var roleTransporterPlus = require('role.transporterPlus');
var roleStoreMover = require('role.storeMover');
var roleRepairer = require('role.repairer');

var creepBalancer = {
  
  getContainerWorker: function(name, room, nr, maxEnergyPer, additional, foreign)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 100;
    
    if(maxEnergyPer < 100)
    throw new Error('You can not build an energyworker for < 100');
    if((maxEnergyPer  % 150) != 0)
    console.log(name + ' CW: should be energy / 150');
    
    var ratioMoveRest = 3;
    if(foreign == true)
    ratioMoveRest = 2;
    
    body = [MOVE, CARRY];
    maxEnergyPer -= 100;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % ratioMoveRest) == 0)
      body.push(MOVE);
      else
      body.push(CARRY);
      
      maxEnergyPer -= 50;
      i++;
    }
    
    return {role: roleContainerWorker.name, body: body, nr: nr, additional:additional};
  },
  
  getNearbyHarvester: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 200;
    
    if(maxEnergyPer < 200)
    throw new Error('You can not build an nearby harvester for < 100');
    body = [WORK, MOVE, CARRY];
    maxEnergyPer -= 200;
    while(maxEnergyPer >= 100)
    {
      body.push(WORK);
      maxEnergyPer -= 100;
    }
    
    return {role: roleHarvester.name, body:  body, nr: nr, additional:additional};
  },
  
  getClaimer: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 650;
    
    if(maxEnergyPer < 650)
    throw new Error('You can not build an reserve claimer for < 700');
    
    body = [CLAIM, MOVE];
    maxEnergyPer -= 650;
    while(maxEnergyPer >= 600)
    {
      body.push(CLAIM);
      maxEnergyPer -= 600;
    }
    
    return {role: roleClaimer.name, body:  body, nr: nr, additional:additional};
  },
  
  getScout: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 50;
    
    if(maxEnergyPer < 50)
    throw new Error('You can not build a scout for < 50');
    body = [MOVE];
    maxEnergyPer -= 50;
    while(maxEnergyPer >= 50)
    {
      body.push(MOVE);
      maxEnergyPer -= 50;
    }
    
    return {role: roleScouter.name, body: [MOVE], nr: nr, additional: additional};
  },
  
  getUpdater: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 200;
    
    if(maxEnergyPer < 200)
    throw new Error('You can not build a upgrader for < 200');
    body = [WORK, CARRY, MOVE];
    maxEnergyPer -= 200;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % 7) == 2)
      {
        body.push(CARRY);
        maxEnergyPer -= 50;
      }
      else if(maxEnergyPer >= 100)
      {
        body.push(WORK);
        maxEnergyPer -= 100;
      }
      i++;
    }
    
    return {role: roleUpgrader.name, body: body, nr: nr, additional: additional};
  },
  
  getBuilder: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 200;
    
    if(maxEnergyPer < 200)
    throw new Error('You can not build a builder for < 200');
    
    if((maxEnergyPer  % 150) != 0)
    console.log(name + ' B: should be energy / 150');
    
    body = [WORK, CARRY, MOVE];
    maxEnergyPer -= 200;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % 2) == 0)
      {
        body.push(MOVE);
        maxEnergyPer -= 50;
      }
      else if((i % 3) == 0 && maxEnergyPer >= 100)
      {
        body.push(WORK);
        maxEnergyPer -= 100;
      }
      else  {
        body.push(CARRY);
        maxEnergyPer -= 50;
      }
      
      i++;
    }
    
    return {role: roleBuilder.name, body: body, nr: nr, additional: additional};
  },
  
  getForeignHarvester: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    if(additional['room'] == undefined)
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 200;
    
    if(maxEnergyPer < 200)
    throw new Error('You can not build a foreign harvester for < 200');
    body = [WORK, CARRY, MOVE];
    maxEnergyPer -= 200;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % 2) == 0)
      {
        body.push(MOVE);
        maxEnergyPer -= 50;
      }
      else if((i % 3) == 0 && maxEnergyPer >= 100)  {
        body.push(WORK);
        maxEnergyPer -= 100;
      }
      else  {
        body.push(CARRY);
        maxEnergyPer -= 50;
      }
      
      i++;
    }
    
    return {role: roleHarvester.name, body: body, nr: nr, additional: additional};
  },
  
  /** transporter+ */
  getTransporter: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 100;
    
    if(maxEnergyPer < 100)
    throw new Error('You can not build an energyworker for < 100');
    if((maxEnergyPer  % 150) != 0)
    console.log(name + ' CW: should be energy / 150');
    
    var ratioMoveRest = 3;
   // if(foreign == true)
    //ratioMoveRest = 2;
    
    body = [MOVE, CARRY];
    maxEnergyPer -= 100;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % ratioMoveRest) == 0)
      body.push(MOVE);
      else
      body.push(CARRY);
      
      maxEnergyPer -= 50;
      i++;
    }
    
    return {role: roleTransporterPlus.name, body: body, nr: nr, additional:additional};
  },
  
  /** storeMover+ */
  getStoreMover: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 100;
    
    if(maxEnergyPer < 100)
    throw new Error('You can not build an energyworker for < 100');
    if((maxEnergyPer  % 150) != 0)
    console.log(name + ' CW: should be energy / 150');
    
    var ratioMoveRest = 3;
    //if(foreign == true)
    //ratioMoveRest = 2;
    
    body = [MOVE, CARRY];
    maxEnergyPer -= 100;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % ratioMoveRest) == 0)
      body.push(MOVE);
      else
      body.push(CARRY);
      
      maxEnergyPer -= 50;
      i++;
    }
    
    return {role: roleStoreMover.name, body: body, nr: nr, additional:additional};
  },
  
   /** repairer+ */
  getRepairer: function(name, room, nr, maxEnergyPer, additional)
  {
    if(additional == undefined)
    additional = {};
    
    additional['name'] = name;
    additional['room'] = room.name;
    
    if(maxEnergyPer == undefined)
    maxEnergyPer = 150;
    
    if(maxEnergyPer < 150)
    throw new Error('You can not build an energyworker for < 100');
    if((maxEnergyPer  % 150) != 0)
    console.log(name + ' CW: should be energy / 150');
    
    var ratioMoveRest = 3;
    //if(foreign == true)
    //ratioMoveRest = 2;
    
    body = [WORK, CARRY, MOVE];
    maxEnergyPer -= 200;
    var i = 0;
    while(maxEnergyPer >= 50)
    {
      if((i % 2) == 0)
      {
        body.push(MOVE);
        maxEnergyPer -= 50;
      }
      else if((i % 3) == 0 && maxEnergyPer >= 100)
      {
        body.push(WORK);
        maxEnergyPer -= 100;
      }
      else  {
        body.push(CARRY);
        maxEnergyPer -= 50;
      }
      
      i++;
    }
    
    return {role: roleRepairer.name, body: body, nr: nr, additional:additional};
  },
};

module.exports = creepBalancer;