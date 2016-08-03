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
var roleTank = require('role.tank');

// ids and stuff
var toNextRoom = 'extraResource';
var toSpawnRoom = 'Spawn';
var otherContainerIDs = [ '5782d2f389d0e70f51a8f289', '57886bfa2e7e32dd33dd5a19']; //5782d2f389d0e70f51a8f289
var otherStorID =['5785398b91941a441c38dd7e'];
var otherContainerStorIDs =  [ '5782d2f389d0e70f51a8f289', '5785398b91941a441c38dd7e','57886bfa2e7e32dd33dd5a19']; //577f6016199656487e53ee11
var otherTowerIDs = ['578165832b0f16cb03ea73e4', '57887ac7c29d34de53a61c5e'];
var otherLinkIDs = ['5790e50543f1b3f2295aaf0c', '57881083f65bca74406e1b09'];
var roleRoomSetup = {
  
  run: function(room, foundCreeps, squadNeeded, roomStatistics) {
    var neededCreeps = roomBase.emergencyNeeded(room, foundCreeps, true);
    
    console.log(JSON.stringify(foundCreeps.creepsByRole));
    if(neededCreeps == null) // Use target flags in other rooms instead of ids!
    neededCreeps = [
      //creepBalancer.getScout('S', room, 0, 50, {targetFlag:'E31N2_scout'}),
      creepBalancer.getNearbyHarvester('H', room, 1, 600, {createBeforeDie:30}),
      //creepBalancer.getNearbyHarvester('H_S', room, 1, 200, {createBeforeDie:30}),
      //{role: roleHarvester.name, body: [MOVE,MOVE,MOVE,CARRY,CARRY,WORK,WORK,WORK], nr: 2, additional:{name:'FastHarvester', room:room.name}},
      //  {role: roleBuilder.name, body: [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK], nr: 3, additional:{targetFlag:'buildTarget', name:'TargetBuilder', room:room.name}},
      creepBalancer.getUpdater('U',room, 1, 800),
     // creepBalancer.getTransporter('U',room, 1, 300),
      //creepBalancer.getContainerWorker('CW_L',room, 1, 150, {targetId:'57881083f65bca74406e1b09', onlyUseLinksAsContainer: false}, {createBeforeDie:30}),
      creepBalancer.getContainerWorker('CW_L',room, 1, 150, {createBeforeDie:30}),
       {role: roleTransporterPlus.name, body: [MOVE,CARRY,CARRY, MOVE, CARRY, CARRY], nr:2 , additional:{room: room.name, name: 'TP+'}},
      //creepBalancer.getContainerWorker('CW_B',room, 1, 150, {targetId:'5785398b91941a441c38dd7e', homeId:'5782d2f389d0e70f51a8f289', collectDropped:true}), 
      //creepBalancer.getClaimer('CLAIMER', room, 1,undefined, {targetFlag:'claimFlag', reserveOnly:true}),
      //creepBalancer.getClaimer('CLAIMER_E31N5', room, 1,undefined, {targetFlag:'claimFlag_E31N5', reserveOnly:true}),
      //creepBalancer.getForeignHarvester('HF_E31N3', room, 3, 500, {targetFlag:'SRC_E31N3'}),
      //creepBalancer.getForeignHarvester('HF_E31N5', room, 2, 700, {targetFlag:'SRC_E31N5', createBeforeDie:100}),
            {role: roleTank.name, body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK, ATTACK, ATTACK,ATTACK, ATTACK, ATTACK,ATTACK, ATTACK, ATTACK,ATTACK, ATTACK, ATTACK,ATTACK], nr: 1, additional:{room: room.name, name: 'Killer',createBeforeDie:300}}

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
    /*else if(roomStatistics.areContainersAvailableFull(room, 1, 35.0) == true)
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
   /* var reperationStorage = Game.getObjectById('');
    if(reperationStorage != undefined && reperationStorage.store[RESOURCE_ENERGY] > 10000){
      console.log('Storage to rob exists and is full.');
      neededCreeps.push(creepBalancer.getContainerWorker('CW_REPARATION',room, 5, 1200, {targetId:'56f06df1ffd8f8bd557ef914',homeId:'57904d13e55045de221ff65c', collectDropped:true, targetRoom:'E29N4', unLoadToContainer:true,unLoadToStorage:true, loadFromStorage:true, goHomeDieTTL:50}, true));
      neededCreeps.push(creepBalancer.getContainerWorker('CW_REPARATION_C',room, 1, 900, {targetId:'56f06df1ffd8f8bd557ef914',homeId:'578e47bf0499d11524c5d757', collectDropped:true, targetRoom:'E29N4', unLoadToContainer:true,unLoadToStorage:true, loadFromStorage:true, goHomeDieTTL:50}, true));
      
    } */
    
    
    // Todo: only when we can afford it
   /* for(var s in squadNeeded)
    neededCreeps.push(squadNeeded[s]); */
    
    // Sets the links
    var links = [{role: roleLink.name, sourceId: '5790e50543f1b3f2295aaf0c', targetId: '57881083f65bca74406e1b09'}];
    
    return {neededCreeps:neededCreeps, towerRoles:roomBase.getTowerRoles(room, roomStatistics), links:links};
  }
  
};


module.exports = roleRoomSetup;