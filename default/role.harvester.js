var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES);
            var spawns = _.filter(targets, (t) => ((t.structureType == STRUCTURE_SPAWN || t.structureType == STRUCTURE_EXTENSION) && t.energy < t.energyCapacity));
            var remainingTargets = _.filter(targets, (t) => (t.structureType == STRUCTURE_CONTAINER && t.store[RESOURCE_ENERGY] < t.storeCapacity));
            //How many transporters are available?
            var transporters = _.filter(Game.creeps, (tr) => tr.memory.role == 'transporter');

            //var targets = creep.room.find(FIND_STRUCTURES, {
            //    filter: (structure) => {
            //        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
            //            structure.energy < structure.energyCapacity;
            //    }
            //});

            //If there aren't any transporters, take energy to source and extensions ourselves
            if (spawns.length > 0 && transporters.length == 0) {
                if (creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0]);
                }
            } else if (remainingTargets.length > 0) {
                if (creep.transfer(remainingTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(remainingTargets[0]);
                }
            }
        }

        var closestSource = creep.pos.findClosestByRange(FIND_SOURCES);

    }
};

module.exports = roleHarvester;