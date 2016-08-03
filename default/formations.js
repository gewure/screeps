
var formations = {
  getFormation: function(name)
  {
    if(name == 'testudo')
    return this.getTestudoFormation();
    return null;
  },
  getTestudoFormation: function()
  {
    return [[0,0],[-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0, -1], [-1, -1]];
  }
};

module.exports = formations;