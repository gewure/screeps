var minEnergy = 50;
var logicLinkUpgrader = {
    run: function(sourceLink, targetLink) {
        var source = Game.getObjectById(sourceLink);
        var target = Game.getObjectById(targetLink);
       
        if(target.energyCapacity - target.energy >= minEnergy)
            var x = source.transferEnergy(target);
    }
};

module.exports = logicLinkUpgrader;