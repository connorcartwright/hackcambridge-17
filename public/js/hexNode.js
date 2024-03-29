var nodes = [];
var nextID = 0;
var startNodeColour = "rgba(60, 60, 240, 0.8)";
var nodeTypes = {};
var rotationMap = {
  u : 0,
  ul:-60,
  ur:60,
  dr:120,
  d : 180,
  dl: -120
};
var directionMap = {
    u : {x: 0, y: -1},
    ul: {x: -1, y: 0},
    ur: {x: 1, y: -1},
    dr: {x: 1, y: 0},
    d : {x: 0, y: 1},
    dl: {x: -1, y: 1}
};


nodeTypes['start'] = {
    name: 'start',
    pulseNode: null,
    onPulse: function(pulse){
    },
    onTick: function(){
        console.log('THIS COUNTER: ' + this.counter);
        if(this.counter == 0 || this.counter == 8) {
            var dirVect = directionMap[this.direction];
            console.log('AAAAAAA');
            console.log(this);
            var startX = this.x + dirVect.x;
            var startY = this.y + dirVect.y;
            this.pulseNode = new PulseNode(startX, startY, this.direction, 8, this);
            if (this.counter == 8) {
                this.counter = 0;
            }
        }
        this.counter++;

    },
    init: function(){
        this.counter = 0;
    },
    getShape: function(width){
        var graphics = new createjs.Graphics();
        graphics.beginFill(startNodeColour)
            .drawPolyStar(0,0,width/2,6,0,0);
        var shape = new createjs.Shape(graphics);
        return shape;
    },
    collide: function(pulse){
        console.log(this.direction);
        pulse.setDirection(this.direction);
        console.log("COOLLLLLISSSION");
        console.log(pulse);
        return true;
    }
};

nodeTypes['stop'] = {
    name: stop,
    onPulse: function(pulse){
    },
    onTick: function(){

    },
    init: function(){
        this.counter = 0;
    },
    getShape: function(width){
        var graphics = new createjs.Graphics();
        graphics.beginFill(startNodeColour)
            .drawPolyStar(0,0,width/2,6,0,0);
        var shape = new createjs.Shape(graphics);
        return shape;
    },
    collide: function(pulse){
      console.log('AAAH COLLIDE WITH STOP');
        pulse.destroyPulse();
        console.log(pulse);
        return true;
    }
};

function renderNodes(container,hexWidth,hexHeight){
  //container.children = [];
  for(var i = 0; i < nodes.length; i++){
    var node = nodes[i];
    rndrX = node.getRenderX();
    rndrY = node.getRenderY();
    yOffset = ((rndrX + 1) % 2) * (hexHeight/2);
    absX = hexWidth * (rndrX * 0.75) +  0.5* hexWidth;
    absY =  1 + hexHeight *(rndrY) + (0.5 * hexHeight) + yOffset;
    var shape = nodeTypes[node.typeId].getShape(hexWidth);
    shape.x = absX;
    shape.y = absY;
    shape.regX = 0;
    shape.regY = 0;
    shape.rotation = rotationMap[node.direction];
    shape.name = node.name;
    container.addChild(shape);
  }
}

function updateNodes(){
  for(var i = 0; i<nodes.length;i++){
    nodes[i].update();
  }
}

function HexNode(x,y,direction,typeId,pulsePerBeat, nodeId){
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.typeId = typeId;
  this.pulsePerBeat = pulsePerBeat;
  this.name = nodeId.toString();
  console.log('NEW HEX NODE, TYPEID: ' +typeId );
    console.log('GLOBAL NODE TYPE: ' + globalNodeType);
    this.update = nodeTypes[typeId].onTick;
  this.collide = nodeTypes[typeId].collide;
  nodeTypes[typeId].init.apply(this,[]); 
  return this;
}

HexNode.prototype.constructor = HexNode;
HexNode.prototype.getRenderX = function() {
  return this.x;
}

HexNode.prototype.getRenderY = function() {
  return this.y + Math.ceil(this.x/2);
}

