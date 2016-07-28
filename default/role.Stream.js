var roomStatistics = require('roomStatistics');

var roleStream = {
  name: 'role.Stream',

streams: {attackPath:[{x:29,y:38,room:'E29S0'},{x:29,y:37,room:'E29S0'},{x:29,y:36,room:'E29S0'}, {x:28,y:36,room:'E29S0'},{x:27,y:36,room:'E29S0'},{x:27,y:35,room:'E29S0'},{x:27,y:34,room:'E29S0'},{x:27,y:33,room:'E29S0'},{x:28,y:33,room:'E29S0'},{x:29,y:33,room:'E29S0'},{x:30,y:33,room:'E29S0'},{x:30,y:34,room:'E29S0'},{x:30,y:35,room:'E29S0'},{x:30,y:36,room:'E29S0'},{x:29,y:36,room:'E29S0', exit: true}]},
  
  //streams:{power:[{x:29,y:32, room:'E29S0'},{x:29,y:33, room:'E29S0'},{x:30,y:33, room:'E29S0'},{x:30,y:34, room:'E29S0'},{x:30,y:35, room:'E29S0'},{x:30,y:36, room:'E29S0'},{x:29,y:36, room:'E29S0'},{x:28,y:36, room:'E29S0'}
  //,{x:27,y:35, room:'E29S0'},{x:27,y:34, room:'E29S0'},{x:28,y:33, room:'E29S0'},{x:29,y:33, room:'E29S0'}]},
  //streams:{test:[{x:40,y:32, room:'E28N3'},{x:41,y:32, room:'E28N3'},{x:41,y:31, room:'E28N3'},{x:41,y:30, room:'E28N3', exit:true}]},
  //streams:{attackPath:[{x:36,y:4,room:'E32N1'}, {x:36,y:3,room:'E32N1'}, {x:36,y:2,room:'E32N1'},{x:36,y:1,room:'E32N1'}, {x:36,y:0,room:'E32N1'}, {x:36, y:49, room:'E32N2'},{x:36, y:48, room:'E32N2'}, {x:36, y:47, room:'E32N2'}, {x:36, y:46, room:'E32N2'},{x:35, y:45, room:'E32N2'}, {x:34, y:44, room:'E32N2'}, {x:33, y:43, room:'E32N2'},{x:32, y:42, room:'E32N2'}, {x:31, y:41, room:'E32N2'}, {x:30, y:40, room:'E32N2'},{x:29, y:39, room:'E32N2'}, {x:28, y:38, room:'E32N2'}, {x:27, y:37, room:'E32N2'},{x:26, y:36, room:'E32N2'}, {x:25, y:36, room:'E32N2'}, {x:24, y:35, room:'E32N2'},{x:23, y:34, room:'E32N2'}, {x:23, y:33, room:'E32N2'}, {x:23, y:32, room:'E32N2'},{x:23, y:31, room:'E32N2'}, {x:23, y:30, room:'E32N2'}, {x:23, y:29, room:'E32N2'},{x:23, y:28, room:'E32N2'}, {x:23, y:27, room:'E32N2'}, {x:23, y:26, room:'E32N2'},{x:23, y:25, room:'E32N2'}, {x:23, y:24, room:'E32N2'}, {x:23, y:23, room:'E32N2'},{x:23, y:22, room:'E32N2', exit:true}]},
  runAll: function(){
    for(var s in this.streams)
    {
      console.log('run street ' + s);
      this.run(this.streams[s]);
    }
  },
  run: function(stream) {
    for(var i in stream)
    {
      var e = stream.length -1 -i;
      var next = stream.length -1 -i+1;
      var road = stream[e];
      if(Game.rooms[road.room] != undefined)
      {
        if(road.exit != true)
        {
          var nextRoad = stream[next];
          for(var c in roomStatistics.findOwnCreeps(Game.rooms[road.room]))
          {
            var creep = roomStatistics.findOwnCreeps(Game.rooms[road.room])[c];
            if(creep.pos.x == road.x && creep.pos.y == road.y)
            {
              var dir = (new RoomPosition(road.x, road.y, nextRoad.room)).getDirectionTo(new RoomPosition(nextRoad.x, nextRoad.y, nextRoad.room));
              var result = creep.move(dir);
              //creep.say(next);
              creep.say(result, true);
            }
          }
        }
      }
    }
  }
};

module.exports = roleStream;