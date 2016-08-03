var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleScouter = require('role.scouter');
var roleTower = require('role.tower');
var roleContainerWorker = require('role.containerWorker');
var roleLink = require('role.link');
var roleSuicide = require('role.suicide');
var roleCombatMarine = require('role.combat.marine');
var roleCombatMedic = require('role.combat.medic');
var roleCombatRanger = require('role.combat.ranger');
var roleCombatTrainer = require('role.combat.trainer');
var roleCombatDismantler = require('role.combat.dismantler');
var roleCombatScout = require('role.combat.scout');


//var roleHarvesterSouth = require('role.harvesterSouth');
//var roleFlagConHarvester = require('role.flagConHarvester');
var roleRepairer = require('role.repairer');
/*var roleContHarv1 = require('role.contHarv1');
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
var roleOtherRoomStorer = require('role.otherRoomStorer');*/
var roleStoreMover = require('role.storeMover');
/*var roleRanged = require('role.ranged');
var roleTrader = require('role.trader');
var roleForeignHarvester = require('role.foreignHarvester');*/
var roleTransporterPlus = require('role.transporterPlus');
var roleTank = require('role.tank');
//var roleHealer = require('role.healer');
//roleRepairer, roleContHarv1, roleContHarv2, roleTransporter, roleCollector, roleMelee, roleBalancer, rolePionier, roleDismantler, rolePowerHarv, roleOtherRoomTransporter, roleStorer, roleStoreMover, roleTransporterPlus,
//roleStoreMover roleStoreMover, roleTransporterPlus,
var roleManager = {
  
  roles : [    roleHarvester, roleUpgrader, roleBuilder, roleContainerWorker, roleClaimer , roleScouter, roleTower, roleLink, roleSuicide, roleCombatMarine, roleCombatRanger, roleCombatMedic, roleCombatTrainer, roleCombatDismantler, roleCombatScout,roleRepairer,roleStoreMover, roleTransporterPlus,roleTank],
  
  getByName: function(name)
  {
    for(var i = 0; i < this.roles.length; i++)
    {
      if(this.roles[i].name == name)
      return this.roles[i];
    }
    
    console.log('roleManager(): Role for ' + name + ' not found.');
    return null;
  }
  
};

module.exports = roleManager;