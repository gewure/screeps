var roleManager = require('roleManager');
var creepBalancer = require('creepBalancer');
var roomBase = require('room.base');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleScouter = require('role.scouter');
var roleLink = require('role.link');
var roleManager = require('roleManager');
var creepBalancer = require('creepBalancer');
var roomBase = require('room.base');
var roleTransporterPlus = require('role.transporterPlus');
var roleStoreMover = require('role.storeMover');
var utils = require('utils');

// room3 ids
var r3_towerIDs = ['579518473cbd825f5b500e79','579892977674a91935668971'];
var r3_containerIDs =['57941ab1f31f1e10614fd5c5', '5793ecfc9aff256e70752169', '5794449a93a10c621525fc8a']; // last one is container at entrance
var r3_linkIDs = ['5798938ed13e873d2b44121d','57986e71cbde07c62c2e9554'];
var r3_sourceIDs = ['55db34d8efa8e3fe66e0612f', '55db34d8efa8e3fe66e0612d']; // bottom-up
var r3_exe_south_flag= 'E27N3_1';
var r3_storage = 'bldCont';

var ctrlLeftFlag = 'E27N3_CTRL';
var exeRight = 'E29N3_1';
var exeLeft = 'E27N3_1';
var ctrlRightFlag = 'E29N3_CTRL';
var exeTop1 = 'E28N4_1';
var exeTop2 = 'E28N4_2';

var roleRoom = {
  
  run: function(room, foundCreeps, squadNeeded, roomStatistics) {
    var neededCreeps = roomBase.emergencyNeeded(room, foundCreeps, true);
    
    console.log(JSON.stringify(foundCreeps.creepsByRole));
    if(neededCreeps == null)
    neededCreeps = [
       // creepBalancer.getTransporter('transporter+', room, 3, 450),
      //creepBalancer.getContainerWorker('CW_C_B',room, 1, 450, {homeId:'', targetId:'', unLoadToContainer:true}), // TODO: when storage -> flag loadFromStorage:true und implementieren
      //creepBalancer.getContainerWorker('CW_C_T',room, 1, 450, {homeId:'', targetId:'', unLoadToContainer:true}), // TODO: when storage -> flag loadFromStorage:true und implementieren
      creepBalancer.getContainerWorker('CW',room, 2, 450, {collectDropped:true}),
       creepBalancer.getNearbyHarvester('H_B', room, 1, 700, {targetId:r3_sourceIDs[0]}, {createBeforeDie:40}),
      creepBalancer.getNearbyHarvester('H_T', room, 1, 600, {targetId:r3_sourceIDs[1]}, {createBeforeDie:30}),
            creepBalancer.getRepairer('R', room, 1, 700),

         {role: roleTransporterPlus.name, body: [MOVE,CARRY,CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY], nr:3 , additional:{room: room.name, name: 'TP+'}},
      //creepBalancer.getNearbyHarvester('H_B', room, 1, 600, {targetId:r3_sourceIDs[0]}, {createBeforeDie:30}),
      //creepBalancer.getNearbyHarvester('H_T', room, 1, 600, {targetId:r3_sourceIDs[1]}, {createBeforeDie:30}),
      
      creepBalancer.getClaimer('CLAIMER_E27N3', room, 1,undefined, {targetFlag:ctrlRightFlag, reserveOnly:true,createBeforeDie:70}),
      creepBalancer.getClaimer('CLAIMER_E29N3', room, 1,undefined, {targetFlag:ctrlLeftFlag, reserveOnly:true,createBeforeDie:40}),
      creepBalancer.getForeignHarvester('HF_E31N3', room, 2, 750, {targetFlag:exeLeft}),
      creepBalancer.getForeignHarvester('HF_E31N3', room, 2, 1250, {targetFlag:exeRight}),
      creepBalancer.getForeignHarvester('HF_E31N3', room, 2, 750, {targetFlag:'E29_N2_1'}),
      creepBalancer.getForeignHarvester('HF_E31N3', room, 2, 750, {targetFlag:'E28N4_1'}),
      creepBalancer.getForeignHarvester('HF_E31N3', room, 2, 750, {targetFlag:'E28N4_2'}),
      //creepBalancer.getForeignHarvester('HF_E31N3', room, 1, 750, {targetFlag:'E29N4_1'}),
      
      {role: roleUpgrader.name, body: [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,WORK,WORK], nr: 2, additional:{room: room.name, name: 'up'}}

        //creepBalancer.getUpdater('U',room, 1, 1200),

      
    ];
    
    if(roomStatistics.findConstructionSites(room).length > 0)
    {
      neededCreeps.push(creepBalancer.getBuilder('B_R', room, 1, 600, {repairAlso: true}));
    }
    else
    neededCreeps.push(creepBalancer.getUpdater('U_A',room, 1, 1200));
    
    //
    // When counter are full
    //
    /*if(roomStatistics.areContainersAvailableFull(room, 1, 75.0) == true)
    {
      console.log(room.name + ': 1 containers 75% full!');
      neededCreeps.push(creepBalancer.getContainerWorker('CW_F',room, 1, 300, {collectDropped:true}));
    } */
    
   // for(var s in squadNeeded)
    //neededCreeps.push(squadNeeded[s]);
    
    return {neededCreeps:neededCreeps, towerRoles:roomBase.getTowerRoles(room, roomStatistics), links:[]};
  }
  
};


module.exports = roleRoom;