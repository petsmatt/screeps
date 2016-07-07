var roleTransporter = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.transporting && creep.carry.energy == 0) {
            creep.memory.transporting = false;
        }
        if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transporting = true;
        }

        if (creep.memory.transporting) {
            //We're full, time to go fill something!
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity)
            });
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            //Need to see if any things need energy
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity)
            });
            if (targets.length) {
                //Something needs us to fill it!
                //if we're not full of energy
                var ourCapacity = creep.carryCapacity
                if (creep.carry.energy < ourCapacity) {
                    //Go get energy from a container

                    var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                                       i.store[RESOURCE_ENERGY] >= ourCapacity
                    });
                    if (containersWithEnergy.length) {
                        //let's go get that energy!
                        if (containersWithEnergy[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containersWithEnergy[0]);
                        }
                    }
                } 
            }
        }
    }
};

module.exports = roleTransporter;