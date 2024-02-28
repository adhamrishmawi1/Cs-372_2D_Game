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
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 0).normalize();
directionalLight.castShadow = true;
scene.add(directionalLight);

var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
scene.add(hemisphereLight);

// Init Physics


// Add Player
const p1Geometry = new THREE.SphereGeometry(0.5, 32, 32);
const p1Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const p1 = new THREE.Mesh(p1Geometry, p1Material);
const ballShape = new CANNON.Sphere(0.5);
p1.userData.physicsBody = new CANNON.Body({ mass: 1 });
p1.userData.physicsBody.addShape(ballShape);
p1.userData.physicsBody.position.set(0, 0, 0);
world.addBody(p1.userData.physicsBody);
physObjs.push(p1);
scene.add(p1);

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
    // world.step(1 / 60);

    // physObjs.forEach((o, index) => {
    //     o.position.copy(o.userData.physicsBody.position);
    //     o.quaternion.copy(o.userData.physicsBody.quaternion);
    // });

    renderer.render(scene, camera);
} 

animate();