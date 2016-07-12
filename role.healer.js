


var logicSquareHealerBlock = {
    run: function(creepArray, roomFlags, targetRoom) {
        
        //add/remove creeps to intern array of creeps (to hold formation)
        checkCreeps(creepArray);
        
        
        
        
    }
};














function checkCreeps(creepArray) {
    if(Memory.squareHealerBlockCreeps == undefined) Memory.squareHealerBlockCreeps = new Array(9);
   
    for(var i = 0; i < Memory.squareHealerBlockCreeps.length; ++i) {
        if(Memory.squareHealerBlockCreeps[i] != undefined && !arrayContains(creepArray, Memory.squareHealerBlockCreeps[i])) {
            removeCreep(Memory.squareHealerBlockCreeps[i]);
        }
    }
   
    for(var i = 0; i < creepArray.length; ++i) {
        if(!arrayContains(Memory.squareHealerBlockCreeps, creepArray[i])) {
            addNewCreep(creepArray[i]);
        }
    }
}

function removeCreep(creep) {
    for(var i = 0; i < Memory.squareHealerBlockCreeps.length; ++i) {
        if(Memory.squareHealerBlockCreeps[i] == creep) {
            Memory.squareHealerBlockCreeps[i] = undefined;
            break;
        }
    }
}

function addNewCreep(creep) {
    for(var i = 0; i < Memory.squareHealerBlockCreeps.length; ++i) {
        if(Memory.squareHealerBlockCreeps[i] == undefined) {
            Memory.squareHealerBlockCreeps[i] = creep;
            break;
        }
    }
}

function arrayContains(array, toSearch) {
    if(array != undefined) {
        for(var i = 0; i < array.length; ++i) {
            if(array[i] == toSearch) return true;
        }
    }
    return false;
}
module.exports = logicSquareHealerBlock;