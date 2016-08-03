var idlePosX = 43;
var idlePosY = 34;
var communistManifest = 'A spectre is haunting Europe — the spectre of communism. All the powers of old Europe have entered into a holy alliance to exorcise this spectre: Pope and Tsar, Metternich and Guizot, French Radicals and German police-spies. Where is the party in opposition that has not been decried as communistic by its opponents in power? Where is the opposition that has not hurled back the branding reproach of communism, against the more advanced opposition parties, as well as against its reactionary adversaries? Two things result from this fact: I. Communism is already acknowledged by all European powers to be itself a power. II. It is high time that Communists should openly, in the face of the whole world, publish their views, their aims, their tendencies, and meet this nursery tale of the Spectre of Communism with a manifesto of the party itself. To this end, Communists of various nationalities have assembled in London and sketched the following manifesto, to be published in the English, French, German, Italian, Flemish and Danish languages. The history of all hitherto existing society(2) is the history of class struggles. Freeman and slave, patrician and plebeian, lord and serf, guild-master(3)and journeyman, in a word, oppressor and oppressed, stood in constant opposition to one another, carried on an uninterrupted, now hidden, now open fight, a fight that each time ended, either in a revolutionary reconstitution of society at large, or in the common ruin of the contending classes. In the earlier epochs of history, we find almost everywhere a complicated arrangement of society into various orders, a manifold gradation of social rank. In ancient Rome we have patricians, knights, plebeians, slaves; in the Middle Ages, feudal lords, vassals, guild-masters, journeymen, apprentices, serfs; in almost all of these classes, again, subordinate gradations. The modern bourgeois society that has sprouted from the ruins of feudal society has not done away with class antagonisms. It has but established new classes, new conditions of oppression, new forms of struggle in place of the old ones. Our epoch, the epoch of the bourgeoisie, possesses, however, this distinct feature: it has simplified class antagonisms. Society as a whole is more and more splitting up into two great hostile camps, into two great classes directly facing each other — Bourgeoisie and Proletariat. From the serfs of the Middle Ages sprang the chartered burghers of the earliest towns. From these burgesses the first elements of the bourgeoisie were developed. The discovery of America, the rounding of the Cape, opened up fresh ground for the rising bourgeoisie. The East-Indian and Chinese markets, the colonisation of America, trade with the colonies, the increase in the means of exchange and in commodities generally, gave to commerce, to navigation, to industry, an impulse never before known, and thereby, to the revolutionary element in the tottering feudal society, a rapid development. The feudal system of industry, in which industrial production was monopolised by closed guilds, now no longer sufficed for the growing wants of the new markets. The manufacturing system took its place. The guild-masters were pushed on one side by the manufacturing middle class; division of labour between the different corporate guilds vanished in the face of division of labour in each single workshop. Meantime the markets kept ever growing, the demand ever rising. Even manufacturer no longer sufficed. Thereupon, steam and machinery revolutionised industrial production. The place of manufacture was taken by the giant, Modern Industry; the place of the industrial middle class by industrial millionaires, the leaders of the whole industrial armies, the modern bourgeois. Modern industry has established the world market, for which the discovery of America paved the way. This market has given an immense development to commerce, to navigation, to communication by land. This development has, in its turn, reacted on the extension of industry; and in proportion as industry, commerce, navigation, railways extended, in the same proportion the bourgeoisie developed, increased its capital, and pushed into the background every class handed down from the Middle Ages. We see, therefore, how the modern bourgeoisie is itself the product of a long course of development, of a series of revolutions in the modes of production and of exchange. Each step in the development of the bourgeoisie was accompanied by a corresponding political advance of that class. An oppressed class under the sway of the feudal nobility, an armed and self-governing association in the medieval commune(4): here independent urban republic (as in Italy and Germany); there taxable “third estate” of the monarchy (as in France); afterwards, in the period of manufacturing proper, serving either the semi-feudal or the absolute monarchy as a counterpoise against the nobility, and, in fact, cornerstone of the great monarchies in general, the bourgeoisie has at last, since the establishment of Modern Industry and of the world market, conquered for itself, in the modern representative State, exclusive political sway. The executive of the modern state is but a committee for managing the common affairs of the whole bourgeoisie. The bourgeoisie, historically, has played a most revolutionary part.'.split(' ');

var roleClaimer = {

  
    run: function(creep, claimTargetFlag) {
        if(creep.ticksToLive == 1499) {
            creep.memory.text = 0;
        }
        if(creep.memory.text == communistManifest.length) {
            creep.memory.text = 0;
        }
        
         if(creep.ticktoLive == 50) {
            Game.spawns.Leningrad.createCreep([MOVE, CLAIM], undefined, {role:'claimer'});
         }
        
        if(creep.room == Game.spawns.ImNoobPlzDontKill.room) {

            if(!creep.pos.isNearTo(Game.flags[claimTargetFlag])) {
                creep.moveTo(Game.flags[claimTargetFlag]);
            }
        } else {
             if(!creep.pos.isNearTo(Game.flags[claimTargetFlag])) {
                creep.moveTo(Game.flags[claimTargetFlag]);
            } else {
                creep.say(communistManifest[creep.memory.text],true);
                creep.memory.text++;
                //creep.say('claim!');
                //var contr = creep.room.find(STRUCTURE_CONTROLLER);
                var contr = Game.getObjectById('55db34b5efa8e3fe66e06068');
               if(creep.reserveController(contr) == ERR_NOT_IN_RANGE) {
                 
                   creep.moveTo(contr);
               }
            }
            
            
            /*
            var toBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(creep.build(toBuild) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toBuild); */
        
        }
    }
};

module.exports = roleClaimer;