var creepUtils = require('creepUtils');
var utils = require('utils');

//philosophy
var sisyphos = 'The gods had condemned Sisyphus to ceaselessly rolling a rock to the top of a mountain, whence the stone would fall back of its own weight. They had thought with some reason that there is no more dreadful punishment than futile and hopeless labor.If one believes Homer, Sisyphus was the wisest and most prudent of mortals. According to another tradition, however, he was disposed to practice the profession of highwayman. I see no contradiction in this. Opinions differ as to the reasons why he became the futile laborer of the underworld. To begin with, he is accused of a certain levity in regard to the gods. He stole their secrets. Egina, the daughter of Esopus, was carried off by Jupiter. The father was shocked by that disappearance and complained to Sisyphus. He, who knew of the abduction, offered to tell about it on condition that Esopus would give water to the citadel of Corinth. To the celestial thunderbolts he preferred the benediction of water. He was punished for this in the underworld. Homer tells us also that Sisyphus had put Death in chains. Pluto could not endure the sight of his deserted, silent empire. He dispatched the god of war, who liberated Death from the hands of her conqueror.It is said that Sisyphus, being near to death, rashly wanted to test his wifes love. He ordered her to cast his unburied body into the middle of the public square. Sisyphus woke up in the underworld. And there, annoyed by an obedience so contrary to human love, he obtained from Pluto permission to return to earth in order to chastise his wife. But when he had seen again the face of this world, enjoyed water and sun, warm stones and the sea, he no longer wanted to go back to the infernal darkness. Recalls, signs of anger, warnings were of no avail. Many years more he lived facing the curve of the gulf, the sparkling sea, and the smiles of earth. A decree of the gods was necessary. Mercury came and seized the impudent man by the collar and, snatching him from his joys, lead him forcibly back to the underworld, where his rock was ready for him.You have already grasped that Sisyphus is the absurd hero. He is, as much through his passions as through his torture. His scorn of the gods, his hatred of death, and his passion for life won him that unspeakable penalty in which the whole being is exerted toward accomplishing nothing. This is the price that must be paid for the passions of this earth. Nothing is told us about Sisyphus in the underworld. Myths are made for the imagination to breathe life into them. As for this myth, one sees merely the whole effort of a body straining to raise the huge stone, to roll it, and push it up a slope a hundred times over; one sees the face screwed up, the cheek tight against the stone, the shoulder bracing the clay-covered mass, the foot wedging it, the fresh start with arms outstretched, the wholly human security of two earth-clotted hands. At the very end of his long effort measured by skyless space and time without depth, the purpose is achieved. Then Sisyphus watches the stone rush down in a few moments toward tlower world whence he will have to push it up again toward the summit. He goes back down to the plain.It is during that return, that pause, that Sisyphus interests me. A face that toils so close to stones is already stone itself! I see that man going back down with a heavy yet measured step toward the torment of which he will never know the end. That hour like a breathing-space which returns as surely as his suffering, that is the hour of consciousness. At each of those moments when he leaves the heights and gradually sinks toward the lairs of the gods, he is superior to his fate. He is stronger than his rock.'.split(' ');

var roleClaimer = {
  name: 'claimer',
  
  /** @param {Creep} creep **/
  run: function(creep) {
    //utils.creepSay(creep, 'CLAIM:' + creep.memory.additional.targetFlag, 1);
    
    // for the philosophy
    if(creep.ticksToLive == 1499) {
          creep.memory.text = 0;
    }
    if(creep.memory.text == sisyphos.length) {
        creep.memory.text = 0;
    }
    
    // ..    
    if(creepUtils.getCorrectFlagOrRoomFromCreepAndMoveToFirst(creep, creepUtils.getTargetRoom(creep)) != null)
    {
      var controller = creep.room.controller;
      
      var reserve = creep.memory.additional.reserveOnly == undefined || creep.memory.additional.reserveOnly == false;
      var result = OK;
      if(reserve) {
        result = creep.claimController(controller);
        // cc Albert Camus
         creep.say(sisyphos[creep.memory.text],true);
         creep.memory.text++;
      } else {
        result = creep.reserveController(controller);
        // a happy hero
        creep.say(sisyphos[creep.memory.text],true);
        creep.memory.text++;
      }
      if(result == ERR_NOT_IN_RANGE) {
        utils.logCreep(creep.name + ': not in range... move to controller ' + controller);
        creep.moveTo(controller);
      }
      else
      {
        if(reserve)
        utils.logCreep(creep.name + ': Claiming controller ' + controller + ': ' + result);
        else
        utils.logCreep(creep.name + ': Reserving controller ' + controller + ': ' + result);
        
        creep.moveTo(controller);
      }
    }
  }
};

module.exports = roleClaimer;