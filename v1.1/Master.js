function Master() {
    this.controlledObject = undefined;
    this.sceneObjectList = [];
    this.followingCam = undefined;
    this.scene = undefined;
    this.renderer = undefined;
    this.event = new CustomEvent('mtlloaded', {'data' : 'abc'});
    this.xRange = 200;
    this.zRange = 200;

    this.init = function() {
        // Initial setup of scene
        scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.followingCam = new FollowingCamera(camera);
    }

    this.loadMTLFile = function(objFilePath, mtlFilePath, onLoaded, onProgress, onError) {
        var objLoader = new THREE.OBJMTLLoader();
        objLoader.load( objFilePath, mtlFilePath, onLoaded, onProgress, onError );
    }

    this.addGround = function(args) {
        var texture, material, plane;

        texture = THREE.ImageUtils.loadTexture( "textures/ground.jpg" );

        // assuming you want the texture to repeat in both directions:
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        // how many times to repeat in each direction; the default is (1,1),
        //   which is probably why your example wasn't working
        texture.repeat.set( 4, 4 );

        material = new THREE.MeshLambertMaterial({ map : texture });
        plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.xRange * 2, this.zRange * 2), material);
        plane.material.side = THREE.DoubleSide;
        plane.rotateX(Math.PI / 2);
        scene.add(plane);
    }

    this.addAxis = function(args) {
        var geometryRefRed = new THREE.BoxGeometry(15, 1, 1);
        var materialRefRed = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var cubeRefRed = new THREE.Mesh(geometryRefRed, materialRefRed);

        var geometryRefGreen = new THREE.BoxGeometry(1, 15, 1);
        var materialRefGreen = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var cubeRefGreen = new THREE.Mesh(geometryRefGreen, materialRefGreen);

        var geometryRefBlue = new THREE.BoxGeometry(1, 1, 15);
        var materialRefBlue = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        var cubeRefBlue = new THREE.Mesh(geometryRefBlue, materialRefBlue);

        scene.add(cubeRefBlue);
        scene.add(cubeRefGreen);
        scene.add(cubeRefRed);
    }

    this.addTrees = function(args) {
        var currentObject = this;
        onLoaded = function(treeObject) {
            for (i = 0; i < args.count; i++) {
                var newObject = treeObject.clone();
                newObject.position.x = Math.random() * currentObject.xRange - currentObject.xRange / 2;
                newObject.position.z = Math.random() * currentObject.zRange - currentObject.zRange / 2;
                newObject.rotateY(Math.random() * Math.PI);
                scene.add(newObject);
            }
        };
        onProgress = function() {

        };
        onError = function() {

        };
        this.loadMTLFile('models/Tree.obj', 'models/Tree.mtl', onLoaded, onProgress, onError);
    }

    this.addCar = function(args) {
        var currentObject = this;
        onLoaded = function(carObject) {
            carObject.rotateY(Math.PI / 2);
            // carObject.position.y += 10;
            currentObject.controlledObject = new MovingObject(carObject);
            currentObject.sceneObjectList[currentObject.sceneObjectList.length] = carObject;
            currentObject.followingCam.setTarget(currentObject.controlledObject);
            currentObject.controlledObject.setRange(currentObject.xRange, currentObject.zRange);
            scene.add(carObject);
        };
        onProgress = function() {

        };
        onError = function() {

        };
        this.loadMTLFile('models/Colt.obj', 'models/Colt.mtl', onLoaded, onProgress, onError);
    }

    this.addAmbientLight = function(args) {
        var ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
    }

    this.addDirectionalLight = function(args) {
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(100, 100, 60);
        scene.add(light);
    }

    this.setInputFocus = function(object) {
        var movingObj = new MovingObject(object);
        this.controlledObject = movingObj;
        return movingObj;
    }

    this.setCameraTarget = function(_targetObj) {
        this.followingCam.setTarget(_targetObj);
    }

    this.setRepaintTimer = function(milliDuration) {
        window.setInterval(function(object) {
            object.updateScene();
            object.renderer.render(scene, object.followingCam.camera);
        }, milliDuration, this);
    }

    this.updateScene = function() {
        this.controlledObject.update();
        this.followingCam.update();
    }
}
