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
