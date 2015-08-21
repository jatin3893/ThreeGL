var RADIUS = 80;
var HEIGHT = 40;

function FollowingCamera(_camera, _target) {

    this.init = function() {
        this.camera = _camera;
        this.setTarget(_target);
        this.camera.up = new THREE.Vector3(0, 1, 0);
        this.camera.position.y = HEIGHT;
        document.addEventListener('keydown', this, false);
    }

    this.setTarget = function(_target) {
        if (_target == undefined)
            return;
        this.target = _target;
    } 

    this.update = function() {
        if (this.target == undefined)
            return;

        var cameraOrientation = this.target.orientation + Math.PI;
        this.camera.position.x = this.target.position.x - this.target.front.x * RADIUS;
        this.camera.position.z = this.target.position.z - this.target.front.z * RADIUS;
        this.camera.lookAt(new THREE.Vector3(this.target.position.x, this.target.position.y, this.target.position.z));
    };

    this.init();
}
