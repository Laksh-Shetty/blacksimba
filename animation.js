import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { onLoadingComplete } from './main.js';

let scene, camera, renderer, composer;
let clock = new THREE.Clock();
let mixer;
let particles = [];
let canModel;
let liquidParticles = [];
let logoGeometry;
let isLowPerformance = false;
let frameCount = 0;
let lastTime = 0;
let fps = 0;
const canvas = document.getElementById('intro-canvas');

init();

function init() {
    checkPerformance();
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F0E0C);
    scene.fog = new THREE.FogExp2(0x0F0E0C, 0.002);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isLowPerformance,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isLowPerformance ? 1 : window.devicePixelRatio);
    renderer.shadowMap.enabled = !isLowPerformance;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    addLights();
    setupPostProcessing();
    createEnvironment();
    loadAssets();
    window.addEventListener('resize', onWindowResize);
    animate();
}
function checkPerformance() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowPixelRatio = window.devicePixelRatio < 2;
    isLowPerformance = isMobile || hasLowPixelRatio;
    if (isLowPerformance) {
        console.log('Low performance mode enabled');
    }
}

function addLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const orangeLight = new THREE.PointLight(0xe65b07, 3, 20);
    orangeLight.position.set(-5, 2, -3);
    scene.add(orangeLight);
    const secondaryLight = new THREE.PointLight(0xb34605, 3, 20);
    secondaryLight.position.set(5, 0, -2);
    scene.add(secondaryLight);
    const spotlight = new THREE.SpotLight(0xffffff, 2, 30, Math.PI / 6, 0.5, 1);
    spotlight.position.set(0, 10, 5);
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);
}

function setupPostProcessing() {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.7,
        0.3,
        0.7
    );
    composer.addPass(bloomPass);
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(
        1 / (window.innerWidth * renderer.getPixelRatio()),
        1 / (window.innerHeight * renderer.getPixelRatio())
    );
    composer.addPass(fxaaPass);
}
