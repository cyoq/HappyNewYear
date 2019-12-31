import * as THREE from 'three';

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import CameraData from './../../params/camera_para.dat';
import Marker from './../../marker/pattern-marker.patt';
import Model from './../../assets/tree.glb';

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

var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType: 'webcam',

    // // to read from an image
    // sourceType : 'image',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
    // to read from a video
    // sourceType : 'video',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
})
arToolkitSource.init(() => {
    onResize();
})
// handle resize
window.addEventListener('resize', function () {
    onResize();
})

// init renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
renderer.domElement.style.display = 'block';
document.body.appendChild(renderer.domElement);

var onRenderFcts = [];
// init scene and camera
var scene = new THREE.Scene();

var camera = new THREE.Camera();
scene.add(camera);

function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
}

////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////
// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: CameraData,
    detectionMode: 'mono',
    patternRatio: 0.7,
})
// initialize it
arToolkitContext.init(function onCompleted() {
    // copy projection matrix to camera
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
})
// update artoolkit on every frame
onRenderFcts.push(function () {
    if (arToolkitSource.ready === false) return
    arToolkitContext.update(arToolkitSource.domElement)
    // update scene.visible if the marker is seen
    scene.visible = camera.visible
})

////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////
// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type: 'pattern',
    patternUrl: Marker,
    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

let loader = new GLTFLoader();

loader.load(Model, gltf => {
    scene.add(gltf.scene);

    gltf.scene.scale.set(0.2, 0.2, 0.2);

    const icospheres = gltf.scene.children.filter(mesh => mesh.name.match(/Icosphere/));
    // const redIcospheres = icospheres.filter(ico => ico.material.name.match(/light_red/));
    // const blueIcospheres = icospheres.filter(ico => ico.material.name.match(/light_blue/));
    // const greenIcospheres = icospheres.filter(ico => ico.material.name.match(/light_green/));

    for (let ico of icospheres) {
        let pointLight = new THREE.PointLight(0x000, 0.5);
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
    // onRenderFcts.push(function(delta){
    //     gltf.scene.rotation.x += Math.PI*delta
    // })
});

// const ambientLight = new THREE.AmbientLight(0x666666);
// scene.add(ambientLight);

// /* SpotLight
// -------------------------------------------------------------*/
// const spotLight = new THREE.SpotLight(0xffffff);
// spotLight.distance = 2000;
// spotLight.position.set(-200, 700, 0);
// spotLight.castShadow = true;
// scene.add(spotLight);






onRenderFcts.push(function () {
    renderer.render(scene, camera);
})

// run the rendering loop
var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time

    // delay(1000, nowMsec, () => {
    //     if (flag) {
    //         for (let ico of icoLights) {
    //             ico.visible = randomGenerator() ? true : false;
    //         }
    //     }
    // });

    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    // call each update function
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })
});

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
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