
//sourceLink = '5785398b91941a441c38dd7e';//
//targetLink = '577f46b09173f69d1ec045bc';
var minEnergy = 150000;

var roleTerminal = {
run: function(/*sourceLink, targetLink*/) {
       // var source = Game.getObjectById(sourceLink);
        //var target = Game.getObjectById(targetLink);
       
        /*if(Game.rooms.E31N1.terminal.store[RESOURCE_ENERGY] > 1200) {
            Game.rooms.E31N1.terminal.send(RESOURCE_ENERGY, 1000, 'E31N2', 'supply');
        } */
            //console.log('TERMINAL retVal: '+retVal);
        if(Game.rooms.E31N2.terminal.store[RESOURCE_LEMERGIUM] > 10000 ) {
            Game.rooms.E31N2.terminal.send(RESOURCE_LEMERGIUM, 1000, 'E31N4', 'Lemergium, 1000');
        }  
        if(Game.rooms.E31N1.terminal.store[RESOURCE_UTRIUM] >= 30000) {
            Game.rooms.E31N1.terminal.send(RESOURCE_UTRIUM, 1000, 'E31N2', 'TEST');    
        }
         if(Game.rooms.E31N1.terminal.store[RESOURCE_ENERGY] > 1200) {
            Game.rooms.E31N1.terminal.send(RESOURCE_ENERGY, 1000, 'E31N2', 'energy++');    
        }
    }
};

module.exports = roleTerminal;
