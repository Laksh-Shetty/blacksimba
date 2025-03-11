const loaderContainer = document.querySelector('.loader-container');
const progressBar = document.querySelector('.progress');
const introContainer = document.getElementById('intro-container'); 
const mainContent = document.querySelector('.main-content');
const enterBtn = document.querySelector('.enter-btn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const contactForm = document.getElementById('contactForm');

const assetsToLoad = [
    { type: 'image', path: '/img/logo.png' },
    { type: 'image', path: '/img/background.jpg' },
    { type: 'image', path: '/img/texture1.jpg' },
    { type: 'image', path: '/img/texture2.jpg' },
    { type: 'model', path: '/models/can.glb' }
];

let loadedItems = 0;
const totalItems = assetsToLoad.length || 10;
let isLoaded = false;
let loadingComplete = false;

document.addEventListener('DOMContentLoaded', () => {
    startLoading();
    setupEventListeners();
    handleVisibilityChange();
});

function startLoading() {
    if (assetsToLoad.length === 0) {
        simulateLoading();
    } else {
        loadAssets();
    }
}
function loadAssets() {
    assetsToLoad.forEach(asset => {
        switch(asset.type) {
            case 'image':
                const img = new Image();
                img.onload = () => assetLoaded();
                img.onerror = () => assetLoaded();
                img.src = asset.path;
                break;
            case 'model':
                setTimeout(() => assetLoaded(), 500);
                break;
            default:
                assetLoaded();
        }
    });
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
