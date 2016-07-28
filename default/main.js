//############ modules
var utiles = require('utils');
var roomStat = require('roomStatistics');
var roleStream = require('role.Stream');
//############ roles
var roleHarvester = require('role.harvester');
var roleHarvesterSouth = require('role.harvesterSouth');
var roleFlagConHarvester = require('role.flagConHarvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleContHarv1 = require('role.contHarv1');
var roleContHarv2 = require('role.contHarv2');  // harvests in other room!
var roleTransporter = require('role.transporter');
var roleCollector = require('role.collector');
var roleTower = require('role.tower');
var roleBalancer = require('role.balancer');
var roleExeHarvester1 = require('role.exeHarvester1');
var roleMelee = require('role.melee');
var rolePionier = require('role.pionier');
var roleDismantler = require('role.dismantler');
var rolePowerHarv = require('role.powerHarv');
var roleClaimer = require('role.claimer');
var roleOtherRoomUpgrader = require('role.otherRoomUpgrader');
var roleOtherRoomTransporter = require('role.otherRoomTransporter');
var roleOtherRoomBuilder = require('role.otherRoomBuilder');
var roleOtherRoomBalancer = require('role.otherRoomBalancer');
var roleOtherRoomCollector = require('role.otherRoomCollector');
var roleLink = require('role.link');
var roleTerminal = require('role.terminal');
var roleCrossRoomTransporter = require('role.crossRoomTansporter');
var roleMineralHarvester = require('role.mineralHarvester');
var roleOtherRoomMineralHarvester = require('role.otherRoomMineralHarvester');
var roleStorer = require('role.storer');
var roleOtherRoomStorer = require('role.otherRoomStorer');
var roleStoreMover = require('role.storeMover');
var roleRanged = require('role.ranged');
var roleTrader = require('role.trader');
var roleForeignHarvester = require('role.foreignHarvester');
var roleTransporterPlus = require('role.transporterPlus');
var roleHealer = require('role.healer');

// CPU profiler
//var profiler = require('screeps-profiler');

// TERMINAL
var terminalIDs=['57873c64cf3a1f7c0baf3f53','5790119b5ae9a2b57d03b150', '5770086cc7eeb90a0684c38b'];

// ROOM
var homeRoom = 'E31N2';
var roomname = 'E31N1';
var storageID = '577b2f88e03b2946707baba5';
var contIDs = ['579161da6ee725205e65df76','57796949720916567dc376ca','5790e8a08e8b0a292cbe4989', '5779b1268eef705e48c33a6e', '5789f4ef237741a55ba23e42']; // mineral con: 5789f4ef237741a55ba23e42
var contStorIDs = ['579161da6ee725205e65df76','57796949720916567dc376ca','5790e8a08e8b0a292cbe4989', '5779b1268eef705e48c33a6e' ,'577b2f88e03b2946707baba5', '5789f4ef237741a55ba23e42'];//
var towIDs = ['5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04'];
var linkIDs = ['5791029f12e9a1f3752777ce', '577f2b75f5dd02623e306006']; // from down to up
var terminalID = '57873c64cf3a1f7c0baf3f53';
var mineralContainerIDs = ['5789f4ef237741a55ba23e42'];
var upgrLinkID = ['5790ce3942b995c61809fa8d'];
var labIDs_LO = ['578b8b37db6021474ffa389a', '5789d6256ae4243427bb509c', '57881591ba0d6675329a0045']; // [0] = OUT, [1] = L, [2] = 0


//structures mainroom
var minWallHitpoints = 370000;//345000;
var minRampartHitpoints = 350000;//257000;
var minRoadPoints = 4000;
var minContainerPoints = 200000;



//units an defense
var repairersCount = 0;
var upgraderCount = 1;
var collectorsCount = 1;
var builderCount = 0;
var exeHarvesterCount = 0;
var transportersCount = 1;

//building
var ulessWallIDs = []; //dismantleIDs: last items are first dismantled
var dismantleTargetIDs=['5776e26b3c3de4474dcdc523'];//['57712fa2d1334bb7455781d6','5774dd07d02379476bb0e054','577b79b8c31706f86c805a2d'];//, //];


// OTHER ROOMS
var toNextRoom = 'extraResource';
var toSpawnRoom = 'Spawn';
var otherContainerIDs = [ '5782d2f389d0e70f51a8f289', '57886bfa2e7e32dd33dd5a19']; //5782d2f389d0e70f51a8f289
var otherStorID =['5785398b91941a441c38dd7e'];
var otherContainerStorIDs =  [ '5782d2f389d0e70f51a8f289', '5785398b91941a441c38dd7e','57886bfa2e7e32dd33dd5a19']; //577f6016199656487e53ee11
var otherTowerIDs = ['578165832b0f16cb03ea73e4', '57887ac7c29d34de53a61c5e'];
var otherLinkIDs = ['5790e50543f1b3f2295aaf0c', '57881083f65bca74406e1b09'];

var allTowerIDs = ['578165832b0f16cb03ea73e4', '5779f6286ce428014acf2e71', '577ecaedd47f7a6d1f04ec04']; //578165832b0f16cb03ea73e4

// room3 ids
var r3_towerIDs = ['579518473cbd825f5b500e79','579892977674a91935668971'];
var r3_containerIDs =['57941ab1f31f1e10614fd5c5', '5793ecfc9aff256e70752169', '5794449a93a10c621525fc8a']; // last one is container at entrance
var r3_linkIDs = ['5798938ed13e873d2b44121d','57986e71cbde07c62c2e9554'];
var r3_exe_south_flag= 'E27N3_1';
var r3_storage = 'bldCont';
var r3_exe_south_ctrl_flag = 'E27N3_CTRL';

//other room units
var otherRoomUpgraderCount = 1;
var pioniersCount = 0;
var pioniersSmallCount = 0;
var otherRoomBalancerCount = 1;
var otherRoomBuilderCount = 0;



//profiler.enable(); //ENABLE CPU PROFILING
//Memory.old.closestDmgArr1; Memory.old.room2Arr; Memory.enemysFound1.old; Memory.enemysFound2.old;

module.exports.loop = function () {
    
        //stream-walking(Gaensemarsch!)
        //roleStream.runAll();
    
        roomStat.update('E31N2');
        roomStat.update('E31N1');
        roomStat.update('E28N3');
        //roomStat.update('E30N4');
        try{
        //roomStat.update('E32N2');
        } catch (blalbla) {
            //yaya
        }
       //console.log(' TOTAL ROOM1 ENERGY: '+roomStat.getTotalEnergy('E31N2'));
      //profiler.wrap(function() { //CPU-PROFILER
   
   // console.log(Game.profiler.profile(10));
    //############################### MEMORY
    //Lets first add a shortcut prototype to the sources memory:
        Source.prototype.memory = undefined;
        
        for(var roomName in Game.rooms){//Loop through all rooms your creeps/structures are in
            var room = Game.rooms[roomName];
            
            if(!room.memory.sources){//If this room has no sources memory yet
                room.memory.sources = {}; //Add it
                var sources = room.find(FIND_SOURCES);//Find all sources in the current room
                
                for(var i in sources){
                    var source = sources[i];
                    source.memory = room.memory.sources[source.id] = {}; //Create a new empty memory object for this source
                    //Now you can do anything you want to do with this source
                    //for example you could add a worker counter:
                    source.memory.workers = 0;
                }
            }else { //The memory already exists so lets add a shortcut to the sources its memory
                var sources = room.find(FIND_SOURCES);//Find all sources in the current room
                for(var i in sources){
                    var source = sources[i];
                    source.memory = room.memory.sources[source.id]; //Set the shortcut
                   // console.log('source memory: '+source.memory);
                }
            }
        }
        
     //############################ memory management
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //######################## links
    roleLink.run(linkIDs[1], linkIDs[0]);
    roleLink.run(linkIDs[1],upgrLinkID[0]); 
    //var upgrLink = Game.getObjectById(labrLinkID[0]); // for the link at the laboratory
    
   //other room link
   roleLink.run(otherLinkIDs[0], otherLinkIDs[1]);
   
   //3rd room link
   roleLink.run(r3_linkIDs[1],r3_linkIDs[0]);
   //########################### TERMINAL
   roleTerminal.run(terminalIDs[1], terminalIDs[0]);
   //############################# TOWER ################
   //####### tower repair goals..

   
   // ONLY ALL SOME SECONDS (5)
       //console.log(Game.time);
       
    Memory.closestDmgArr1 = [];
    Memory.room2Arr =[];
    Memory.room3Arr =[];
   
    Memory.enemysFound1=[];
    Memory.enemysFound2 =[];
    Memory.enemysFound3 =[];
    
    Memory.droppedRes = [];
        
        var room2ArrPre = Game.spawns.StPetersburg.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || 
                    (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints)|| 
                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) || 
                    (structure.structureType == STRUCTURE_CONTAINER &&structure.hits < minContainerPoints));
        }, algorithm:'dijkstra'}); 
        
        room2ArrPre.sort((a,b) => a.hits - b.hits);
        
        var room2Arr  = room2ArrPre;//[];  

        var room3ArrPre = Game.spawns.Leningrad.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || 
                    (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints)|| 
                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) || 
                    (structure.structureType == STRUCTURE_CONTAINER &&structure.hits < minContainerPoints));
        }, algorithm:'dijkstra'}); 
        
        room3ArrPre.sort((a,b) => a.hits - b.hits);
        
        var room3Arr  = room3ArrPre;//[];   
        
        var closestDmgArr1Pre = Game.spawns.ImNoobPlzDontKill.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_ROAD && structure.hits < minRoadPoints) || 
                    (structure.structureType == STRUCTURE_WALL && structure.hits < minWallHitpoints)|| 
                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < minRampartHitpoints) || 
                    (structure.structureType == STRUCTURE_STORAGE && structure.hits < structure.hitsMax*0.9) || 
                    (structure.structureType == STRUCTURE_CONTAINER &&structure.hits < minContainerPoints));
        }, algorithm:'dijkstra'});  
                        
        //var closestDmgArr =room2Arr.concat(closestDmgArr1);
        closestDmgArr1Pre.sort((a,b) => a.hits - b.hits);
    
        var closestDmgArr1  = closestDmgArr1Pre;//[];           
    
        // write it to game memory

        closestDmgArr1.forEach(en => Memory.closestDmgArr1.push(en.id) );
        room2Arr.forEach(en => Memory.room2Arr.push(en.id) );
        room3Arr.forEach(en => Memory.room3Arr.push(en.id) );

      
    //enemies? 
    var enemysFound1 = Game.rooms[homeRoom].find(FIND_HOSTILE_CREEPS);
    var enemysFound2 = Game.rooms['E31N1'].find(FIND_HOSTILE_CREEPS);
    var enemysFound3 = Game.rooms['E28N3'].find(FIND_HOSTILE_CREEPS);
    
    enemysFound1.forEach(en => Memory.enemysFound1.push(en.id) );
    enemysFound2.forEach(en => Memory.enemysFound2.push(en.id) );
    enemysFound3.forEach(en => Memory.enemysFound3.push(en.id) );
   
    //console.log('ENEMIES FOUND:');
    //console.log(Memory.enemysFound2);
    //console.log(Memory.enemysFound1);
     
   //try {
       if(Memory.closestDmgArr1 && Memory.room2Arr && Memory.enemysFound1 && Memory.enemysFound2 && Memory.enemysFound3 && Memory.room2Arr) {
           
          // loop throuh the towers
           for(var i = 0; i < otherTowerIDs.length; i++) { // second room
               roleTower.run(Game.getObjectById(otherTowerIDs[i]), ulessWallIDs, Memory.room2Arr, Memory.enemysFound2);
               //console.log('TOWER: ' +Game.getObjectById(otherTowerIDs[i]) + ' is ready');
           }
           for(var i = 0; i < towIDs.length; i++) { //main room
               roleTower.run(Game.getObjectById(towIDs[i]), ulessWallIDs, Memory.closestDmgArr1, Memory.enemysFound1);
               //console.log('TOWER: ' +Game.getObjectById(towIDs[i]) + ' is ready');
           } 
           for(var i = 0; i < r3_towerIDs.length; i++) { //main room
               roleTower.run(Game.getObjectById(r3_towerIDs[i]), ulessWallIDs, Memory.room3Arr, Memory.enemysFound3);
               //console.log('TOWER: ' +Game.getObjectById(r3_towerIDs[i]) + ' is ready');
           } 
       } else {
               console.log('TOWER things not defined');
           } 
  // } catch(serializationException) {
    //   console.log('serialisationException with da towers');
   //}
   //}
    
        //####################### WAR ?! #####################
         var enemysFound = false;
         
         if(Memory.enemysFound1.length > 5 || Memory.enemysFound2.length > 5) {
             console.log('serious ATTack!!');
             Game.notify('Your getting wrecked!! room1: ' + Memory.enemysFound1.length + ' and in room 2: '+Memory.enemysFound2.length);
             if(Memory.enemysFound1.length >= 2 || Memory.enemysFound2.length >= 2) {
                 enemysFound = true;
             } else {
                 enemysFound = false;
             }
         }
         
         if(enemysFound) {
             console.log('enemies in the ROOM! -> ');
             repairersCount = 0;
             upgraderCount = 0;
             collectorsCount = 2;
             builderCount = 0;
             pioniersCount=0; 
         } else {
            repairersCount = 0;
            upgraderCount = 1;
            builderCount = 0;
            collectorsCount = 1;
            pioniersCount = 0; 
    
         }
        
  
     //#################################### other room ####################
     var exeRoomController = Game.getObjectById('576a9c7f57110ab231d892fa');
  
     /*f(exeRoomController.ticksToDowngrade == 1000) {
         console.log('spawning a new otherroom upgrader to prevent downgrade ');
         Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY], undefined, {role:'otherRoomUpgrader'});
     } */

     //############################## CONTROLLER LEVEL #######################
       
   // console.log('controller LVL = ' + room.controller.level + ' with ' + room.controller.progress + ' / '+ room.controller.progressTotal);
  
     //######################### key economy #############################
     if((Game.time%30)==0) {
         if(Game.rooms['E31N2'].find(FIND_CONSTRUCTION_SITES).length >= 1) {
            builderCount = 1; // builder is needed
         } else {
             console.log('no more construction sites - > no more builders!');
             builderCount = 0;
         }
          if(Game.rooms['E31N1'].find(FIND_CONSTRUCTION_SITES).length >= 1) {
                  otherRoomBuilderCount=1;
          } else {
                 otherRoomBuilderCount=0;
          }
     }
   // room.memory.collectorTicks--;
   //  if(room.memory.collectorTicks < 100) {
   //      console.log('collector dies soon, spawn a new one now!!');
   //  }
   
   
  /* _.each(Game.creeps,function(c) {
console.log(c.name);
console.log(c.memory.role);
}); */
    //####################### just console log output ##########################
    console.log('#################### fighter units: ');
    var melees = _.filter(Game.creeps, (creep) => creep.memory.role == 'melee');
    console.log('Fighters: ' + melees.length);
    var rangeds = _.filter(Game.creeps, (creep) => creep.memory.role == 'ranged');
    console.log('Rangeds: ' + rangeds.length);
    console.log('#################### home room units: ');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    //console.log('Harvesters: ' + harvesters.length);
     var harvestersSouth = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterSouth');
  //  console.log('HarvestersSouth: ' + harvestersSouth.length);
    var flagHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'flagConHarvester');
    console.log('flagConHarvester: ' + flagHarvesters.length);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
     var contHarv1s =_.filter(Game.creeps, (creep) => creep.memory.role == 'contHarv1');
    console.log('contHarv1 : ' + contHarv1s.length);
    console.log('Builders: ' + builders.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);
    var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    console.log('transporters: ' + transporters.length);
    var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
    console.log('collectors: ' + collectors.length);
    
     var storers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storer');
    console.log('storers for minerals :' + storers.length);

     var storeMovers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storeMover');
    console.log('storeMovers :' + storeMovers.length);

     var traders = _.filter(Game.creeps, (creep) => creep.memory.role == 'trader');
    console.log('trader -> BLD :' + traders.length);
    
   var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');
    console.log('healer  :' + healers.length);

    var powerHarvs = _.filter(Game.creeps, (creep) => creep.memory.role == 'powerHarv');
    console.log('powerHarvs: ' + powerHarvs.length);
   // var oldBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == 'oldBuilder');
   // console.log('oldBuilders : ' + oldBuilders.length);
    //var attackers =_.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    //console.log('attacker: '+ attackers.length);
    var exeHarvesters =_.filter(Game.creeps, (creep) => creep.memory.role == 'exeHarvester');
   // console.log('exeHarvesters: '+ exeHarvesters.length);
    var exeHarvesters2 =_.filter(Game.creeps, (creep) => creep.memory.role == 'exeHarvester2');
   // console.log('exeHarvesters2: '+ exeHarvesters2.length)
    var repairers =_.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    console.log('repairers : ' + repairers.length);
    var balancers =_.filter(Game.creeps, (creep) => creep.memory.role == 'balancer');
    console.log('balancers : ' + balancers.length);
    var exeHarvesters1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'exeHarvester1');
    //console.log('exeHarvesters1 : ' + exeHarvesters1.length);
    
    var mineralHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role=='mineralHarvester');
    console.log('mineralHarvesters : ' + mineralHarvesters.length);
     var otherRoommineralHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role=='otherRoomMineralHarvester');
    console.log('otherRoommineralHarvesters : ' + otherRoommineralHarvesters.length);
    
    var foreignHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role=='foreignHarvester');
    console.log('foreignHarvesters : ' + foreignHarvesters.length);
    
    ///#################################### other rooms ########################
    console.log('############ other room units: ');
     var contHarv2s =_.filter(Game.creeps, (creep) => creep.memory.role == 'contHarv2');
    console.log('contHarv2 : ' + contHarv2s.length);
    var pioniers = _.filter(Game.creeps, (creep) => creep.memory.role=='pionier');
    console.log('pioniers : ' + pioniers.length);
     var pioniersSmall = _.filter(Game.creeps, (creep) => creep.memory.role=='pionierSmall');
    console.log('pioniersSmall : ' + pioniersSmall.length);
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role=='claimer');
    console.log('claimers : ' + claimers.length);
     var otherRoomUpgraders = _.filter(Game.creeps, (creep) => creep.memory.role=='otherRoomUpgrader');
    console.log('otherRoomUpgraders : ' + otherRoomUpgraders.length);
    var otherRoomBuilders = _.filter(Game.creeps, (creep) => creep.memory.role=='otherRoomBuilder');
    console.log('otherRoomBuilders : ' + otherRoomBuilders.length);
    var otherRoomTransporters = _.filter(Game.creeps, (creep) => creep.memory.role=='otherRoomTransporter');
    console.log('otherRoomTransporters : ' + otherRoomTransporters.length);
    var crossRoomTransporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'crossRoomTransporter');
    console.log('crossRoomTransporters : ' + crossRoomTransporters.length);

    var otherRoomBalancers = _.filter(Game.creeps, (creep) => creep.memory.role == 'otherRoomBalancer');
    console.log('otherOtherBalancers : ' + otherRoomBalancers.length);
    var otherRoomCollectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'otherRoomCollector');
    console.log('otherRoom Collectors : ' + otherRoomCollectors.length);
    var dismantlers = _.filter(Game.creeps, (creep) => creep.memory.role == 'dismantler');
    console.log('dismantlers :' + dismantlers.length);
     var otherRoomStorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'otherRoomStorer');
    console.log('otherRoomStorers for minerals :' + otherRoomStorers.length);
    
    var transporterPluss = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporterPlus');
    console.log('transporterPlus :' + transporterPluss.length);

    //##################################### ROLES ############################
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvesterSouth':
                roleHarvesterSouth.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'foreignHarvester':
                roleForeignHarvester.run(creep, r3_exe_south_flag, r3_storage);
                break;
            //----------------------------------------------------------------------------------------
            case 'harvester':
                roleHarvester.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'upgrader':
                if(enemysFound.length > 2) {  // this is for war: make roleswitch upgrader into repairer
                    //roleRepairer.run(creep);
                    //roleRepairer.run(creep);
                    roleUpgrader.run(creep);
                    break;
                } else {
                    roleUpgrader.run(creep);
                    break;
                }
                break;
            //----------------------------------------------------------------------------------------
            case 'builder':
                roleBuilder.run(creep,storageID, contIDs, dismantleTargetIDs);
                //oleDismantler.run(creep, dismantleTargetIDs);
                break;
            case 'collector':
                roleCollector.run(creep,contIDs, contStorIDs, towIDs);
                break;
            //----------------------------------------------------------------------------------------
            case 'balancer':
                roleBalancer.run(creep, contIDs, contStorIDs, towIDs);
                break;
            //----------------------------------------------------------------------------------------
             case 'healer':
                roleHealer.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'flagConHarvester':
                roleFlagConHarvester.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'transporter':
                roleTransporter.run(creep, contIDs, contStorIDs, towIDs, storageID);
                break;
            //----------------------------------------------------------------------------------------
            case 'repairer':
                  roleRepairer.run(creep,contIDs, ulessWallIDs,closestDmgArr1Pre);
                //roleBuilder.run(creep,storageID, contIDs);
                break;
            //----------------------------------------------------------------------------------------
            case 'contHarv1':
                roleContHarv1.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'contHarv2':
                roleContHarv2.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'exeHarvester1':
                roleExeHarvester1.run(creep);
               rolePionier.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'melee':
                roleMelee.run(creep, dismantleTargetIDs);
                //roleUpgrader.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case 'dismantler':
                roleDismantler.run(creep, dismantleTargetIDs);
                break;
            //----------------------------------------------------------------------------------------
            case 'powerHarv':
                rolePowerHarv.run(creep);
                break;
            case 'pionier':
                rolePionier.run(creep);
                //roleBuilder.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            case'claimer':
                roleClaimer.run(creep, r3_exe_south_ctrl_flag );
                break;
            //----------------------------------------------------------------------------------------
            case'otherRoomUpgrader':
                roleOtherRoomUpgrader.run(creep,toNextRoom,toSpawnRoom, storageID);
                break;
            //----------------------------------------------------------------------------------------
            case 'otherRoomTransporter':
                roleOtherRoomTransporter.run(creep, otherContainerIDs, otherContainerStorIDs, otherTowerIDs);
                break;
            //----------------------------------------------------------------------------------------
            case 'otherRoomBuilder':
                roleOtherRoomBuilder.run(creep, otherContainerIDs, otherContainerStorIDs, otherTowerIDs);
                break;
            //----------------------------------------------------------------------------------------
            case 'otherRoomBalancer':
                roleOtherRoomBalancer.run(creep, otherContainerIDs, otherContainerStorIDs, otherTowerIDs); //TODO: link ID
                break;
            //----------------------------------------------------------------------------------------
            case 'crossRoomTransporter':
                roleCrossRoomTransporter.run(creep); //TODO: initialize with the containers, etc..
                break;
            //----------------------------------------------------------------------------------------
            case 'otherRoomCollector':
                roleOtherRoomCollector.run(creep, otherContainerIDs, otherContainerStorIDs, otherTowerIDs);
                break;
            //----------------------------------------------------------------------------------------
             case 'otherRoomStorer':
                roleOtherRoomStorer.run(creep, otherContainerIDs, otherContainerStorIDs, otherTowerIDs);
                break;
            //----------------------------------------------------------------------------------------
            case 'mineralHarvester':
                //roleMineralHarvester.run(creep, sourceID, containerIDs, linkID, minerID);
                roleMineralHarvester.run(creep,'5787acb9028588912acf2f6f', contIDs, '577f2b75f5dd02623e306006','576a9d5a7f58551641fcb74c' );
                break;
            //----------------------------------------------------------------------------------------
            case 'otherRoomMineralHarvester':
                //roleMineralHarvester.run(creep, sourceID, containerIDs, linkID, minerID);
                roleOtherRoomMineralHarvester.run(creep,'5790351ad777de0d7fe8e6d9', otherContainerIDs,'57886bfa2e7e32dd33dd5a19', '576a9d5a7f58551641fcb74d' );
                break;
            //----------------------------------------------------------------------------------------
             case 'storer':
                //roleMineralHarvester.run(creep, sourceID, containerIDs, linkID, minerID);
                roleStorer.run(creep,mineralContainerIDs, contStorIDs, towIDs, labIDs_LO, upgrLinkID, terminalID);
                break;
            //----------------------------------------------------------------------------------------
             case 'storeMover':
                //roleMineralHarvester.run(creep, sourceID, containerIDs, linkID, minerID);
                //creep, storageID, terminalID, linkID
                roleStoreMover.run(creep, storageID, terminalID, linkIDs[1]);
                break;
            //----------------------------------------------------------------------------------------
            case 'pionierSmall':
                rolePionier.run(creep);
                //roleBuilder.run(creep);
                break;
            //----------------------------------------------------------------------------------------
             case 'ranged':
                roleRanged.run(creep);
                break;
            //----------------------------------------------------------------------------------------
             case 'trader':
                roleTrader.run(creep);
                break;
            //----------------------------------------------------------------------------------------
             case 'transporterPlus':
                roleTransporterPlus.run(creep);
                break;
            //----------------------------------------------------------------------------------------
            default:
            
        }   
    }
    
   var extensions = Game.spawns.ImNoobPlzDontKill.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    });
    
    var extensionsSecond = Game.spawns.StPetersburg.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    });
    
    //###################### RESPAWN ###################### TIER 3 ... >  450 ENERGY ################
    if(extensions.length >= 4) {
          if(contHarv1s.length < 1) {
             Game.spawns.ImNoobPlzDontKill.createCreep([WORK, WORK, WORK,WORK, WORK, CARRY, MOVE], undefined, {role:'contHarv1'});
            console.log('Spawning a new contHarv1 [TIER 3] ');
        }
        else if(harvesters.length < 0) {
             Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE, CARRY], undefined, {role: 'harvester'});
            console.log('Spawning new harvester [TIER 3]');
        }
        else if(flagHarvesters.length < 1) {
            Game.spawns.ImNoobPlzDontKill.createCreep([WORK, WORK, WORK, WORK, WORK,MOVE,CARRY], undefined, {role:'flagConHarvester'});
            console.log('Spawning a new flagConHarvester [TIER 3] ');
        }
        else  if(harvestersSouth.length < 0) {
            Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE, CARRY], undefined, {role: 'harvesterSouth'});
            console.log('Spawning new harvesterSouth [TIER 3]');
        }
         else if(collectors.length < collectorsCount) {
             Game.spawns.ImNoobPlzDontKill.createCreep([CARRY, MOVE, CARRY, MOVE, CARRY,CARRY], undefined, {role:'collector'});
            console.log('Spawning a new collector [TIER 3] ');
           
        }
        else if(transporters.length < 2) {
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, CARRY, CARRY, CARRY, CARRY, MOVE], undefined, {role:'transporter'});
            console.log('Spawning a new transporter [TIER 3] ');
        }
         else if(repairers.length < repairersCount) {
             Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,MOVE,CARRY,CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, WORK, MOVE], undefined, {role:'repairer'});
            console.log('Spawning a new repairer [TIER 3] ');
        }   
          else if(balancers.length < 0) {
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, CARRY, CARRY], undefined, {role:'balancer'});
            console.log('Spawning a new balancer [TIER 3] ');
        }
        
        else if(builders.length < builderCount) {
            Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {role:'builder'});
            console.log('Spawning a new builder [TIER 3]');
        }
         else if(upgraders.length < upgraderCount) {
            Game.spawns.ImNoobPlzDontKill.createCreep([/*WORK,WORK,WORK,WORK, WORK, WORK,WORK,WORK,WORK, WORK,*/WORK,WORK,WORK,WORK, WORK, WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,MOVE, MOVE,MOVE,MOVE], undefined, {role:'upgrader'});
            console.log('Spawning a new upgrader [TIER 3] ');
        }
         else if(dismantlers.length < 0) {
            Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK,WORK,WORK, WORK,WORK,WORK,WORK, MOVE, CARRY,CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE,MOVE, MOVE, MOVE, MOVE], undefined, {role:'dismantler'});
            console.log('Spawning a new dismantler  ');
        }
         else if(crossRoomTransporters.length < 0) {
            Game.spawns.ImNoobPlzDontKill.createCreep([CARRY, MOVE], undefined, {role:'crossRoomTransporter'});
            console.log('Spawning a new cross-Room-Transporter  ');
        }
        else if(mineralHarvesters.length < 0) {
            Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,WORK,MOVE], undefined, {role:'mineralHarvester'});
            console.log('Spawning a new cross-Room-Transporter  ');
        }
        else if(storers.length < 1) {
            Game.spawns.ImNoobPlzDontKill.createCreep([CARRY,MOVE], undefined, {role:'storer'});
            console.log('Spawning a new storer  ');
        }
       else if(pioniers.length < 0) {
                Game.spawns.ImNoobPlzDontKill.createCreep([WORK,WORK, WORK,CARRY, CARRY, CARRY,MOVE, MOVE, CARRY,CARRY, MOVE, MOVE, MOVE], undefined, {role:'pionier'});
                console.log('Spawning a new pionier for BLD  ');
            }
        else if(storeMovers.length < 1) {
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, MOVE, CARRY,CARRY, CARRY, CARRY], undefined, {role:'storeMover'});
            console.log('Spawning a new stroeMover ');
        }
        else if(traders.length < 5) {
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, CARRY,CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY], undefined, {role:'trader'});
            console.log('a trader is spawned ');
        }
        
        // military! 
        else if(rangeds.length < 0 && enemysFound3 > 0) {
             console.log('enemies in room 3, yo');
            //Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, RANGED_ATTACK,TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, TOUGH, MOVE,TOUGH,RANGED_ATTACK, MOVE], undefined, {role:'ranged'});
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE], undefined, {role:'ranged'});

            console.log('A ranged attacking creep ! ');
        }
        else if(claimers.length < 0) {
            Game.spawns.ImNoobPlzDontKill.createCreep([CLAIM,MOVE], undefined, {role:'claimer'});
            console.log('Spawning a new claimer ');
        }
         else if(rangeds.length < 0) {
             console.log('enemies in room 3, yo');
            //Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, RANGED_ATTACK,TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, TOUGH, MOVE,TOUGH,RANGED_ATTACK, MOVE], undefined, {role:'ranged'});
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, TOUGH, TOUGH, MOVE, TOUGH, MOVE], undefined, {role:'ranged'});
            Game.spawns.StPetersburg.createCreep([MOVE, TOUGH, TOUGH, MOVE, TOUGH, MOVE], undefined, {role:'ranged'});
            console.log('A ranged attacking creep ! ');
        }
        
        //power
        if(true) {
              if(powerHarvs.length < 5) {
                Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, ATTACK, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, ATTACK, MOVE, ATTACK, ATTACK, ATTACK, ATTACK,ATTACK, ATTACK, MOVE, ATTACK, MOVE, ATTACK], undefined, {role:'powerHarv'});
                Game.spawns.StPetersburg.createCreep([MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, ATTACK, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, ATTACK, MOVE, ATTACK, ATTACK, ATTACK, ATTACK,ATTACK, ATTACK, MOVE, ATTACK, MOVE, ATTACK], undefined, {role:'powerHarv'});

                console.log('Spawning a new powerharvester ');
            }
             else if(healers.length < 6) {
                Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, HEAL, HEAL, HEAL, MOVE, HEAL, HEAL], undefined, {role:'healer'});
                            //Game.spawns.StPetersburg.createCreep([MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, ATTACK, ATTACK, ATTACK,ATTACK, ATTACK, MOVE], undefined, {role:'powerHarv'});
                Game.spawns.StPetersburg.createCreep([MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, HEAL, HEAL, HEAL, MOVE, HEAL, HEAL, ], undefined, {role:'healer'});
    
                console.log('Spawning a new healer ');
            }
        }
    }
    
    //############################# respawn second room
 
    if(extensionsSecond.length >= 10) {
        if(exeHarvesters1.length < exeHarvesterCount) {
            Game.spawns.StPetersburg.createCreep([WORK,WORK, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, CARRY, MOVE, MOVE], undefined, {role:'exeHarvester1'});
            console.log('Spawning a new exeHarvester [TIER 3] ');
        }
         else if(otherRoomTransporters.length < 1) {
            Game.spawns.StPetersburg.createCreep([MOVE,CARRY,CARRY], undefined, {role:'otherRoomTransporter'});
            console.log('Spawning a new otherRoomTransporter ');
        }
          else if(contHarv2s.length < 1) { 
            Game.spawns.StPetersburg.createCreep([WORK, WORK, WORK,WORK, WORK, CARRY, MOVE], undefined, {role:'contHarv2'});
            console.log('Spawning a new contHarv2 [TIER 3] ');
        }
         else if(pioniers.length < 1) {
            Game.spawns.StPetersburg.createCreep([WORK,WORK,WORK, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE], undefined, {role:'pionier'});
            console.log('Spawning a new pionier [TIER 3] ');
        }
         else if(claimers.length < 0) {
            Game.spawns.StPetersburg.createCreep([MOVE], undefined, {role:'claimer'});
            console.log('Spawning a new claimer ');
        }
         else if(otherRoomUpgraders.length < otherRoomUpgraderCount) {
            Game.spawns.StPetersburg.createCreep([MOVE, WORK, WORK,WORK, CARRY], undefined, {role:'otherRoomUpgrader'});
            console.log('Spawning a new otherRoomHarvester ');
        }
      
         else if(otherRoomBuilders.length < otherRoomBuilderCount) {
            Game.spawns.StPetersburg.createCreep([MOVE,MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY], undefined, {role:'otherRoomBuilder'});
            console.log('Spawning a new otherRoomBuilder ');
        }
         else if(otherRoomBalancers.length < otherRoomBalancerCount) {
            Game.spawns.StPetersburg.createCreep([MOVE,CARRY, CARRY, MOVE, CARRY, CARRY], undefined, {role:'otherRoomBalancer'});
            console.log('Spawning a new otherRoomBalancer ');
        }
         else if(otherRoomCollectors.length < 1) {
            Game.spawns.StPetersburg.createCreep([MOVE, CARRY, CARRY], undefined, {role:'otherRoomCollector'});
            console.log('Spawning a new other room Collector ');
        }
          else if(otherRoomStorers.length < 0) {
            Game.spawns.StPetersburg.createCreep([MOVE, CARRY, CARRY], undefined, {role:'otherRoomStorer'});
            console.log('Spawning a new other room otherRoomStorer ');
        }
         else if(otherRoommineralHarvesters.length < 0) {
            Game.spawns.StPetersburg.createCreep([MOVE, CARRY, WORK], undefined, {role:'otherRoomMineralHarvester'});
            console.log('Spawning a new other room mineral Harvester  ');
        }
    
   
    } 
    
    // 3rd room (get a fucking room manager and a respawn manager, ffs)
     if(harvestersSouth.length < 4) {
        Game.spawns.Leningrad.createCreep([MOVE,MOVE, MOVE,CARRY, CARRY, CARRY,WORK, WORK,WORK,WORK,CARRY, MOVE], undefined, {role:'harvesterSouth'});
            console.log('Room3 makes a new harvester...');
    }
    else if(harvesters.length < 2) { // is a upgrader.........
        Game.spawns.Leningrad.createCreep([MOVE, MOVE,CARRY, WORK,CARRY,CARRY, CARRY, WORK, WORK,WORK,WORK, WORK,CARRY, MOVE, CARRY,MOVE], undefined, {role:'harvester'});
            console.log('Room3 makes a new upgrader...');
    }
    else if(traders.length < 0) {
            Game.spawns.Leningrad.createCreep([MOVE, CARRY, CARRY, MOVE, MOVE, CARRY,CARRY, MOVE, CARRY, CARRY, MOVE, MOVE], undefined, {role:'trader'});
            console.log('a trader is spawned ');
    }
    else if (foreignHarvesters.length < 3) {
        Game.spawns.Leningrad.createCreep([WORK,WORK, WORK, CARRY, CARRY,CARRY,CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role:'foreignHarvester'});
    }
     else if(claimers.length < 1) {
        Game.spawns.Leningrad.createCreep([MOVE, CLAIM], undefined, {role:'claimer'});
        console.log('Spawning a new claimer ');
    }
     else if(pioniers.length < 1) {
        Game.spawns.Leningrad.createCreep([MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK], undefined, {role:'pionier'});
        console.log('Spawning a new pionier ');
    }
    else if(transporterPluss.length <2) {
        Game.spawns.Leningrad.createCreep([MOVE, MOVE,MOVE, CARRY,CARRY, CARRY, CARRY, CARRY, CARRY], undefined, {role:'transporterPlus'});
        console.log('Spawning a new transporterPlus ');
    }
    
    //// WAR SPAWNS
      if(false) {
        if(transporters.length <2) {
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE, CARRY, CARRY, CARRY, CARRY, MOVE], undefined, {role:'transporter'});
        }
        if(melees.length < 10) {
            Game.spawns.ImNoobPlzDontKill.createCreep([MOVE,MOVE, MOVE,MOVE,MOVE,WORK, WORK,WORK,WORK,WORK,WORK,TOUGH, TOUGH,WORK, WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE, MOVE,MOVE,MOVE, MOVE, MOVE,MOVE,MOVE,MOVE], undefined, {role:'melee'});
            Game.spawns.StPetersburg.createCreep([MOVE,MOVE, MOVE,MOVE,MOVE,WORK, WORK,WORK,WORK,WORK, WORK,TOUGH,TOUGH, WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE, MOVE,MOVE,MOVE, MOVE, MOVE,MOVE,MOVE,MOVE], undefined, {role:'melee'});
        }
    }
   
          
      //}); // END CPU PROFILER
    
    
    
        //stream-walking(Gaensemarsch!)
        //roleStream.runAll();
    
    
}
/*
isFriendlyCreep: function(creep)
  {
    if(creep.owner.username == 'bldinator')
    return true;
    return false;
  }, */