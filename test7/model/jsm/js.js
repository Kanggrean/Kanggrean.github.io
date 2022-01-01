"use strict";

import * as THREE from '../../build/three.module.js';
import Stats from './libs/stats.module.js';
import {
	GLTFLoader
} from './loaders/GLTFLoader.js';

import {
	GUI
} from './libs/lil-gui.module.min.js';
import {
	OrbitControls
} from './controls/OrbitControls.js';
import {
	Sky
} from './objects/Sky.js';

var detatheta = -0.1;
var detathetaSpeed = 1;
var speed = 0.001;
var cameraX = 0;
var cameraY = 150;
var cameraZ = 0;
var flagR = false;
var cpx;
var cpz;

let container, stats;
let camera, scene, renderer;
let mesh, mixer;
let cameraa, scenee;
let sky, sun;
const radius = 1000; //相机距离
let theta = 0;
let prevTime = Date.now();

init();
animate();
//----** 初始化天空 **----
function initSky() {
	// Add Sky
	sky = new Sky();
	sky.scale.setScalar(45000); //设置缩放器规模大小
	scenee.add(sky);
	sun = new THREE.Vector3();
	/// GUI
	const effectController = {
		turbidity: 10, //浑浊度
		rayleigh: 3, //冷暖色-瑞利散射
		mieCoefficient: 0.005, //mie散射系数
		mieDirectionalG: 0.7, //mie定向G
		elevation: 2, //海拔
		azimuth: 180, //方位角
		exposure: renderer.toneMappingExposure //曝光
	};
	function guiChanged() {
		const uniforms = sky.material.uniforms;
		uniforms['turbidity'].value = effectController.turbidity;
		uniforms['rayleigh'].value = effectController.rayleigh;
		uniforms['mieCoefficient'].value = effectController.mieCoefficient;
		uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
		const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
		const theta = THREE.MathUtils.degToRad(effectController.azimuth);
		sun.setFromSphericalCoords(1, phi, theta);
		uniforms['sunPosition'].value.copy(sun);
		renderer.toneMappingExposure = effectController.exposure;
		renderer.render(scenee, cameraa);
	}
	const gui = new GUI();
	gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
	gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
	gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
	gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
	gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
	gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
	gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);
	guiChanged();
}
//----**----

document.querySelector('#rotateLeft').onclick = function() {
	detatheta = -0.1;
}
document.querySelector('#rotateRight').onclick = function() {
	detatheta = 0.1;
}
document.querySelector('#rotateStop').onclick = function() {
	detatheta = 0;
}

document.querySelector('#rotateSpeedUp').onclick = function() {
	detathetaSpeed = detathetaSpeed * 1.5;
}
document.querySelector('#rotateSpeedDown').onclick = function() {
	detathetaSpeed = detathetaSpeed / 1.5;
}
document.querySelector('#rotateSpeedBack').onclick = function() {
	detathetaSpeed = 1;
}

document.querySelector('#speedUp').onclick = function() {
	speed = speed * 1.5;
}
document.querySelector('#speedDown').onclick = function() {
	speed = speed / 1.5;
}
document.querySelector('#speedBack').onclick = function() {
	speed = 0.001;
}

document.querySelector('#cameraBack').onclick = function() {
	camera.position.y = 300;
}

document.querySelector('#start').onclick = function() {
	speed = 0.001;
	detatheta = -0.1;
}
document.querySelector('#stop').onclick = function() {
	speed = 0;
	detatheta = 0;
}

function init() {
	container = document.querySelector('#container');
	//
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.y = 300;
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);
	//
	const light1 = new THREE.DirectionalLight(0xefefff, 1.5);
	light1.position.set(1, 1, 1).normalize();
	scene.add(light1);
	const light2 = new THREE.DirectionalLight(0xffefef, 1.5);
	light2.position.set(-1, -1, -1).normalize();
	scene.add(light2);
	const loader = new GLTFLoader();
	loader.load("models/gltf/Horse.glb", function(gltf) {
		mesh = gltf.scene.children[0];
		mesh.scale.set(1.5, 1.5, 1.5);
		scene.add(mesh);
		mixer = new THREE.AnimationMixer(mesh);
		mixer.clipAction(gltf.animations[0]).setDuration(1).play();
	});
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	// renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	// container.appendChild(renderer.domElement);
	//
	stats = new Stats();
	container.appendChild(stats.dom);
	//----**----
	//铺设环境光源
	var ambientLight = new THREE.AmbientLight(0xeeeeee, 0.2);
	scene.add(ambientLight);
	//铺设点光源
	var pointLight = new THREE.PointLight(0x303030, 10.0);
	scene.add(camera);
	camera.add(pointLight);
	window.addEventListener('resize', onWindowResize);
	//----**----
	//----**背景渲染**----
	cameraa = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000000);
	cameraa.position.set(0, 100, 2000); //相机位置坐标（x，y，z）
	scenee = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染窗口的大小
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.5;
	document.body.appendChild(renderer.domElement);
	
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	controls.enableZoom = false;
	controls.enableRotate = false;
	controls.enablePan = true;
	const controls1 = new OrbitControls(cameraa, renderer.domElement);
	controls1.addEventListener('change', render);
	controls1.enableZoom = false;
	controls.enableRotate = true;
	controls1.enablePan = false;
	initSky();
	window.addEventListener('resize', onWindowResize);
	//----**----
	//----**调控光源**----
	changeLight(pointLight);
	//----**----
}
//定义鼠标挪动，鼠标起始位置
var flag = false;
var startY = 0;
var endY = 0;
var startX = 0;
var endX = 0;
document.querySelector('#container').addEventListener('mousedown', function(event) {
	flag = true;
	flagR = true;
});
document.querySelector('#container').addEventListener('mousemove', function(event) {
	if (flag) {
	}
});
document.querySelector('#container').addEventListener('mouseup', function(event) {
	flag = false;
});

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//----**----
	cameraa.aspect = window.innerWidth / window.innerHeight;
	cameraa.updateProjectionMatrix();
	render();
	//----**----
}

function animate() {
	requestAnimationFrame(animate);
	render();
	stats.update();
}

function render() {
	//旋转角度
	theta += detatheta * detathetaSpeed;
	camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
	camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
	//相机坐标
	camera.lookAt(cameraX, cameraY, cameraZ);
	if (mixer) {
		const time = Date.now();
		mixer.update((time - prevTime) * speed);
		prevTime = time;
	}
	renderer.render(scene, camera);
	renderer.autoClear = false;

	//----**----
	renderer.render(scenee, cameraa);
	//----**----
}

//----** 改变光源 **----
function changeLight(pointLight) {
	var lightChange = document.getElementById('lightColor');
	lightChange.onchange = function() {
		camera.remove(pointLight);
		pointLight = new THREE.PointLight(this.value, 10.0);
		camera.add(pointLight);
	}
}
//----**----
