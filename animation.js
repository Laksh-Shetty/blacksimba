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
