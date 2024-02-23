import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -15);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 0).normalize();
directionalLight.castShadow = true;
scene.add(directionalLight);

var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
scene.add(hemisphereLight);

// Init Physics
const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;
let physObjs = [];

// Ground
// const groundShape = new CANNON.Plane();
// const groundBody = new CANNON.Body({ mass: 0 });
// groundBody.addShape(groundShape);
// groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
// groundBody.isPin = false;
// world.addBody(groundBody);

// Add Ball
const p1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
const p1Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const p1 = new THREE.Mesh(p1Geometry, p1Material);
const ballShape = new CANNON.Sphere(0.5);
p1.userData.physicsBody = new CANNON.Body({ mass: 1 });
p1.userData.physicsBody.addShape(ballShape);
p1.userData.physicsBody.position.set(0, 0, 0);
scene.add(p1);
//physObjs.push(p1);
//world.addBody(p1.userData.physicsBody);

// loader.load(
//     './ball.glb',
//     function (gltf) {
//         ball = gltf.scene.children[0];
//         ball.castShadow = true;

//         ball.scale.set(0.5, 0.5, 0.5);

//         const ballShape = new CANNON.Sphere(0.5);
//         ball.userData.physicsBody = new CANNON.Body({ mass: 10 });
//         ball.userData.physicsBody.addShape(ballShape);
//         ball.userData.physicsBody.position.set(0, 1, -10);
//         ball.userData.physicsBody.isPin = false;

//         function handleCollision(event) {
//             console.log(event);
//             if (event.body.isPin && !event.body.hasCollided) {
//                 score++;
//                 document.getElementById('overlay').textContent = 'Score: ' + score;
//                 event.body.hasCollided = true;
//             }
//         }

//         ball.userData.physicsBody.addEventListener('collide', handleCollision);

//         ball.position.copy(ball.userData.physicsBody.position);
//         world.addBody(ball.userData.physicsBody);
//         ball.visible = false;
//         scene.add(ball);
//     }
// );

// Handle Stuff

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        console.log('< pressed');
    } else if (event.key === 'ArrowRight') {
        console.log('> pressed');
    } else if (event.key === 'a' || event.key === 'A') {
        console.log('a pressed');
    } else if (event.key === 'd' || event.key === 'D') {
        console.log('d pressed');
    }
});

function animate() {
    requestAnimationFrame(animate);

    // Update physics
    world.step(1 / 60);

    physObjs.forEach((o, index) => {
        const p = o.userData.physicsBody;
        o.position.copy(p.position);
        o.quaternion.copy(p.quaternion);
    });

    renderer.render(scene, camera);
} 

animate();