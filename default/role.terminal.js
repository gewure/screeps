
sourceLink = '5785398b91941a441c38dd7e';//
targetLink = '577f46b09173f69d1ec045bc';
var minEnergy = 150000;

var roleTerminal = {
run: function(sourceLink, targetLink) {
        var source = Game.getObjectById(sourceLink);
        var target = Game.getObjectById(targetLink);
       
        if(Game.rooms.E31N2.terminal.storeCapacity - Game.rooms.E31N2.terminal.store[RESOURCE_ENERGY] >= minEnergy)
            var retVal = Game.rooms.E31N1.terminal.send(RESOURCE_ENERGY, 1000, 'E31N2', 'TEST');
            //console.log('TERMINAL retVal: '+retVal);
    }
};

module.exports = roleTerminal;
