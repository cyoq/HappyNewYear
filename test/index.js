import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Model from './../assets/tree.glb';


let flag = false;
/**
 * @type {THREE.PointLight[]}
 */
let icoLights;

const particleNum = 10000;
const maxRange = 300;
const minRange = maxRange / 2;
const textureSize = 64.0;
let particles;

function init() {


    const canvas = document.getElementById('canvas');

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000036, 0, minRange * 3);
    // scene.background = new THREE.Color('skyblue');
    renderer.setClearColor(new THREE.Color(0x000036));
    let camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.1, 100);

    camera.position.set(0, 5, 5);

    {
        // // const light = new THREE.HemisphereLight(0xddeeff, 0x202020, 1);
        // const ambient = new THREE.AmbientLight(0xfff);
        // const directional = new THREE.DirectionalLight(0xfff, 1);
        // // directional.position.set(10, 10, 10);
        // // scene.add(light);
        // scene.add(ambient);
        // scene.add(directional);
        const ambientLight = new THREE.AmbientLight(0x666666);
        scene.add(ambientLight);

        /* SpotLight
        -------------------------------------------------------------*/
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.distance = 2000;
        spotLight.position.set(-200, 700, 0);
        spotLight.castShadow = true;
        scene.add(spotLight);
    }


    let controls = new OrbitControls(camera, renderer.domElement);

    let loader = new GLTFLoader();

    loader.load(Model, gltf => {
        console.log(gltf.scene);
        scene.add(gltf.scene);

        const icospheres = gltf.scene.children.filter(mesh => mesh.name.match(/Icosphere/));
        // const redIcospheres = icospheres.filter(ico => ico.material.name.match(/light_red/));
        // const blueIcospheres = icospheres.filter(ico => ico.material.name.match(/light_blue/));
        // const greenIcospheres = icospheres.filter(ico => ico.material.name.match(/light_green/));

        for (let ico of icospheres) {
            let pointLight = new THREE.PointLight(0x000, 2);
            switch (ico.material.name) {
                case "light_red":
                    pointLight.color = new THREE.Color(0xFF2000);
                    break;
                case "light_blue":
                    pointLight.color = new THREE.Color(0x0C2DE8);
                    break;
                case "light_green":
                    pointLight.color = new THREE.Color(0x04FF00);
                    break;
            }
            ico.material.opacity = 0.7;
            ico.material.transparent = true;
            pointLight.name = "Light" + ico.name;
            scene.add(pointLight);
            // pointLight.position.set(ico.position.x + 0.1, ico.position.y + 0.1, ico.position.z + 0.1);
            pointLight.position.set(...ico.position.toArray());
            icoLights = scene.children.filter(i => i.name.match(/LightIcosphere/));
            // let helper = new THREE.PointLightHelper(pointLight, 0.1);
            // scene.add(helper);
        }

        flag = true;
    });

    /* Snow Particles
    -------------------------------------------------------------*/
    const pointGeometry = new THREE.Geometry();
    for (let i = 0; i < particleNum; i++) {
        const x = Math.floor(Math.random() * maxRange - minRange);
        const y = Math.floor(Math.random() * maxRange - minRange);
        const z = Math.floor(Math.random() * maxRange - minRange);
        const particle = new THREE.Vector3(x, y, z);
        pointGeometry.vertices.push(particle);
        // const color = new THREE.Color(0xffffff);
        // pointGeometry.colors.push(color);
    }

    const pointMaterial = new THREE.PointsMaterial({
        size: 1,
        color: 0xffffff,
        vertexColors: false,
        map: getTexture(),
        // blending: THREE.AdditiveBlending,
        transparent: true,
        // opacity: 0.8,
        fog: true,
        depthWrite: false
    });

    const velocities = [];
    for (let i = 0; i < particleNum; i++) {
        const x = Math.floor(Math.random() * 6 - 3) * 0.1;
        const y = Math.floor(Math.random() * 10 + 3) * - 0.05;
        const z = Math.floor(Math.random() * 6 - 3) * 0.1;
        const particle = new THREE.Vector3(x, y, z);
        velocities.push(particle);
    }

    particles = new THREE.Points(pointGeometry, pointMaterial);
    particles.geometry.velocities = velocities;
    scene.add(particles);


    delay.last = 0;

    function animate(now) {
        requestAnimationFrame(animate);

        controls.update()
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.1;

        delay(1000, now, () => {
            if (flag) {
                for (let ico of icoLights) {
                    ico.visible = randomGenerator() ? true : false;
                }
            }
        });

        const posArr = particles.geometry.vertices;
        const velArr = particles.geometry.velocities;
    
        posArr.forEach((vertex, i) => {
            const velocity = velArr[i];
    
            const x = i * 3;
            const y = i * 3 + 1;
            const z = i * 3 + 2;
            
            const velX = Math.sin(now * 0.001 * velocity.x) * 0.1;
            const velZ = Math.cos(now * 0.0015 * velocity.z) * 0.1;
            
            vertex.x += velX;
            vertex.y += velocity.y;
            vertex.z += velZ;
    
            if (vertex.y < -minRange ) {
                vertex.y = minRange;
            }
    
        })
    
        particles.geometry.verticesNeedUpdate = true;

        renderer.render(scene, camera);

    }


    requestAnimationFrame(animate);
    window.scene = scene;
    window.THREE = THREE;
}


function delay(msec, now, callbackfn) {
    if (!delay.last || now - delay.last >= msec) {
        delay.last = now;
        callbackfn();
    }
}

function randomGenerator() {
    return Math.floor(Math.random() * 10) % 2;
}

function getTexture(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const diameter = textureSize;
    canvas.width = diameter;
    canvas.height = diameter;
    const canvasRadius = diameter / 2;

    /* gradation circle
    ------------------------ */
    drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);
    
    /* snow crystal
    ------------------------ */
    // drawSnowCrystal(ctx, canvasRadius);

    const texture = new THREE.Texture(canvas);
    //texture.minFilter = THREE.NearestFilter;
    texture.type = THREE.FloatType;
    texture.needsUpdate = true;
    return texture;
}

function drawRadialGradation(ctx, canvasRadius, canvasW, canvasH) {
    ctx.save();
    const gradient = ctx.createRadialGradient(canvasRadius,canvasRadius,0,canvasRadius,canvasRadius,canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvasW,canvasH);
    ctx.restore();
}

init();