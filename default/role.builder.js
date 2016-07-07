var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            //Build any containers first
            var containerSites = _.filter(targets, (t) => t.structureType == STRUCTURE_CONTAINER);
            if (containerSites.length) {
                if (creep.build(containerSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerSites[0]);
                }
            } else if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                targets = creep.room.find(FIND_FLAGS);
                if (targets.length) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else {
            //Get energy from containers if we're fully empty (stop bouncing between harvesting and container filling)
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
                    creep.moveTo(sources[1]);
                }
            }
        }
    }
};

module.exports = roleBuilder;