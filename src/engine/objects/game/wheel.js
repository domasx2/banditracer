var box2d = require('box2dweb');

var Wheel = module.exports =  function(pars){
    /*
    wheel object 
          
    pars:
    
    car - car this wheel belongs to
    x - horizontal position in meters relative to car's center
    y - vertical position in meters relative to car's center
    width - width in meters
    length - length in meters
    revolving - does this wheel revolve when steering?
    powered - is this wheel powered?
    */

    this.position=[pars.x, pars.y];
    this.car = pars.car;
    this.revolving = pars.revolving;
    this.powered = pars.powered;

    //initialize body
    var def = new box2d.Dynamics.b2BodyDef();
    def.type = box2d.Dynamics.b2Body.b2_dynamicBody;
    def.position = this.car._body.GetWorldPoint(new box2d.b2Vec2(this.position[0], this.position[1]));
    def.angle = this.car._body.GetAngle();
    this.body = this.car._world.b2world.CreateBody(def);
    
    //initialize shape
    var fixdef= new box2d.Dynamics.b2FixtureDef;
    fixdef.density = 1;
    fixdef.isSensor = true; //wheel does not participate in collision calculations: resulting complications are unnecessary
    fixdef.shape = new box2d.Collision.Shapes.b2PolygonShape();
    fixdef.shape.SetAsBox(pars.width/2, pars.length/2);
    this.body.CreateFixture(fixdef);

    //create joint to connect wheel to body
    if(this.revolving){
        var jointdef = new box2d.Dynamics.Joints.b2RevoluteJointDef();
        jointdef.Initialize(this.car._body, this.body, this.body.GetWorldCenter());
        jointdef.enableMotor = false; //we'll be controlling the wheel's angle manually
    }else{
        var jointdef = new box2d.Dynamics.Joints.b2PrismaticJointDef();
        jointdef.Initialize(this.car._body, this.body, this.body.GetWorldCenter(), new box2d.b2Vec2(1, 0));
        jointdef.enableLimit = true;
        jointdef.lowerTranslation = jointdef.upperTranslation = 0;
    }
    this.car._world.b2world.CreateJoint(jointdef);
}

Wheel.prototype.setAngle = function(angle){
    /*
    angle - wheel angle relative to car, in degrees
    */
    this.body.SetAngle(this.car._body.GetAngle()+angle);
};

Wheel.prototype.getLocalVelocity=function(){
    /*returns get velocity vector relative to car
    */
    return this.car._body.GetLocalVector(this.car._body.GetLinearVelocityFromLocalPoint(new box2d.b2Vec2(this.position[0], this.position[1])));
};

Wheel.prototype.getDirectionVector=function(){
    /*
    returns a world unit vector pointing in the direction this wheel is moving
    */
    return (this.getLocalVelocity().y>0 ? new box2d.b2Vec2(0, 1): new box2d.b2Vec2(0, -1)).rotate(this.body.GetAngle());
};


Wheel.prototype.getKillVelocityVector=function(){
    /*
    substracts sideways velocity from this wheel's velocity vector and returns the remaining front-facing velocity vector
    */
    var velocity = this.body.GetLinearVelocity();
    var sideways_axis = this.getDirectionVector();
    var dotprod = velocity.dotProd(sideways_axis);
    sideways_axis.Multiply(dotprod);
    return sideways_axis;
};

Wheel.prototype.killSidewaysVelocity=function(){
    /*
    removes all sideways velocity from this wheels velocity
    */
    this.body.SetLinearVelocity(this.getKillVelocityVector());

};
