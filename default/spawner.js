/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

var spawner = {
    spawn: function () {

        //Room energy before spawning
        var energyAvailable = Game.spawns.Spawn1.room.energyAvailable;
        //Container energy available
        var containersWithEnergy = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] > 0
        });
        var containerEnergyTotal = _.sum(containersWithEnergy.store);
        for (var i in containersWithEnergy) {
            var container = containersWithEnergy[i];
            containerEnergyTotal += container.store[RESOURCE_ENERGY];
        }

        //Do the spawning

        //Harvesters, most important! But stop spawning once we have container energy stores.
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var bigHarvesters = _.filter(Game.creeps, (b) => b.memory.role == 'bigHarvester');
        if (harvesters.length < 2 && bigHarvesters.length < 3 && (containerEnergyTotal < 1250 || energyAvailable < 300)) {
            var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
            console.log('Spawning new harvester: ' + newName);
        }

        //Upgraders V important
        var upgraders = _.filter(Game.creeps, (u) => u.memory.role == 'upgrader');
        var bigUpgraders = _.filter(Game.creeps, (u) => u.memory.role == 'bigUpgrader');

        if (energyAvailable > 600) {
            if (bigUpgraders.length < 4) {
                var newName = Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, { role: 'bigUpgrader' });
                console.log('Spawning new bigUpgrader: ' + newName);
            }
        } else {
            if ((bigUpgraders.length + upgraders.length) < 4) {
                var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'upgrader' });
                console.log('Spawning new upgrader: ' + newName);
            }
        }



        //only spawn builders if there are things to build
        var buildSites = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
        var builders = _.filter(Game.creeps, (b) => b.memory.role == 'builder');
        if (builders.length < 3 && buildSites.length) {
            var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'builder' });
            console.log('Spawning new builder: ' + newName);
        }

        //Repairers to maintain things that are built
        var repairers = _.filter(Game.creeps, (r) => r.memory.role == 'repairer');
        if (repairers.length < 2) {
            var newName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'repairer' });
            console.log('Spawning new repairer: ' + newName);
        }

        //transporters to keep stuff stocked with energy
        var transporters = _.filter(Game.creeps, (tr) => tr.memory.role == 'transporter');
        if (transporters.length < 1 && energyAvailable >= 400) {
            var newName = Game.spawns.Spawn1.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'transporter' });
            console.log('Spawning new transporter: ' + newName);
        }

        //Get out the big harvesters once the room has good amount of energy
        if (bigHarvesters.length < 3 && harvesters.length < 3 && energyAvailable >= 400) {
            var newName = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'bigHarvester' });
            console.log('Spawning new Big Harvester: ' + newName);
        }
    }
};

module.exports = spawner;