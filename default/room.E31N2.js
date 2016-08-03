var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleScouter = require('role.scouter');
var roleLink = require('role.link');
var roleManager = require('roleManager');
var creepBalancer = require('creepBalancer');
var roomBase = require('room.base');
var utils = require('utils');
var roleTransporterPlus = require('role.transporterPlus');
var roleStoreMover = require('role.storeMover');
var roleRepairer = require('role.repairer');

// ROOM
var storageID = '577b2f88e03b2946707baba5';
var contIDs = ['579161da6ee725205e65df76','57796949720916567dc376ca','5790e8a08e8b0a292cbe4989', '5779b1268eef705e48c33a6e', '5789f4ef237741a55ba23e42']; // mineral con: 5789f4ef237741a55ba23e42
var contStorIDs = ['579161da6ee725205e65df76','57796949720916567dc376ca','5790e8a08e8b0a292cbe4989', '5779b1268eef705e48c33a6e' ,'577b2f88e03b2946707baba5', '5789f4ef237741a55ba23e42'];//
var towIDs = ['579edd04e6e3c11a56d99b9d','5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04'];
var linkIDs = ['5791029f12e9a1f3752777ce', '577f2b75f5dd02623e306006']; // from down to up
var terminalID = '57873c64cf3a1f7c0baf3f53';
var mineralContainerIDs = ['5789f4ef237741a55ba23e42'];
var upgrLinkID = ['5790ce3942b995c61809fa8d'];
var labIDs_LO = ['57881591ba0d6675329a0045', '5789d6256ae4243427bb509c','578b8b37db6021474ffa389a']; // [0] = OUT, [1] = L, [2] = 0
var labIDs_UO = ['579f5f5c4ab9cf9f3dffb239','579fc21f1b7f457311638c09','579f174fdf69035410208cc6']; // last ist out lab (bld style)
var roleRoomSetup = {
  
  run: function(room, foundCreeps, squadNeeded, roomStatistics) {
    var neededCreeps = roomBase.emergencyNeeded(room, foundCreeps, true);
    
    console.log(JSON.stringify(foundCreeps.creepsByRole));
    if(neededCreeps == null) // Use target flags in other rooms instead of ids!
    neededCreeps = [
      //creepBalancer.getScout('S', room, 0, 50, {targetFlag:'E31N2_scout'}),
    creepBalancer.getContainerWorker('CW',room, 1, 450, {collectDropped:true}),

    creepBalancer.getNearbyHarvester('H_B', room, 1, 600, {targetId:'576a9c7f57110ab231d892f6'}, {createBeforeDie:30}),
      creepBalancer.getNearbyHarvester('H_T', room, 1, 600, {targetId:'576a9c7f57110ab231d892f7'}, {createBeforeDie:30}),
            //creepBalancer.getContainerWorker('CW_L',room, 1, 150, {targetId:'577b2f88e03b2946707baba5', homeId:'5779b1268eef705e48c33a6e', onlyUseLinksAsContainer: true}, {createBeforeDie:10}),
    //  creepBalancer.getRepairer('R', room, 1, 700),

      //creepBalancer.getNearbyHarvester('H_S', room, 1, 200, {createBeforeDie:30}),
      //{role: roleHarvester.name, body: [MOVE,MOVE,MOVE,CARRY,CARRY,WORK,WORK,WORK], nr: 2, additional:{name:'FastHarvester', room:room.name}},
      //  {role: roleBuilder.name, body: [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK], nr: 3, additional:{targetFlag:'buildTarget', name:'TargetBuilder', room:room.name}},
      //creepBalancer.getUpdater('U',room, 1, 1200),
      //creepBalancer.getTransporter('T',room, 1, 300,undefined),.
      {role: roleTransporterPlus.name, body: [MOVE,CARRY,CARRY, MOVE, CARRY,CARRY], nr:2 , additional:{room: room.name, name: 'TP+'}},
      {role: roleUpgrader.name, body: [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,WORK,WORK], nr: 2, additional:{room: room.name, name: 'up'}}
      //creepBalancer.getStoreMover('T',room, 1, 300),
      //creepBalancer.getContainerWorker('CW_L',room, 1, 150, {targetId:'579199dda79877d0580ebfde', onlyUseLinksAsContainer: true}, {createBeforeDie:30}),
      //creepBalancer.getContainerWorker('CW_B',room, 1, 300, {targetId:'578c27da955410fa61d28a86', collectDropped:true}, {createBeforeDie:30}), // Back to 300 after reperation
      //creepBalancer.getClaimer('CLAIMER', room, 1,undefined, {targetFlag:'claimFlag', reserveOnly:true}),
     // creepBalancer.getClaimer('CLAIMER_E31N5', room, 1,undefined, {targetFlag:'claimFlag_E31N5', reserveOnly:true}),
      //creepBalancer.getForeignHarvester('HF_E31N3', room, 3, 500, {targetFlag:'SRC_E31N3'}),
      //creepBalancer.getForeignHarvester('HF_E31N5', room, 2, 700, {targetFlag:'SRC_E31N5', createBeforeDie:100}),
      //{role: roleHarvester.name, body: [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,WORK,WORK], nr: 2, additional:{room: room.name, name: 'HF_E31N5', targetFlag:'SRC_E31N5', useLinksAsContainer: true, createBeforeDie:100}}
      //{role: roleTargetHarvester.name, body: [MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK], nr: 1, additional:{room: room.name, name: 'HF_TARGET', targetFlag:'harvestFlag'}}
    ];
    
    //
    // Create builder or upgrader
    //
    if(roomStatistics.findConstructionSites(room).length > 0)
    {
      if(utils.isCreepLiving(room, '_U_C_') == false)
      neededCreeps.push(creepBalancer.getBuilder('B_R', room, 1, 900, {repairAlso: true}));
    }
   /* else if(roomStatistics.areContainersAvailableFull(room, 1, 35.0) == true)
    {
      if(utils.isCreepLiving(room, '_B_') == false)
      neededCreeps.push(creepBalancer.getUpdater('U_C_',room, 1, 800));
    } */
    
    
    //
    // When counter are full
    //
    /*if(roomStatistics.areContainersAvailableFull(room, 1, 35.0) == true)
    {
      console.log(room.name + ': 1 containers 35% full!');
      neededCreeps.push(creepBalancer.getContainerWorker('CW_F',room, 1, 150));
    } 
    
    if(roomStatistics.areContainersAvailableFull(room, 1, 70.0) == true)
    {
      console.log(room.name + ': 2 containers 60% full!');
      neededCreeps.push(creepBalancer.getContainerWorker('CW_FF',room, 1, 300));
    } */
    
    //
    // Do foreign WORK
    //
    //neededCreeps.push(creepBalancer.getClaimer('CLAIMER_NEW', room, 1,undefined, {targetFlag:'claimE32N5'}));
    //neededCreeps.push(creepBalancer.getUpdater('UUU', room, 1, 500, {targetFlag:'claimE32N5', collectFromTargetSource: true}));
    //neededCreeps.push(creepBalancer.getForeignHarvester('HF_E32N5', room, 1, 500, {targetFlag:'harvestE32N5',homeFlag:'claimE32N5'}));
    // Attention: creep needs to be there:
    //neededCreeps.push(creepBalancer.getBuilder('B_E32N5', room, 3, 800, {targetId:'57939f6342d3282220405982', collectFromTargetSource: true}));
    //neededCreeps.push(creepBalancer.getBuilder('B_E32N5', room, 3, 800, {targetFlag:'claimE32N5'}));
    //neededCreeps.push(creepBalancer.getContainerWorker('CW_UP',room, 1, 400, {targetId:'578c27da955410fa61d28a86',room:'E32N5', homeId:'5793d8b98c066ea17e512586', collectDropped:true, unLoadToContainer:true}, true));
    //    neededCreeps.push(creepBalancer.getContainerWorker('CW_JASPER',room, 1, 300, {targetId:'56f06df1ffd8f8bd557ef914',homeId:'57964964f559c9a8766cae14',room:'N28N3', collectDropped:true, targetRoom:'E29N4', unLoadToContainer:true, unLoadToStorage:true, loadFromStorage:true}, true));
    
    // Get resources from foreign storage
   /* var reperationStorage = Game.getObjectById('56f06df1ffd8f8bd557ef914');
    if(reperationStorage != undefined && reperationStorage.store[RESOURCE_ENERGY] > 10000){
      console.log('Storage to rob exists and is full.');
      neededCreeps.push(creepBalancer.getContainerWorker('CW_REPARATION',room, 5, 1200, {targetId:'56f06df1ffd8f8bd557ef914',homeId:'57904d13e55045de221ff65c', collectDropped:true, targetRoom:'E29N4', unLoadToContainer:true,unLoadToStorage:true, loadFromStorage:true, goHomeDieTTL:50}, true));
      neededCreeps.push(creepBalancer.getContainerWorker('CW_REPARATION_C',room, 1, 900, {targetId:'56f06df1ffd8f8bd557ef914',homeId:'578e47bf0499d11524c5d757', collectDropped:true, targetRoom:'E29N4', unLoadToContainer:true,unLoadToStorage:true, loadFromStorage:true, goHomeDieTTL:50}, true));
      
    }
    */
    
    // Todo: only when we can afford it
   /* for(var s in squadNeeded)
    neededCreeps.push(squadNeeded[s]); */
    
    // Sets the links
    var links = [{role: roleLink.name, sourceId: '577f2b75f5dd02623e306006', targetId: '5790ce3942b995c61809fa8d'}];
    
    return {neededCreeps:neededCreeps, towerRoles:roomBase.getTowerRoles(room, roomStatistics), links:links};
  }
  
};


module.exports = roleRoomSetup;