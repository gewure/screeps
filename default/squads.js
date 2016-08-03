var utils = require('utils');
var roleCombatScout = require('role.combat.scout');
var roleCombatMarine = require('role.combat.marine');
var roleCombatRanger = require('role.combat.ranger');
var roleCombatMedic = require('role.combat.medic');
var roleCombatTrainer = require('role.combat.trainer');
var roleCombatDismantler = require('role.combat.dismantler');


var squads = {
  'attackscouter':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatMarine.name, body: [MOVE,MOVE, ATTACK,MOVE,MOVE, ATTACK,MOVE,MOVE, ATTACK,MOVE,MOVE, ATTACK,MOVE,MOVE, ATTACK], nr: 1, additional:{room: room.name, name: name + '_S', squad:name, isLeader: true}},
        {role: roleCombatRanger.name, body: [MOVE,MOVE, RANGED_ATTACK,MOVE,MOVE, RANGED_ATTACK], nr: 2, additional:{room: room.name, name: name + '_S2', squad:name}}
      ];
    },
  },
  'singleScout':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatMarine.name, body: [MOVE], nr: 1, additional:{room: room.name, name: name + '_SCOUT', squad:name, isLeader: true}},
      ];
    },
  },
  'massSuicide':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatMarine.name, body: [MOVE], nr: 25, additional:{room: room.name, name: name + '_SCOUT', squad:name, isLeader: true}},
      ];
    },
  },
  'trainers':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatTrainer.name, body: [MOVE, ATTACK], nr: 2, additional:{room: room.name, name: name + '_TRAINER', squad:name, isLeader: true}},
      ];
    },
  },
  'medics':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatMedic.name, body: [MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL], nr: 1, additional:{room: room.name, name: name + '_HL', squad:name, isLeader: true}},
        //  {role: roleCombatMedic.name, body: [MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL], nr: 1, additional:{room: room.name, name: name + '_H', squad:name}}
      ];
    },
  },
  'dismantler_medics':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatMedic.name, body: [MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL], nr: 1, additional:{room: room.name, name: name + '_D', squad:name, isLeader: true}},
        {role: roleCombatMedic.name, body: [MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL,MOVE,MOVE,HEAL], nr: 8, additional:{room: room.name, name: name + '_H', squad:name}}
      ];
    },
  },
  'pawns':
  {
    getNeededCreeps: function(name, room)
    {
      return neededCreeps = [
        {role: roleCombatScout.name, body: [MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH], nr: 1, additional:{room: room.name, name: name + '_D', squad:name, isLeader: true}},
        {role: roleCombatScout.name, body: [MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH,MOVE,TOUGH], nr: 8, additional:{room: room.name, name: name + '_H', squad:name}}
      ];
    },
  }
};

module.exports = squads;