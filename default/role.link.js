
sourceLink = '577f2b75f5dd02623e306006';//
targetLink = '577f46b09173f69d1ec045bc';
var minEnergy = 200;
var minAmount = 400;

var roleLink = {
    run: function(sourceLink, targetLink) {
        var source = Game.getObjectById(sourceLink);
        var target = Game.getObjectById(targetLink);
        
       
        if(target.energyCapacity - target.energy >= minEnergy && target.energy < minAmount ) {
            var x = source.transferEnergy(target);
        }
        
    }
};

module.exports = roleLink;