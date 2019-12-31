
import Hammer from "hammerjs";
import * as AFRAME from "aframe";



const particleNum = 10000;
const maxRange = 80;
const minRange = maxRange / 2;
const textureSize = 64.0;
let particles;
let icospheres;


AFRAME.registerComponent('add-lights', {

    init: function () {
        this.last = 0;
        // Wait for model to load.
        this.el.addEventListener('model-loaded', () => {
            // Grab the mesh / scene.
            const obj = this.el.getObject3D('mesh');
            const scene = this.el.sceneEl.object3D;

            icospheres = obj.children.filter(mesh => mesh.name.match(/Icosphere/));

        });

    },
    tick: function (time, timeDelta) {
        let colors = [new THREE.Color(0xE72134), new THREE.Color(0x2F38E7), new THREE.Color(0x00E70C)];


        if (!this.last || time - this.last >= 1000) {
            this.last = time;
            for (let ico of icospheres) {


                // switch (ico.material.name) {
                //     case "light_red":
                //         color = new THREE.Color(0xE72134);
                //         break;
                //     case "light_blue":
                //         color = new THREE.Color(0x2F38E7);
                //         break;
                //     case "light_green":
                //         color = new THREE.Color(0x00E70C);
                //         break;
                // }

                // ico.material.color = randomGenerator() ? new THREE.Color(0xfff) : color;
                ico.material.color = colors[randomGenerator()];
            }


        }
    }

});

function delay(msec, now, callbackfn) {
    if (!delay.last || now - delay.last >= msec) {
        delay.last = now;
        callbackfn();
    }
}

function randomGenerator() {
    return Math.floor(Math.random() * 10) % 3;
}


AFRAME.registerComponent('particles', {

    init: function () {

        const scene = this.el.sceneEl.object3D;

        createParticles();

        scene.add(particles);

    },

    tick: function (time, timeDelta) {
        const posArr = particles.geometry.vertices;
        const velArr = particles.geometry.velocities;

        posArr.forEach((vertex, i) => {
            const velocity = velArr[i];

            const x = i * 3;
            const y = i * 3 + 1;
            const z = i * 3 + 2;

            const velX = Math.sin(time * 0.001 * velocity.x) * 0.1;
            const velZ = Math.cos(time * 0.0015 * velocity.z) * 0.1;

            vertex.x += velX;
            vertex.y += velocity.y;
            vertex.z += velZ;

            if (vertex.y < -minRange) {
                vertex.y = minRange;
            }

        })

        particles.geometry.verticesNeedUpdate = true;

    }

});



function createParticles() {
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
}


function getTexture() {
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
    const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.restore();
}



AFRAME.registerComponent('gestures', {
    init: function () {
        const body = document.querySelector('body');
        let object;
        this.el.addEventListener('model-loaded', () => {

            object = this.el.getObject3D('mesh');

        });
        const hammer = new Hammer(body);

        hammer.on('pan', ev => {
            let rot = object.rotation;
            switch (ev.direction) {
                case 2:
                    rot.y = rot.y - 0.05;
                    break;
                case 4:
                    rot.y = rot.y + 0.05;
                    break;
                default:
                    break;
            }
            object.rotation.set(rot.x, rot.y, rot.z);
        });
    }
});

AFRAME.registerComponent("dirlight", {
    init: function () {
        const scene = this.el.sceneEl.object3D;
        const light = new THREE.HemisphereLight(0xc8e9ff, 0x000, 0.45);
        scene.add(light);
    }
})