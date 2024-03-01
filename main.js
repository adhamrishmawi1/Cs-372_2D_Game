import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -15);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust ambient light intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, -1).normalize();
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.intensity = 2;
directionalLight.color.set(0xffccaa);

// Init Physics
var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();
var physObjs = [];
const force = 0.00001;
Matter.Resolver._restingThresh = 1;

const gGeometry = new THREE.BoxGeometry(20, 1, 5);
const gMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const ground = new THREE.Mesh(gGeometry, gMaterial);
ground.userData.physicsBody = Bodies.rectangle(0, 5, 20, 1, { isStatic: true });
ground.userData.offset = 0;
ground.receiveShadow = true;
physObjs.push(ground);
scene.add(ground);

// Add Players
const options = {
    inertia: Infinity,
    friction: 0.01,
    frictionAir: 0.1
}

const loader = new GLTFLoader();

var p1, mixer1, action1;
var phys1 = Bodies.rectangle(-3, 0, 0.8, 2.6, options);
var p1dir = { x: 0, y: 0 };

var p2, mixer2, action2;
var phys2 = Bodies.rectangle(3, 0, 0.7, 3.0, options);
var p2dir = { x: 0, y: 0 };

loader.load(
    './Model/taryk/scene.gltf',
    function ( gltf1 ) {
        p1 = gltf1.scene;
        p1.castShadow = true;
        p1.userData.physicsBody = phys1;
        p1.userData.offset = 1.4;
        p1.rotation.y = Math.PI / 2;
        physObjs.push(p1);
        scene.add(p1);

        console.log(gltf1.animations);

        mixer1 = new THREE.AnimationMixer( p1 );
        action1 = mixer1.clipAction( gltf1.animations[1] );
        action1.setLoop(THREE.LoopRepeat);
        action1.play();

        loader.load(
            './Model/granny.glb',
            function ( gltf2 ) {
                p2 = gltf2.scene;
                p2.castShadow = true;
                p2.userData.physicsBody = phys2;
                p2.userData.offset = 1.5;
                p2.rotation.y = -Math.PI / 2;
                physObjs.push(p2);
                scene.add(p2);
        
                mixer2 = new THREE.AnimationMixer( p2 );
                action2 = mixer2.clipAction( gltf2.animations[0] );
                action2.setLoop(THREE.LoopRepeat);
                action2.play();
        
                Composite.add(engine.world, physObjs.map(o => o.userData.physicsBody));
            }
        );
    }
);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        p1dir = { x: force, y: p1dir.y };
    } else if (event.key === 'ArrowRight') {
        p1dir = { x: -force, y: p1dir.y };
    } else if (event.key === 'ArrowUp') {
        p1dir = { x: p1dir.x, y: -force };
    } else if (event.key === 'ArrowDown') {
        p1dir = { x: p1dir.x, y: force };
    } else if (event.key === 'a' || event.key === 'A') {
        p2dir = { x: force, y: p2dir.y };
    } else if (event.key === 'd' || event.key === 'D') {
        p2dir = { x: -force, y: p2dir.y };
    } else if (event.key === 'w' || event.key === 'W') {
        p2dir = { x: p2dir.x, y: -force };
    } else if (event.key === 's' || event.key === 'S') {
        p2dir = { x: p2dir.x, y: force };
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        p1dir = { x: 0, y: p1dir.y };
    } else if (event.key === 'ArrowRight') {
        p1dir = { x: 0, y: p1dir.y };
    } else if (event.key === 'ArrowUp') {
        p1dir = { x: p1dir.x, y: 0 };
    } else if (event.key === 'ArrowDown') {
        p1dir = { x: p1dir.x, y: 0 };
    } else if (event.key === 'a' || event.key === 'A') {
        p2dir = { x: 0, y: p2dir.y };
    } else if (event.key === 'd' || event.key === 'D') {
        p2dir = { x: 0, y: p2dir.y };
    } else if (event.key === 'w' || event.key === 'W') {
        p2dir = { x: p2dir.x, y: 0 };
    } else if (event.key === 's' || event.key === 'S') {
        p2dir = { x: p2dir.x, y: 0 };
    }
});

function reset() {
    Matter.Body.setPosition(phys1, { x: -3, y: 0 });
    Matter.Body.setVelocity(phys1, { x: 0, y: 0 });
    Matter.Body.setPosition(phys2, { x: 3, y: 0 });
    Matter.Body.setVelocity(phys2, { x: 0, y: 0 });
}

function animate() {
    requestAnimationFrame(animate);

    Matter.Body.applyForce(phys1, phys1.position, p1dir);
    Matter.Body.applyForce(phys2, phys2.position, p2dir);

    mixer1.update( 1 / 30 );
    mixer2.update( 1 / 30 );

    // Update physics
    Engine.update(engine, 1.5);

    physObjs.forEach((o, index) => {
        o.position.x = o.userData.physicsBody.position.x;
        o.position.y = -o.userData.physicsBody.position.y - o.userData.offset;
        //o.rotation.z = o.userData.physicsBody.angle;
    });

    if (phys1.position.y > 20 || phys1.position.y < -20) {
        var a = document.getElementById("overlayB");
        a.innerHTML = 1 + parseInt(a.innerHTML); 
        reset();
    }

    if (phys2.position.y > 20 || phys2.position.y < -20) {
        var a = document.getElementById("overlayA");
        a.innerHTML = 1 + parseInt(a.innerHTML);
        reset();
    }

    renderer.render(scene, camera);
} 

animate();