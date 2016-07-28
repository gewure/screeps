function isCreepA(creep, type) {
    return type === (creep.memory.role === undefined ? creep.name.split('-')[0] : creep.memory.role);
}

function calculateArea(x, y, distance = 4) {
    var avoidPosArray = [];

    for (var n = -1 * distance; n < distance; n++) {
        for (var i = -1 * distance; i < distance; i++) {
            avoidPosArray.push({
                x: x + n,
                y: y + i
            });
        }
    }


    return avoidPosArray;
}

function getMemory(item) {

}

module.exports = {
    isCreepA: isCreepA,
    calculateArea: calculateArea
};