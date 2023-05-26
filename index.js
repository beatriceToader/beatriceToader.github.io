import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'; 

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

//Cod cer poza
const bgTexture = new THREE.TextureLoader().load('assets/sky.jpg');
bgTexture.wrapS = THREE.RepeatWrapping;
bgTexture.wrapT = THREE.RepeatWrapping;
bgTexture.repeat.set(1, 1);

//Cod apa poza
const bottomTexture = new THREE.TextureLoader().load('assets/water2.jpg');
bottomTexture.wrapS = THREE.RepeatWrapping;
bottomTexture.wrapT = THREE.RepeatWrapping;
bottomTexture.repeat.set(1, 1);

const bgGeometry = new THREE.BoxGeometry(10, 10, 9.5);

//Material poza cer
const bgMaterial = new THREE.MeshBasicMaterial({
  map: bgTexture,
  side: THREE.BackSide
});

//Material poza apa
const bottomMaterial = new THREE.MeshBasicMaterial({
    map: bottomTexture,
    side: THREE.DoubleSide
  });

const bgCube = new THREE.Mesh(bgGeometry, bgMaterial);

bgCube.position.y +=1.77

const bottomGeometry = new THREE.PlaneGeometry(10,9.5);
const bottomCube = new THREE.Mesh(bottomGeometry, bottomMaterial);
bottomCube.position.copy(bgCube.position);
//bottomCube.position.y -= 4.3
bottomCube.position.y -= (bgCube.geometry.parameters.height / 2-0.05); // Adjust the position to align with the bottom face
bottomCube.rotation.x = -Math.PI / 2; // Rotate the face to be aligned with the bottom

scene.add(bgCube)

scene.add(bottomCube);


//cod animatie

// Declare variables for the animation mixer and actions
let bookmixer,dragonmixer,redmixer,fbookmixer;
let bookactions,dragonactions,redactions,fbookactions;

//cod carte
const loader = new GLTFLoader()
loader.load('assets/medieval_fantasy_book.glb',function(glb){
    console.log(glb)
    const root = glb.scene;

    // Find all the animations in the glb file
    bookmixer = new THREE.AnimationMixer(root);
    bookactions = glb.animations.map((clip) => bookmixer.clipAction(clip));

    // Play all the animations
    bookactions.forEach((action) => {
        action.play();
    });

    // const box = new THREE.Box3().setFromObject(root);
    // const center = box.getCenter(new THREE.Vector3());
    // root.position.sub(center);

    root.scale.set(0.1,0.065,0.09)
    root.position.x +=0.47
    root.position.y -=2.5
    scene.add(root);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})


//cod dragon
let dragon;
loader.load('assets/dragon_animation_flying.glb',function(glb){
    console.log(glb)
    dragon = glb.scene;

    // Find all the animations in the glb file
    dragonmixer = new THREE.AnimationMixer(dragon);
    dragonactions = glb.animations.map((clip) => dragonmixer.clipAction(clip));

    // Play all the animations
    dragonactions.forEach((action) => {
        action.play();
    });

    // const box = new THREE.Box3().setFromObject(root);
    // const center = box.getCenter(new THREE.Vector3());
    // root.position.sub(center);

    dragon.scale.set(0.5,0.5,0.5)
    dragon.position.x -=1.2
    dragon.position.y -=2.5

    dragon.castShadow = true;
    dragon.receiveShadow = true;

    scene.add(dragon);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})

//cod Red
let red;
loader.load('assets/red.glb',function(glb){
    console.log(glb)
    red = glb.scene;

    // Find all the animations in the glb file
    redmixer = new THREE.AnimationMixer(red);
    redactions = glb.animations.map((clip) => redmixer.clipAction(clip));

    // Play all the animations
    redactions.forEach((action) => {
        action.play();
    });

    red.scale.set(0.2,0.2,0.2)
    red.position.x +=2
    red.position.y -=2.55
    //red.position.z -=1

    red.castShadow = true;
    red.receiveShadow = true;

    scene.add(red);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})

//cod flying book
let fbook;
loader.load('assets/paladins_book.glb',function(glb){
    console.log(glb)
    fbook = glb.scene;

    // Find all the animations in the glb file
    fbookmixer = new THREE.AnimationMixer(fbook);
    fbookactions = glb.animations.map((clip) => fbookmixer.clipAction(clip));

    // Play all the animations
    fbookactions.forEach((action) => {
        action.play();
    });

    fbook.scale.set(1.5,1.5,1.5)
    fbook.rotation.x -=0.9
    fbook.position.z +=5
    fbook.position.y -=1

    fbook.castShadow = true;
    fbook.receiveShadow = true;

    scene.add(fbook);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(2,2,5)
scene.add(light)

//Boiler Plate Code
const sizes={
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 150)
camera.position.set(0, 1, 7);
camera.rotation.set(-Math.PI/4, 0, 0);
camera.position.y -=2;

// camera.rotation.set(-Math.PI/4, 0, 0);
// camera.position.y += 10;
scene.add(camera)

const renderer = new THREE.WebGL1Renderer({
    canvas : canvas
})

renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled=true
renderer.gammaOutput=true
//renderer.render(scene, camera)

//miscare carte
let keyboard ={
    left:false,
    right:false,
    up:false,
    down:false,
    forward:false,
    backward:false
};

function handleKeyDown(keyCode) {
    switch (keyCode) {
      case 37: // Left arrow key
        keyboard.left = true;
        break;
      case 39: // Right arrow key
        keyboard.right = true;
        break;
      case 38: // Up arrow key
        keyboard.up = true;
        break;
      case 40: // Down arrow key
        keyboard.down = true;
        break;
      case 87: // W key
        keyboard.forward = true;
        break;
      case 83: // S key
        keyboard.backward = true;
        break;
    }
  }
  
  function handleKeyUp(keyCode) {
    switch (keyCode) {
      case 37: // Left arrow key
        keyboard.left = false;
        break;
      case 39: // Right arrow key
        keyboard.right = false;
        break;
      case 38: // Up arrow key
        keyboard.up = false;
        break;
      case 40: // Down arrow key
        keyboard.down = false;
        break;
      case 87: // W key
        keyboard.forward = false;
        break;
      case 83: // S key
        keyboard.backward = false;
        break;
    }
  }  

document.addEventListener('keydown', (event) => {
    handleKeyDown(event.keyCode);
  });
  
  document.addEventListener('keyup', (event) => {
    handleKeyUp(event.keyCode);
  });

// Create a clock to track the elapsed time
const clock = new THREE.Clock();

const controls = new OrbitControls(camera, renderer.domElement);

controls.update();

function updateCameraPosition() {
    if(fbook){
      const distance = 1; // Distance between the camera and fbook
      const cameraOffset = new THREE.Vector3(0, 0, 2); // Set the camera offset
      const fbookPosition = fbook.position.clone(); // Get the fbook's position
      const cameraPosition = fbookPosition.add(cameraOffset); // Calculate the new camera position
      camera.position.copy(cameraPosition); // Update the camera's position
      camera.lookAt(fbook.position); // Make the camera look at the fbook

      // Get the current position of the fbook
      const fbookX = fbook.position.x;
      const fbookY = fbook.position.y;
      const fbookZ = fbook.position.z;

      // Get the dimensions of the bgCube
      const cubeWidth = bgCube.geometry.parameters.width;
      const cubeHeight = bgCube.geometry.parameters.height;
      const cubeDepth = bgCube.geometry.parameters.depth;

      // Check if the fbook is on a specific face of the cube
      if (Math.abs(fbookX) >= cubeWidth / 2 || Math.abs(fbookY) >= cubeHeight / 2 || Math.abs(fbookZ) >= cubeDepth / 2) {
          // Calculate the rotation angles for the camera and fbook
          const rotationX = fbookX >= cubeWidth / 2 ? -Math.PI / 2 : fbookX <= -cubeWidth / 2 ? Math.PI / 2 : 0;
          const rotationY = fbookY >= cubeHeight / 2 ? Math.PI : fbookY <= -cubeHeight / 2 ? 0 : 0;
          const rotationZ = fbookZ >= cubeDepth / 2 ? 0 : fbookZ <= -cubeDepth / 2 ? Math.PI : 0;

          // Apply the rotation to the camera
          camera.rotation.set(rotationX, rotationY, rotationZ);

          // Apply the rotation to the fbook
          fbook.rotation.set(rotationX, rotationY, rotationZ);
      }

    }
}

function update(){
    const delta = clock.getDelta();
    if (dragonmixer) {
        dragonmixer.update(delta);
    }

    if (bookmixer) {
        bookmixer.update(delta);
    }

    if (redmixer) {
        redmixer.update(delta);
    }

    if (fbookmixer) {
        fbookmixer.update(delta);
    }

    const bookSpeed = 0.05; // Adjust the speed as needed

    if (keyboard.left && fbook.position.x > -(bgCube.geometry.parameters.width / 2.5 )) {
        // Move the book to the left if within the left boundary
        fbook.position.x -= bookSpeed;
    }
      if (keyboard.right && fbook.position.x < bgCube.geometry.parameters.width / 2.5) {
        // Move the book to the right if within the right boundary
        fbook.position.x += bookSpeed;
      }
      if (keyboard.up && fbook.position.y < bgCube.geometry.parameters.height / 2) {
        // Move the book up if within the upper boundary
        fbook.position.y += bookSpeed;
      }
      if (keyboard.down && fbook.position.y > -bgCube.geometry.parameters.height / 4.5) {
        // Move the book down if within the lower boundary
        fbook.position.y -= bookSpeed;
      }
      if (keyboard.forward && fbook.position.z > -bgCube.geometry.parameters.depth / 5) {
        // Move the book forward if within the front boundary
        fbook.position.z -= bookSpeed;
      }
      if (keyboard.backward && fbook.position.z < bgCube.geometry.parameters.depth / 2) {
        // Move the book backward if within the back boundary
        fbook.position.z += bookSpeed;
      }
      
      updateCameraPosition();
}

const dragonInitialPosition = new THREE.Vector3(0, 0, 0);
let dragonMovement = new THREE.Vector3(0.01, 0.01, 0);
let flyingBack =false;

function animate(){
    requestAnimationFrame(animate)



    //Update the animation mixer
    update();


    if (dragon) {
        if (!flyingBack) {
          // Move the dragon until it reaches a certain position
          if (dragon.position.x < 2) {
            dragon.position.add(dragonMovement);
          } else {
            // Rotate the dragon
            dragon.rotateY(0.0004);
    
            // Check if the dragon has rotated back to its initial position
            if (Math.abs(dragon.rotation.y) <= 0.001) {
              flyingBack = true;
            }
          }
        } else {
          // Move the dragon back to its initial position
          const direction = dragonInitialPosition.clone().sub(dragon.position).normalize();
          const speed = 0.01;
          dragon.position.add(direction.multiplyScalar(speed));
    
          // Check if the dragon has reached its initial position
          if (dragon.position.distanceTo(dragonInitialPosition) <= 0.01) {
            flyingBack = false;
            dragon.position.copy(dragonInitialPosition);
            dragon.rotation.set(0, 0, 0);
          }
        }
      }

    renderer.shadowMap.enabled = true;
    renderer.render(scene,camera);
}

animate();