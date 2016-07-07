var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransporter = require('role.transporter');
var spawner = require('spawner');

module.exports.loop = function () {
    // Always place this memory cleaning code at the very top of your main loop!
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //Keep minimum number of creeps spawned
    spawner.spawn();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester' || creep.memory.role == 'bigHarvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader' || creep.memory.role == 'bigUpgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
    }
}