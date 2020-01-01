
import Hammer from "hammerjs";
import * as AFRAME from "aframe";
import Particles from './particles';




AFRAME.registerComponent('change-garland-lights', {

    init: function () {
        this.last = 0;
        this.icospheres = undefined;

        this.el.addEventListener('model-loaded', () => {
            // Grab the mesh / scene.
            const obj = this.el.getObject3D('mesh');
            this.icospheres = obj.children.filter(mesh => mesh.name.match(/Icosphere/));

        });

    },
    tick: function (time) {
        let colors = [new THREE.Color(0xE72134), new THREE.Color(0x2F38E7), new THREE.Color(0x00E70C)];


        if (!this.last || time - this.last >= 1000) {
            this.last = time;
            for (let ico of this.icospheres) {
                ico.material.color = colors[ (Math.floor(Math.random() * 10) % 3) ];
            }


        }
    }

});


AFRAME.registerComponent('particles', {

    init: function () {

        const scene = this.el.sceneEl.object3D;

        this.particles = new Particles();
        this.particles.createParticles();

        scene.add(this.particles.particles);

    },

    tick: function (time) {
        this.particles.animate(time);
    }

});



AFRAME.registerComponent('gestures', {
    init: function () {
        const body = document.querySelector('body');
        let object;
        this.el.addEventListener('model-loaded', () => object = this.el.getObject3D('mesh'));
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

