var Keys = {
    LEFT    :   37,
    UP      :   38,
    RIGHT   :   39,
    DOWN    :   40
}

var FORCE_ACCELERATE = 1;
var FORCE_BRAKE = 1;
var FORCE_FRICTION = -0.2;
var ANGULAR_SPEED = 1 * Math.PI / 180.0;

function MovingObject(_body) {
    this.body = _body;
    this.position = {
        x : 0,
        y : 0,
        z : 0,
    };
    this.speed = 0;
    this.acceleration = 0;
    this.orientation = 0;
    this.front = {
        x : 1,
        y : 0,
        z : 0,
    }

    this.setRange = function(_xRange, _zRange) {
        this.xRange = _xRange;
        this.zRange = _zRange;
        console.log(this.xRange + ' ' + this.zRange);
    }

    document.addEventListener('keydown', this, false);
    this.handleEvent = function(event) {
        switch(event.which) {
            case Keys.LEFT:{
                var currentAngularSpeed = ANGULAR_SPEED;
                this.orientation -= currentAngularSpeed;
                this.front.x = Math.cos(this.orientation);
                this.front.z = Math.sin(this.orientation);
                this.body.rotateY(currentAngularSpeed);
                break;
            }
            case Keys.RIGHT:{
                var currentAngularSpeed = ANGULAR_SPEED;
                this.orientation += currentAngularSpeed;
                this.front.x = Math.cos(this.orientation);
                this.front.z = Math.sin(this.orientation);
                this.body.rotateY(-currentAngularSpeed);
                break;
            }
            case Keys.UP:{
                if (this.acceleration < 5)
                    this.acceleration += FORCE_ACCELERATE;
                break;
            }
            case Keys.DOWN:{
                if (this.speed > 0)
                    this.acceleration -= FORCE_BRAKE;
                break;
            }
        }
    };

    this.update = function() {
        if (this.body == undefined)
            return;

        if (this.acceleration < 0.1)
            this.acceleration = 0;

        // Friction if object is moving
        if (this.speed > 0)
            this.acceleration += FORCE_FRICTION;

        // Edge case for stopping object
        this.speed = this.speed + this.acceleration / 2;
        if (this.speed < 0.1)
            this.speed = 0;

        // Change position of Object depending on speed
        var delX = this.speed * this.front.x;
        var delZ = this.speed * this.front.z;
        if (this.position.x + delX < this.xRange && 
            this.position.x + delX > -this.xRange && 
            this.position.z + delZ < this.zRange && 
            this.position.z + delZ > -this.zRange)
        {
            this.position.x += delX;
            this.position.z += delZ;            
        }
        else {
            this.speed = 0;
            this.acceleration = 0;
        }

        this.body.position.x = this.position.x;
        this.body.position.z = this.position.z;
    };
}





