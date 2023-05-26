import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'

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

    dragon.scale.set(0.5,0.5,0.5)
    dragon.position.x -=1.2
    dragon.position.y -=5

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

    fbook.scale.set(1,1,1)
    fbook.rotation.x -=0.9
    fbook.position.z +=3
    fbook.position.y -=1

    fbook.castShadow = true;
    fbook.receiveShadow = true;

    scene.add(fbook);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})

//cod hector
let hector;
loader.load('assets/hector.glb',function(glb){
    console.log(glb)
    hector = glb.scene;

    hector.scale.set(0.2,0.2,0.2)
    hector.position.x -=2
    hector.position.y -=2.5
    hector.position.z +=1.65
    hector.rotation.y +=0.5

    scene.add(hector);
}, function(xhr){
    console.log((xhr.loaded/xhr.total*100) + "% loaded")
}, function(error){
    console.log('An error occurred')
})

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(2,2,5)
scene.add(light)

const sizes={
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 150)
camera.position.set(0, 1, 4.5);
camera.rotation.set(-Math.PI/4, 0, 0);
camera.position.y -=1;



scene.add(camera)

const renderer = new THREE.WebGL1Renderer({
    canvas : canvas
})

let isDragged = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

window.addEventListener('mousedown', function(event) {
    isDragged = true;
});

window.addEventListener('mousemove', function(event) {
    if (isDragged) {
      let deltaX = event.clientX - previousMousePosition.x;
      let deltaY = event.clientY - previousMousePosition.y;
      
      fbook.rotation.z += deltaX * 0.01;
      fbook.rotation.x += deltaY * 0.01;
    }
  
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
});
  
window.addEventListener('mouseup', function(event) {
    isDragged = false;
});

renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled=true
renderer.gammaOutput=true

let velocity = new THREE.Vector3();

window.addEventListener('keydown', function(event) {
    switch (event.key) {
      case 'w':
            velocity.z = -1.5;
        break;
      case 's':
            velocity.z = +1.5;
        break;
    }
});
  
window.addEventListener('keyup', function(event) {
    switch (event.key) {
      case 'w':
        velocity.z = 0;
        break;
      case 's':
        velocity.z = 0;
        break;
    }
});  

// Create a clock to track the elapsed time
const clock = new THREE.Clock();

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

    if (fbook) {
        const centruG = new THREE.Vector3(0, -0.25, 0).applyQuaternion(fbook.quaternion);
        const centruG2 = new THREE.Vector3(0, 0.25, 0).applyQuaternion(fbook.quaternion);
      
        fbook.position.clamp(new THREE.Vector3(-4.7, -2.25, -4), new THREE.Vector3(4.5, 3.7, 4));
        camera.position.clamp(new THREE.Vector3(-4.5, -1.2, -3), new THREE.Vector3(4.3, 5, 4.8));

        fbook.position.addScaledVector(centruG.multiplyScalar(velocity.z), delta * 5);
        camera.position.addScaledVector(centruG2.multiplyScalar(-velocity.z), delta * 5);
        fbook.position.addScaledVector(new THREE.Vector3(1, 0, 0).multiplyScalar(velocity.x), delta * 5);
  
    }
}

let angle = 0; // Initial angle
let radius = 3; // Radius of the circular path
let speed = 0.01;



function animate(){
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0; // Adjust as needed

    // Set the new position and rotation to the model
    if(dragon){
        dragon.position.set(x, y, z);
        dragon.rotation.y = -angle;

    }
    
    // Increment the angle
    angle += speed;

    requestAnimationFrame(animate)

    //Update the animation mixer
    update();
    renderer.shadowMap.enabled = true;
    renderer.render(scene,camera);
}

animate();