/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('role.harvester');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        //Check for temporary roles
        if (creep.memory.harvestTicks > 0) {
            creep.memory.harvestTicks--;
            roleHarvester.run(creep);
            return;
        } else {
            if (creep.memory.harvestTicks == 0) {
                console.log("Creep " + creep.name + " repairer : no longer being a harvester");
                creep.memory.harvestTicks = undefined;
            }
        }

        if (creep.memory.repairing == undefined) {
            creep.memory.repairing = false;
        }

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            //Get non-wall targets
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL)
            });
            var wallsCritical = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.hits < 10000 && structure.structureType == STRUCTURE_WALL)
            });

            if (targets.length) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else if (wallsCritical.length) {
                //repair critical walls
                if (creep.repair(wallsCritical[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wallsCritical[0]);
                }
            } else if (this.RepairWalls(creep, 50000)) {
                //repair walls 50000
            } else {
                //Nothing to do
                //Do some building instead
                var buildSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (buildSites.length) {
                    if (creep.build(buildSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(buildSites[0]);
                    }
                } else {
                    //Be a harvester for a tick
                    console.log("Repairer being a harvester.")
                    creep.memory.harvestTicks = 100;

                    //Fuck all to do - go to the flag
                    //targets = creep.room.find(FIND_FLAGS);
                    //if (targets.length) {
                    //    creep.moveTo(targets[0]);
                    //}
                }
            }
        } else {
            //Get energy from containers if we're fully empty (stop boucning)
            var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                               i.store[RESOURCE_ENERGY] > 250
            });
            if (containersWithEnergy.length && creep.carry.energy == 0) {
                if (containersWithEnergy[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containersWithEnergy[0]);
                }
            } else {
                //Harvest
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    var moveRC = creep.moveTo(sources[1]);
                    if (moveRC == ERR_NO_PATH) {
                        //Can't get where we want to go at the moment.
                        console.log("Creep " + creep.name + " move returns : " + moveRC + " I'm going to be a harvester instead");
                        //Minimum ticks that I'll be harvesting is 100
                        creep.memory.harvestTicks = 100
                    }

                }
            }
        }
    }
    ,
    RepairWalls: function (creep, repairUpToHitpoints) {
        var walls = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.hits < repairUpToHitpoints && structure.structureType == STRUCTURE_WALL)
        });
        if (walls.length) {
            //repair critical walls
            if (creep.repair(walls[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(walls[0]);
            }
            return true;
        } else {
            return false;
        }
    }
};

module.exports = roleRepairer;