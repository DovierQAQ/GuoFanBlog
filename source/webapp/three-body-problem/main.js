import WindowManager from './WindowManager.js'



const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let cubes = [];
let balls = [];
let sceneOffsetTarget = {x: 0, y: 0};
let sceneOffset = {x: 0, y: 0};

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

let internalTime = getTime();
let windowManager;
let initialized = false;

// get time in seconds since beginning of the day (so that all windows use the same time)
function getTime ()
{
	return (new Date().getTime() - today) / 1000.0;
}


if (new URLSearchParams(window.location.search).get("clear"))
{
	localStorage.clear();
}
else
{	
	// this code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
	document.addEventListener("visibilitychange", () => 
	{
		if (document.visibilityState != 'hidden' && !initialized)
		{
			init();
		}
	});

	window.onload = () => {
		if (document.visibilityState != 'hidden')
		{
			init();
		}
	};

  function getMousePositionIn3D(event) {
    let mouse3D = new t.Vector3(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    mouse3D.unproject(camera);
    mouse3D.z = 0;
    return mouse3D;
  }

	function init ()
	{
		initialized = true;

		// add a short timeout because window.offsetX reports wrong values before a short period 
		setTimeout(() => {
			setupScene();
			setupWindowManager();
			resize();
			updateWindowShape(false);
			render();
			window.addEventListener('resize', resize);
		}, 500)	

    document.addEventListener('click', (event) => {
      let mouse3D = getMousePositionIn3D(event);
      createBallAtPosition(mouse3D.x, mouse3D.y);
    });
	}

	function setupScene ()
	{
		camera = new t.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
		
		camera.position.z = 2.5;
		near = camera.position.z - .5;
		far = camera.position.z + 0.5;

		scene = new t.Scene();
		scene.background = new t.Color(0.0);
		scene.add( camera );

		renderer = new t.WebGLRenderer({antialias: true, depthBuffer: true});
		renderer.setPixelRatio(pixR);
	    
	  	world = new t.Object3D();
		scene.add(world);

		renderer.domElement.setAttribute("id", "scene");
		document.body.appendChild( renderer.domElement );
	}

	function setupWindowManager ()
	{
		windowManager = new WindowManager();
		windowManager.setWinShapeChangeCallback(updateWindowShape);
		windowManager.setWinChangeCallback(windowsUpdated);

		// here you can add your custom metadata to each windows instance
		let metaData = {foo: "bar"};

		// this will init the windowmanager and add this window to the centralised pool of windows
		windowManager.init(metaData);

		// call update windows initially (it will later be called by the win change callback)
		windowsUpdated();
	}

	function windowsUpdated ()
	{
		updateNumberOfCubes();
	}

	function updateNumberOfCubes ()
	{
		let wins = windowManager.getWindows();

		// remove all cubes
		cubes.forEach((c) => {
			world.remove(c);
		})

		cubes = [];

		// add new cubes based on the current window setup
		for (let i = 0; i < wins.length; i++)
		{
			let win = wins[i];

			let c = new t.Color();
			c.setHSL(i * .1, 1.0, .5);

			let s = 50;// + i * 50;
			let cube = new t.Mesh(new t.SphereGeometry(s, 8, 8), new t.MeshBasicMaterial({color: c , wireframe: true}));
			cube.position.x = win.shape.x + (win.shape.w * .5);
			cube.position.y = win.shape.y + (win.shape.h * .5);

			world.add(cube);
			cubes.push(cube);
		}
	}

	function updateWindowShape (easing = true)
	{
		// storing the actual offset in a proxy that we update against in the render function
		sceneOffsetTarget = {x: -window.screenX, y: -window.screenY};
		if (!easing) sceneOffset = sceneOffsetTarget;
	}

  function createBallAtPosition(x, y) {
    console.log('Creating ball at position:', x, y);
    let ballGeometry = new t.SphereGeometry(20, 4, 4);
    let ballMaterial = new t.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    let ball = new t.Mesh(ballGeometry, ballMaterial);
    ball.position.set(x, y, 0);
    world.add(ball);
    console.log('Added ball to scene at position:', ball.position);
    let ballData = {mesh: ball, velocity: new t.Vector3(), acceleration: new t.Vector3()};
    balls.push(ballData);
    console.log('Current number of balls:', balls.length);
    return ball;
  }

	function render ()
	{
		let time = getTime();

		windowManager.update();


		// calculate the new position based on the delta between current offset and new offset times a falloff value (to create the nice smoothing effect)
		let falloff = .05;
		sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
		sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);

		// set the world position to the offset
		world.position.x = sceneOffset.x;
		world.position.y = sceneOffset.y;

		let wins = windowManager.getWindows();


		// loop through all our cubes and update their positions based on current window positions
		for (let i = 0; i < cubes.length; i++)
		{
			let cube = cubes[i];
			let win = wins[i];
			let _t = time;// + i * .2;

			let posTarget = {x: win.shape.x + (win.shape.w * .5), y: win.shape.y + (win.shape.h * .5)}

			cube.position.x = cube.position.x + (posTarget.x - cube.position.x) * falloff;
			cube.position.y = cube.position.y + (posTarget.y - cube.position.y) * falloff;
			cube.rotation.x = _t * .5;
			cube.rotation.y = _t * .3;
		};

    balls.forEach(ballData => {
      let totalForce = new t.Vector3(0, 0, 0);
      cubes.forEach(cube => {
        let direction = cube.position.clone().sub(ballData.mesh.position);
        let distanceSquared = direction.lengthSq();
        if (distanceSquared > 0) {
          let strength = 500.0 / distanceSquared;
          let force = direction.normalize().multiplyScalar(strength);
          totalForce.add(force);
        }
      });
  
      ballData.acceleration.add(totalForce);

      cubes.forEach(cube => {
        let distanceVector = cube.position.clone().sub(ballData.mesh.position);
        let distance = distanceVector.length();
        let minDistance = cube.geometry.parameters.radius + ballData.mesh.geometry.parameters.radius;
  
        if (distance < minDistance) {
          let collisionNormal = distanceVector.normalize();
          let relativeVelocity = ballData.velocity.clone();
          let speed = relativeVelocity.dot(collisionNormal);
  
          let velocityChange = collisionNormal.multiplyScalar(-2 * speed * 0.8);
          ballData.velocity.add(velocityChange);
  
          let overlap = minDistance - distance;
          ballData.mesh.position.add(collisionNormal.multiplyScalar(overlap));
        }
      });

      ballData.velocity.add(ballData.acceleration);
      ballData.mesh.position.add(ballData.velocity);

      ballData.acceleration.set(0, 0, 0);
    });

    console.log('Balls:', balls);

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}


	// resize the renderer to fit the window size
	function resize ()
	{
		let width = window.innerWidth;
		let height = window.innerHeight
		
		camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	}
}