import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x110000, 10, 40);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.05, 80);
scene.add(camera);

// ── AUDIO ─────────────────────────────────────
const audioListener = new THREE.AudioListener();
camera.add(audioListener);
const audioLoader = new THREE.AudioLoader();
const shootSound = new THREE.Audio(audioListener);
const reloadSound = new THREE.Audio(audioListener);
const stepSound = new THREE.Audio(audioListener);
const backgroundSound = new THREE.Audio(audioListener);

audioLoader.load('sounds/gun.mp3', (buffer) => { 
    shootSound.setBuffer(buffer); 
    shootSound.setVolume(0.5); 
});

audioLoader.load('sounds/reload.mp3', (buffer) => { 
    reloadSound.setBuffer(buffer); 
    reloadSound.setVolume(0.5); 
});

audioLoader.load('sounds/step.mp3', (buffer) => { 
    stepSound.setBuffer(buffer); 
    stepSound.setVolume(0.7); 
    stepSound.setLoop(true);
});

audioLoader.load('sounds/background.mp3', (buffer) => { 
    backgroundSound.setBuffer(buffer); 
    backgroundSound.setVolume(0.5); 
    backgroundSound.setLoop(true);
});

// ── POST-PROCESSING ────────────────────────────
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.0, 0.4, 0.85);
composer.addPass(bloomPass);
const filmPass = new FilmPass(0.35, 0.015, 648, false);
composer.addPass(filmPass);
const outputPass = new OutputPass();
composer.addPass(outputPass);

// ── DUNGEON MAPS ───────────────────────────────
const MAPS = [
    // ── LEVEL 1 — The Catacombs ─────────────────
    [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0],
    [0,1,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,1,0],
    [0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,1,0,0,5,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,7,0,0,0,1,0],
    [0,0,5,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,5,0,1,0],
    [0,1,6,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
    [0,0,0,0,1,0,0,5,0,0,0,1,0,0,0,0,0,0,1,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,7,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,6,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
    ],
    // ── LEVEL 2 — The Ossuary ───────────────────
    [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,1,0,1,1,1,1,1,0,0,0,1,1,1,1,5,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,0,5,0,1,1,1,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,7,0,1,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,0,5,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,0,1,0],
    [0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0],
    [0,1,0,1,0,5,1,1,1,1,1,1,1,0,0,1,0,0,1,0],
    [0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,7,1,0],
    [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
    ],
    // ── LEVEL 3 — The Depths ──────────────────
    [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,3,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,0],
    [0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1,0],
    [0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,1,0,1,0],
    [0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,0,1,0],
    [0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1,0,1,0],
    [0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0],
    [0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0],
    [0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0],
    [0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0],
    [0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0],
    [0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0],
    [0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0],
    [0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
    ],
];

let currentLevel = 0;
let MAP = MAPS[currentLevel];
let ROWS = MAP.length, COLS = MAP[0].length;
const CELL = 3;

// ── TEXTURES AND MATERIALS ──────────────────────
const stoneTex = (() => {
    const sz = 128;
    const data = new Uint8Array(sz * sz * 4);
    for (let i = 0; i < sz * sz; i++) {
    const v = 38 + Math.floor(Math.random() * 22);
    data[i*4]   = v; data[i*4+1] = v - 4; data[i*4+2] = v - 6; data[i*4+3] = 255;
    }
    for (let y = 0; y < sz; y++) {
    for (let x = 0; x < sz; x++) {
        const row = Math.floor(y / 12);
        const off = (row % 2) * 8;
        if (x % 16 === 0 || y % 12 === 0 || (x + off) % 16 === 0) {
        const i = y * sz + x;
        data[i*4] = 18; data[i*4+1] = 18; data[i*4+2] = 18; data[i*4+3] = 255;
        }
    }
    }
    const t = new THREE.DataTexture(data, sz, sz, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1); t.needsUpdate = true;
    return t;
})();

const floorTex = (() => {
    const sz = 128;
    const data = new Uint8Array(sz * sz * 4);
    for (let i = 0; i < sz * sz; i++) {
    const v = 28 + Math.floor(Math.random() * 14);
    data[i*4] = v; data[i*4+1] = v; data[i*4+2] = v - 2; data[i*4+3] = 255;
    }
    for (let y = 0; y < sz; y++) {
    for (let x = 0; x < sz; x++) {
        if (x % 20 == 0 || y % 20 == 0) {
        const i = y * sz + x;
        data[i*4] = 16; data[i*4+1] = 16; data[i*4+2] = 16; data[i*4+3] = 255;
        }
    }
    }
    const t = new THREE.DataTexture(data, sz, sz, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); t.needsUpdate = true;
    return t;
})();

const wallMat  = new THREE.MeshLambertMaterial({ map: stoneTex, color: 0xdddddd });
const floorMat = new THREE.MeshLambertMaterial({ map: floorTex, color: 0xbbbbbb });
const ceilMat  = new THREE.MeshLambertMaterial({ color: 0x333333 });
const exitMat  = new THREE.MeshLambertMaterial({ color: 0x004400, emissive: new THREE.Color(0x002200) });

// ── MONSTER MODELS & LOADING LOGIC ────────────
let smilyPrefab = null;
let smilyAnimations = [];

let chainsawPrefab = null;
let chainsawAnimations = [];

const loader = new GLTFLoader();

// Logic to only allow the game to start when the models are loaded
let modelsLoaded = 0;
function checkAssetsLoaded() {
    modelsLoaded++;
    const btn = document.getElementById('ov-btn');
    btn.textContent = `LOADING... (${modelsLoaded}/2)`;
    if (modelsLoaded >= 2) {
        btn.textContent = 'ENTER';
        btn.disabled = false;
    }
}

loader.load('models/smily_horror_monster/scene.gltf', (gltf) => {
    smilyPrefab = gltf.scene;
    smilyPrefab.scale.set(0.01, 0.01, 0.01); 
    smilyPrefab.traverse((child) => {
    if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
    
    // --- CUT THE GIANT SMILY ANIMATION ---
    const clipInteiro = gltf.animations[0];
    
    // INITIAL GUESS: Cut from frame 0 to 60 at 30fps. 
    // You'll have to test and adjust these numbers until you isolate the perfect "walk"!
    const walkClip = THREE.AnimationUtils.subclip(clipInteiro, 'SmilyWalk', 0, 60, 30);
    
    smilyAnimations = [walkClip];
    
    checkAssetsLoaded();
});

loader.load('models/chainsaw_brute_fps_creator/scene.gltf', (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const scale = 3 / size.y;
    model.scale.set(scale, scale, scale);

    const scaledBox = new THREE.Box3().setFromObject(model);
    model.position.y = -scaledBox.min.y; 
    
    chainsawPrefab = new THREE.Group();
    chainsawPrefab.add(model);
    
    chainsawPrefab.traverse((child) => {
    if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
    
    // --- CUT THE GIANT ANIMATION ---
    const clipInteiro = gltf.animations[0];
    
    // The default frame rate is usually 24 or 30 fps. Let's use 30.
    // We cut the perfect walking loop you discovered (410 to 510)
    const walkClip = THREE.AnimationUtils.subclip(clipInteiro, 'BruteWalk', 410, 510, 24);
    
    // We cut the part where he spots you (optional for you to use later)
    const alertClip = THREE.AnimationUtils.subclip(clipInteiro, 'BruteAlert', 410, 500, 30);

    // We keep only our new cut clips!
    chainsawAnimations = [walkClip, alertClip]; 
    
    checkAssetsLoaded();
});

// ── WEAPON VIEWMODEL ───────────────────────────
const weaponGroup = new THREE.Group();
camera.add(weaponGroup);

const gunGeo = new THREE.BoxGeometry(0.08, 0.12, 0.4);
const gunMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
const gunMesh = new THREE.Mesh(gunGeo, gunMat);
gunMesh.position.set(0.2, -0.25, -0.4); 
weaponGroup.add(gunMesh);

// ── BUILD DUNGEON (OPTIMIZED WITH MERGE) ────────
let collectibles = [];
let torches = [];
let dungeonMeshes = [];

function buildDungeon() {
    const wallGeo  = new THREE.BoxGeometry(CELL, CELL, CELL);
    const floorGeo = new THREE.PlaneGeometry(CELL, CELL);
    const ceilGeo  = new THREE.PlaneGeometry(CELL, CELL);

    const wallGeometries = [];
    const floorGeometries = [];
    const ceilGeometries = [];

    for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
        const v = MAP[row][col];
        const wx = col * CELL, wz = row * CELL;

        if (v === 0) {
        const geo = wallGeo.clone();
        geo.translate(wx, 0, wz);
        wallGeometries.push(geo);
        } else {
        const fGeo = floorGeo.clone();
        fGeo.rotateX(-Math.PI / 2); fGeo.translate(wx, -CELL / 2, wz);
        floorGeometries.push(fGeo);

        const cGeo = ceilGeo.clone();
        cGeo.rotateX(Math.PI / 2); cGeo.translate(wx, CELL / 2, wz);
        ceilGeometries.push(cGeo);

        if (v === 5) buildTorch(wx, wz, row, col);
        if (v === 6) buildPickup(wx, wz, 'health');
        if (v === 7) buildPickup(wx, wz, 'ammo');
        if (v === 4) buildExit(wx, wz);
        }
    }
    }

    if (wallGeometries.length) {
    const mergedWalls = BufferGeometryUtils.mergeGeometries(wallGeometries);
    const wallsMesh = new THREE.Mesh(mergedWalls, wallMat);
    wallsMesh.receiveShadow = true; scene.add(wallsMesh); dungeonMeshes.push(wallsMesh);
    }
    if (floorGeometries.length) {
    const mergedFloor = BufferGeometryUtils.mergeGeometries(floorGeometries);
    const floorMesh = new THREE.Mesh(mergedFloor, floorMat);
    floorMesh.receiveShadow = true; scene.add(floorMesh); dungeonMeshes.push(floorMesh);
    }
    if (ceilGeometries.length) {
    const mergedCeil = BufferGeometryUtils.mergeGeometries(ceilGeometries);
    const ceilMesh = new THREE.Mesh(mergedCeil, ceilMat);
    scene.add(ceilMesh); dungeonMeshes.push(ceilMesh);
    }
}

function buildTorch(wx, wz, row, col) {
    const g = new THREE.Group();
    let px = wx; let pz = wz; const offset = 1.4; 

    if (row > 0 && MAP[row - 1][col] === 0) pz = wz - offset;
    else if (row < ROWS - 1 && MAP[row + 1][col] === 0) pz = wz + offset;
    else if (col > 0 && MAP[row][col - 1] === 0) px = wx - offset;
    else if (col < COLS - 1 && MAP[row][col + 1] === 0) px = wx + offset;

    g.position.set(px, 0.4, pz);
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), new THREE.MeshLambertMaterial({ color: 0x554433 }));
    g.add(bracket);
    const light = new THREE.PointLight(0xff6600, 10, 16); light.position.y = 0.5; g.add(light);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 6), new THREE.MeshBasicMaterial({ color: 0xff9900 }));
    flame.position.y = 0.5; g.add(flame);
    scene.add(g); dungeonMeshes.push(g);
    torches.push({ light, flame, baseIntensity: 10, phase: Math.random() * Math.PI * 2 });
}

function buildPickup(wx, wz, type) {
    const geo = type === 'health' ? new THREE.SphereGeometry(0.18, 8, 6) : new THREE.BoxGeometry(0.22, 0.14, 0.12);
    const mat = new THREE.MeshLambertMaterial({
    color: type === 'health' ? 0xff1144 : 0xffbb00,
    emissive: new THREE.Color(type === 'health' ? 0x440011 : 0x332200)
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(wx, -CELL / 2 + 0.22, wz);
    scene.add(mesh); dungeonMeshes.push(mesh);
    collectibles.push({ mesh, type, wx, wz, active: true });
}

function buildExit(wx, wz) {
    const geo = new THREE.BoxGeometry(CELL * 0.8, CELL * 0.9, 0.2);
    const m = new THREE.Mesh(geo, exitMat);
    m.position.set(wx, 0, wz); scene.add(m);
    const l = new THREE.PointLight(0x00ff44, 3, 8);
    l.position.set(wx, 0, wz); scene.add(l); dungeonMeshes.push(l);
}

buildDungeon();
scene.add(new THREE.AmbientLight(0x554444, 3.5));

// ── PLAYER STATE ───────────────────────────────
const P = {
    hp: 100, maxHp: 100, ammo: 6, reserve: 48, score: 0, totalKills: 0,
    yaw: 0, pitch: 0, vx: 0, vz: 0, dead: false, won: false,
    reloading: false, reloadTimer: 0, RELOAD_TIME: 1.8,
    shootCooldown: 0, bobPhase: 0, bobAmt: 0,
};

// ── ENEMIES ────────────────────────────────────
const ENEMY_DATA = {
    grunt:  { hp: 40,  speed: 1.8, dmg: 8,  range: 1.2, score: 100 },
    brute:  { hp: 100, speed: 1.1, dmg: 18, range: 1.5, score: 250 },
};

const enemies = [];
let wave = 0, waveKills = 0, waveTotal = 0;
let waveTimer = 0, waitingForWave = false;

function spawnEnemy(type, wx, wz) {
    const d = ENEMY_DATA[type];
    let mesh;
    let mixer = null;

    let prefabToUse = type === 'brute' ? chainsawPrefab : smilyPrefab;
    let animsToUse = type === 'brute' ? chainsawAnimations : smilyAnimations;

    if (!prefabToUse) return; // Totally prevents spawning without a model!

    mesh = SkeletonUtils.clone(prefabToUse);
    mesh.position.set(wx, -CELL / 2, wz);

    if (animsToUse.length > 0) {
    mixer = new THREE.AnimationMixer(mesh);
    
    let animName = type === 'brute' ? 'BruteWalk' : 'SmilyWalk';  
    
    const clip = THREE.AnimationClip.findByName(animsToUse, animName);
    
    if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    } else {
        // Failsafe: plays the first one it finds
        const action = mixer.clipAction(animsToUse[0]);
        action.play();
    }
    }

    scene.add(mesh);

    enemies.push({
    mesh, mixer, type, hp: d.hp, maxHp: d.hp,
    speed: d.speed, dmg: d.dmg, range: d.range, score: d.score,
    wx, wz, active: true, attackCooldown: 0, alertRange: 10,
    phase: Math.random() * Math.PI * 2, stagger: 0,
    originalEmissive: new THREE.Color(0x000000),
    path: [], pathUpdateTimer: 0 
    });
}

function getReachableCells() {
    let startR = -1, startC = -1;
    for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) { if (MAP[r][c] === 3) { startR = r; startC = c; break; } }
    if (startR !== -1) break;
    }
    if (startR === -1) return null;

    const visited = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
    const queue = [[startR, startC]]; visited[startR][startC] = true;
    const reachable = new Set(); const dirs = [[-1,0],[1,0],[0,-1],[0,1]];

    while (queue.length) {
    const [r, c] = queue.shift(); reachable.add(r * COLS + c);
    for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (visited[nr][nc] || MAP[nr][nc] === 0) continue;
        visited[nr][nc] = true; queue.push([nr, nc]);
    }
    }
    return reachable;
}

function spawnWave() {
    wave++;
    const positions = [];
    const reachable = getReachableCells();

    for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const v = MAP[r][c];
        if (v < 1 || v === 3) continue;
        if (reachable && !reachable.has(r * COLS + c)) continue;
        const wx = c * CELL, wz = r * CELL;
        const dx = wx - camera.position.x, dz = wz - camera.position.z;
        if (Math.sqrt(dx*dx + dz*dz) > 12) positions.push([wx, wz]);
    }
    }

    shuffle(positions);
    const count = currentLevel >= 2 ? Math.min(positions.length, 8 + wave * 3) : 3 + wave * 2;
    waveTotal = count; waveKills = 0;

    for (let i = 0; i < Math.min(count, positions.length); i++) {
    const [wx, wz] = positions[i];
    let type;
    if (currentLevel >= 2) {
        type = 'brute';
    } else {
        // Removed the 'wraith' type. Now it only generates 'brute' or 'grunt' (the ones with 3D models)
        const r = Math.random();
        type = r < 0.35 ? 'brute' : 'grunt'; 
    }
    spawnEnemy(type, wx, wz);
    }

    document.getElementById('wave-num').textContent = `LEVEL ${currentLevel + 1} · WAVE ${wave}`;
    killFeed(`WAVE ${wave} — ${count} ENEMIES`);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
    }
}

const playerLight = new THREE.PointLight(0xffaa55, 10, 16);
camera.add(playerLight);

const raycaster = new THREE.Raycaster();
const bulletHoles = [];

function shoot() {
    if (P.dead || P.won) return;
    if (P.reloading) { sysMsg('Reloading...'); return; }
    if (P.ammo <= 0) { tryReload(); return; }
    if (P.shootCooldown > 0) return;

    P.ammo--; P.shootCooldown = 0.18;
    updateAmmoHUD();
    triggerMuzzleFlash();

    if (shootSound.buffer) {
    if (shootSound.isPlaying) shootSound.stop();
    shootSound.play();
    }

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(enemies.filter(e => e.active).map(e => e.mesh), true);

    if (hits.length) {
    const hit = hits[0];
    let target = null;

    for (const e of enemies) {
        if (!e.active) continue;
        let currentObj = hit.object;
        while (currentObj) { if (currentObj === e.mesh) { target = e; break; } currentObj = currentObj.parent; }
        if (target) break;
    }

    if (target) {
        const hitHeight = hit.point.y - target.mesh.position.y;
        const isHeadshot = hitHeight > 1.0; 
        const multiplier = isHeadshot ? 2 : 1;

        const dmg = (15 + Math.floor(Math.random() * 20)) * multiplier;
        target.hp -= dmg; target.stagger = 0.3;
        spawnDamageNum(target.mesh.position.clone(), dmg);
        
        if (isHeadshot) {
        const feed = document.getElementById('killfeed');
        const d = document.createElement('div'); d.className = 'kf-line kf-headshot'; d.textContent = 'CRITICAL HIT';
        feed.prepend(d); setTimeout(() => { d.style.opacity = '0'; setTimeout(() => d.remove(), 1000); }, 2000);
        }
        if (target.hp <= 0) killEnemy(target);
    }
    spawnBulletHole(hit.point, hit.face?.normal || new THREE.Vector3(0, 1, 0));
    }
    if (P.ammo === 0) setTimeout(tryReload, 200);
}

function killEnemy(e) {
    e.active = false; scene.remove(e.mesh);
    P.score += e.score; P.totalKills++; waveKills++;
    killFeed('+' + e.score + ' // ' + e.type.toUpperCase() + ' ELIMINATED');
    updateScoreHUD();
    if (P.totalKills % 10 === 0) { P.reserve = Math.min(72, P.reserve + 15); updateAmmoHUD(); killFeed('// ' + P.totalKills + ' KILLS — +15 ROUNDS'); }
    if (waveKills >= waveTotal) {
    if (currentLevel >= 2) { killFeed('// THE PATH IS CLEAR. FIND THE EXIT.'); document.getElementById('wave-num').textContent = 'ESCAPE. NOW.'; } 
    else { waitingForWave = true; waveTimer = 10.0; }
    }
}

function tryReload() {
    if (P.reloading || P.reserve <= 0 || P.ammo === 6) return;
    if (reloadSound.buffer) {
    if (reloadSound.isPlaying) reloadSound.stop();
    reloadSound.play();
    }
    P.reloading = true; P.reloadTimer = 0; document.getElementById('reload-bar-wrap').style.display = 'block';
}

function spawnBulletHole(pos, normal) {
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.04, 6), new THREE.MeshBasicMaterial({ color: 0x111111, depthWrite: false }));
    m.position.copy(pos).addScaledVector(normal, 0.01); m.lookAt(pos.clone().add(normal));
    scene.add(m); bulletHoles.push(m);
    if (bulletHoles.length > 30) { scene.remove(bulletHoles.shift()); }
}

function spawnDamageNum(pos, val) { flashDamage(false); }

// ── INPUT ──────────────────────────────────────
const keys = {};
document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyS' && e.shiftKey && gameStarted && !P.dead) {
    if (currentLevel + 1 < MAPS.length) { P.won = true; triggerLevelTransition(); } 
    else { P.won = true; endGame(true); }
    }
    if (e.code === 'KeyR') tryReload();
});
document.addEventListener('keyup', e => keys[e.code] = false);

let locked = false;
canvas.addEventListener('click', () => { 
    if (!gameStarted) return; 
    canvas.requestPointerLock(); 
    // Ensures the sound unlocks mid-game if needed:
    if (audioListener.context.state === 'suspended') audioListener.context.resume();

    if (backgroundSound.buffer && !backgroundSound.isPlaying) {
    backgroundSound.play();
    }
});

document.addEventListener('pointerlockchange', () => {
    locked = document.pointerLockElement === canvas;
    document.getElementById('lock-msg').style.display = locked ? 'none' : 'block';
});

document.addEventListener('mousemove', e => {
    if (!locked || P.dead || P.won) return;
    P.yaw -= e.movementX * 0.0022; P.pitch -= e.movementY * 0.0022;
    P.pitch = Math.max(-1.1, Math.min(0.6, P.pitch));
});

document.addEventListener('mousedown', e => { if (e.button === 0 && locked) shoot(); });

// ── COLLISION & MOVEMENT ───────────────────────
function isSolid(wx, wz) {
    const col = Math.floor(wx / CELL + 0.5); const row = Math.floor(wz / CELL + 0.5);
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return true;
    return MAP[row][col] === 0;
}

const PLAYER_RADIUS = 0.42;
function isWall(wx, wz) { return isSolid(wx - PLAYER_RADIUS, wz - PLAYER_RADIUS) || isSolid(wx + PLAYER_RADIUS, wz - PLAYER_RADIUS) || isSolid(wx - PLAYER_RADIUS, wz + PLAYER_RADIUS) || isSolid(wx + PLAYER_RADIUS, wz + PLAYER_RADIUS); }

const MONSTER_RADIUS = 1.15; 
function isMonsterWall(wx, wz) { return isSolid(wx - MONSTER_RADIUS, wz - MONSTER_RADIUS) || isSolid(wx + MONSTER_RADIUS, wz - MONSTER_RADIUS) || isSolid(wx - MONSTER_RADIUS, wz + MONSTER_RADIUS) || isSolid(wx + MONSTER_RADIUS, wz + MONSTER_RADIUS); }

function movePlayer(dt) {
    if (P.dead || P.won) return;
    const speed = (keys['ShiftLeft'] || keys['ShiftRight']) ? 5.5 : 3.0;
    const fwd = new THREE.Vector3(-Math.sin(P.yaw), 0, -Math.cos(P.yaw));
    const right = new THREE.Vector3(Math.cos(P.yaw), 0, -Math.sin(P.yaw));
    const move = new THREE.Vector3();

    if (keys['KeyW'] || keys['ArrowUp']) move.addScaledVector(fwd, 1);
    if (keys['KeyS'] || keys['ArrowDown']) move.addScaledVector(fwd, -1);
    if (keys['KeyA'] || keys['ArrowLeft']) move.addScaledVector(right, -1);
    if (keys['KeyD'] || keys['ArrowRight']) move.addScaledVector(right, 1);

    const moving = move.lengthSq() > 0;
    if (moving) move.normalize();

    if (moving) { 
    P.bobPhase += dt * 7 * (speed > 4 ? 1.4 : 1); 
    P.bobAmt = Math.min(P.bobAmt + dt * 8, 1);

    if (stepSound.buffer && !stepSound.isPlaying) {
        stepSound.play();
    }
    stepSound.setPlaybackRate(speed > 4 ? 1.4 : 1.0);
    
    } 
    else { 
    P.bobAmt = Math.max(P.bobAmt - dt * 6, 0); 
    
    if (stepSound.isPlaying) {
        stepSound.pause();
    }
    }

    const nx = camera.position.x + move.x * speed * dt;
    const nz = camera.position.z + move.z * speed * dt;

    if (!isWall(nx, camera.position.z)) camera.position.x = nx;
    if (!isWall(camera.position.x, nz)) camera.position.z = nz;

    camera.position.y = 0.65 + Math.sin(P.bobPhase) * 0.045 * P.bobAmt;
    camera.rotation.order = 'YXZ'; camera.rotation.y = P.yaw;
    camera.rotation.x = P.pitch + Math.cos(P.bobPhase * 0.5) * 0.01 * P.bobAmt;
    camera.rotation.z = Math.sin(P.bobPhase) * 0.006 * P.bobAmt;

    weaponGroup.position.x = THREE.MathUtils.lerp(weaponGroup.position.x, move.x * 0.05, 0.1);
    weaponGroup.position.y = THREE.MathUtils.lerp(weaponGroup.position.y, -0.25 + Math.sin(P.bobPhase)*0.015, 0.1);
    gunMesh.position.z = THREE.MathUtils.lerp(gunMesh.position.z, -0.4, 0.1);
    gunMesh.rotation.x = THREE.MathUtils.lerp(gunMesh.rotation.x, 0, 0.1);

    for (const col of collectibles) {
    if (!col.active) continue;
    const dx = camera.position.x - col.wx, dz = camera.position.z - col.wz;
    if (Math.sqrt(dx*dx + dz*dz) < 1.2) {
        col.active = false; scene.remove(col.mesh);
        if (col.type === 'health') { P.hp = Math.min(P.maxHp, P.hp + 30); updateHealthHUD(); killFeed('+30 HEALTH'); } 
        else { P.reserve = Math.min(72, P.reserve + 12); updateAmmoHUD(); killFeed('+12 AMMO'); }
    }
    }

    for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        if (MAP[r][c] === 4) {
        const ex = c * CELL, ez = r * CELL;
        const dx2 = camera.position.x - ex, dz2 = camera.position.z - ez;
        if (Math.sqrt(dx2*dx2 + dz2*dz2) < 2.5 && enemies.filter(e => e.active).length === 0) {
            P.won = true;
            if (currentLevel + 1 < MAPS.length) triggerLevelTransition();
            else endGame(true);
        }
        }
    }
    }
}

// ── PATHFINDING A* & ENEMIES ───────────────────
function heuristic(r1, c1, r2, c2) { return Math.abs(r1 - r2) + Math.abs(c1 - c2); }

function aStar(startR, startC, targetR, targetC) {
    const open = [{r: startR, c: startC, f: 0, g: 0, parent: null}];
    const closed = new Set(); const dirs = [[-1,0], [1,0], [0,-1], [0,1]];

    while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift(); const id = `${current.r},${current.c}`;
    
    if (current.r === targetR && current.c === targetC) {
        const path = []; let curr = current;
        while(curr.parent) { path.unshift({r: curr.r, c: curr.c}); curr = curr.parent; }
        return path;
    }
    closed.add(id);

    for (const [dr, dc] of dirs) {
        const nr = current.r + dr; const nc = current.c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || MAP[nr][nc] === 0) continue;
        const nid = `${nr},${nc}`; if (closed.has(nid)) continue;

        const g = current.g + 1; const h = heuristic(nr, nc, targetR, targetC); const f = g + h;
        const existing = open.find(n => n.r === nr && n.c === nc);
        if (!existing) open.push({r: nr, c: nc, f, g, parent: current});
        else if (g < existing.g) { existing.g = g; existing.f = f; existing.parent = current; }
    }
    }
    return null;
}

function updateEnemies(dt) {
    const pR = Math.floor(camera.position.z / CELL + 0.5); const pC = Math.floor(camera.position.x / CELL + 0.5);

    for (const e of enemies) {
    if (!e.active) continue;
    if (e.mixer) e.mixer.update(dt);

    if (e.stagger > 0) {
        e.stagger -= dt;
        e.mesh.traverse((child) => { if (child.isMesh && child.material && child.material.emissive) child.material.emissive.setHex(0xff4400); });
        continue;
    }

    e.mesh.traverse((child) => {
        if (child.isMesh && child.material && child.material.emissive) child.material.emissive.setHex(e.originalEmissive.getHex()); 
    });

    const dx = camera.position.x - e.mesh.position.x; const dz = camera.position.z - e.mesh.position.z;
    const dist = Math.sqrt(dx*dx + dz*dz);

    e.pathUpdateTimer -= dt;
    if (e.pathUpdateTimer <= 0 && dist < e.alertRange) {
        const eR = Math.floor(e.mesh.position.z / CELL + 0.5); const eC = Math.floor(e.mesh.position.x / CELL + 0.5);
        e.path = aStar(eR, eC, pR, pC); e.pathUpdateTimer = 0.5;
    }

    if (dist < e.alertRange) {
        let dirX = dx, dirZ = dz; 
        if (e.path && e.path.length > 0 && dist > CELL) {
        const nextNode = e.path[0];
        dirX = (nextNode.c * CELL) - e.mesh.position.x; dirZ = (nextNode.r * CELL) - e.mesh.position.z;
        if(Math.sqrt(dirX*dirX + dirZ*dirZ) < 0.5) e.path.shift();
        }

        const moveDist = Math.sqrt(dirX*dirX + dirZ*dirZ);
        if (moveDist > 0.1) {
        const nx = e.mesh.position.x + (dirX / moveDist) * e.speed * dt; const nz = e.mesh.position.z + (dirZ / moveDist) * e.speed * dt;
        if (!isMonsterWall(nx, e.mesh.position.z)) e.mesh.position.x = nx;
        if (!isMonsterWall(e.mesh.position.x, nz)) e.mesh.position.z = nz;
        e.mesh.rotation.y = Math.atan2(dirX, dirZ);
        }
        if (dist < e.range && e.attackCooldown <= 0) { e.attackCooldown = 1.4; takeDamage(e.dmg); }
    }
    if (e.attackCooldown > 0) e.attackCooldown -= dt;
    }
}

function takeDamage(dmg) {
    if (P.dead) return;
    P.hp = Math.max(0, P.hp - dmg); updateHealthHUD(); flashDamage(true);
    if (P.hp <= 0) { P.dead = true; setTimeout(() => endGame(false), 1200); }
}

let muzzleTimer = 0;
const muzzleLight = new THREE.PointLight(0xffaa00, 0, 3);
camera.add(muzzleLight); muzzleLight.position.set(0, 0, -1.2);

function triggerMuzzleFlash() {
    muzzleLight.intensity = 8; muzzleTimer = 0.06; P.pitch += 0.04; setTimeout(() => P.pitch -= 0.035, 80);
    gunMesh.position.z += 0.15; gunMesh.rotation.x -= 0.2;
}

function updateReload(dt) {
    if (!P.reloading) return;
    P.reloadTimer += dt; const pct = Math.min(1, P.reloadTimer / P.RELOAD_TIME);
    document.getElementById('reload-fill').style.width = (pct * 100) + '%';

    if (P.reloadTimer >= P.RELOAD_TIME) {
    const need = 6 - P.ammo; const take = Math.min(need, P.reserve);
    P.ammo += take; P.reserve -= take; P.reloading = false;
    document.getElementById('reload-bar-wrap').style.display = 'none'; document.getElementById('reload-fill').style.width = '0%';
    updateAmmoHUD();
    }
}

function updateHealthHUD() {
    const pct = P.hp / P.maxHp; document.getElementById('health-fill').style.width = (pct * 100) + '%'; document.getElementById('health-num').textContent = P.hp;
    document.getElementById('health-fill').style.background = pct > 0.5 ? 'linear-gradient(90deg,#aa0000,#ff3333)' : pct > 0.25 ? 'linear-gradient(90deg,#aa2200,#ff5500)' : 'linear-gradient(90deg,#660000,#ff1111)';
}

function updateAmmoHUD() { document.getElementById('ammo-cur').textContent = P.ammo; document.getElementById('ammo-total').textContent = '/ ' + P.reserve; }
function updateScoreHUD() { document.getElementById('score-num').textContent = P.score + ' pts'; }

function updateWaveStatus(dt) {
    const aliveEl = document.getElementById('enemies-alive'); const timerEl = document.getElementById('wave-timer');
    if (waitingForWave) {
    waveTimer -= dt; aliveEl.style.display = 'none'; timerEl.style.display = 'block'; timerEl.textContent = 'NEXT WAVE IN: ' + Math.max(0, waveTimer).toFixed(1) + 's';
    if (waveTimer <= 0) { waitingForWave = false; timerEl.style.display = 'none'; aliveEl.style.display = 'block'; spawnWave(); }
    } else { aliveEl.style.display = 'block'; timerEl.style.display = 'none'; aliveEl.textContent = 'ENEMIES ALIVE: ' + (waveTotal - waveKills); }
}

let flashTimer = 0;
function flashDamage(enemy) { document.getElementById('dmg-flash').style.background = enemy ? 'rgba(200,0,0,0.35)' : 'rgba(255,255,0,0.1)'; flashTimer = 0.12; }

function killFeed(msg) {
    const feed = document.getElementById('killfeed'); const d = document.createElement('div');
    d.className = 'kf-line'; d.textContent = msg; feed.prepend(d);
    setTimeout(() => { d.style.opacity = '0'; setTimeout(() => d.remove(), 1000); }, 3000);
    while (feed.children.length > 5) feed.lastChild.remove();
}
function sysMsg(msg) { killFeed('// ' + msg); }

const mmCtx = document.getElementById('mm-canvas').getContext('2d');
function drawMinimap() {
    const W = 88, H = 88; mmCtx.fillStyle = '#000'; mmCtx.fillRect(0, 0, W, H);
    const px = camera.position.x / CELL, pz = camera.position.z / CELL; const view = 8;

    for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const v = MAP[r][c]; if (Math.abs(c - px) > view || Math.abs(r - pz) > view) continue;
        const sx = (c - px + view) / (view * 2) * W; const sy = (r - pz + view) / (view * 2) * H; const ss = W / (view * 2);
        if (v === 0) mmCtx.fillStyle = '#220a0a'; else if (v === 4) mmCtx.fillStyle = '#005500'; else mmCtx.fillStyle = '#3a2020';
        mmCtx.fillRect(sx, sy, ss, ss);
    }
    }

    for (const e of enemies) {
    if (!e.active) continue;
    const ec = e.mesh.position.x / CELL, er = e.mesh.position.z / CELL;
    const sx = (ec - px + view) / (view * 2) * W; const sy = (er - pz + view) / (view * 2) * H;
    mmCtx.fillStyle = '#ff3333'; mmCtx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
    }

    mmCtx.fillStyle = '#fff'; mmCtx.beginPath(); mmCtx.arc(W / 2, H / 2, 3, 0, Math.PI * 2); mmCtx.fill();
    mmCtx.strokeStyle = 'rgba(255,255,255,0.6)'; mmCtx.lineWidth = 1.5; mmCtx.beginPath();
    mmCtx.moveTo(W / 2, H / 2); mmCtx.lineTo(W / 2 - Math.sin(P.yaw) * 8, H / 2 - Math.cos(P.yaw) * 8); mmCtx.stroke();
    const rg = mmCtx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W / 2);
    rg.addColorStop(0, 'transparent'); rg.addColorStop(1, 'rgba(0,0,0,0.6)'); mmCtx.fillStyle = rg; mmCtx.fillRect(0, 0, W, H);
}

const clock = new THREE.Timer(); let gameStarted = false, animating = false;

function gameLoop() {
    if (!animating) return;
    requestAnimationFrame(gameLoop); clock.update(); const dt = Math.min(clock.getDelta(), 0.05); const t = clock.getElapsed();

    if (!P.dead && !P.won) { movePlayer(dt); updateEnemies(dt); updateReload(dt); updateWaveStatus(dt); }
    if (P.shootCooldown > 0) P.shootCooldown -= dt;
    if (muzzleTimer > 0) { muzzleTimer -= dt; if (muzzleTimer <= 0) muzzleLight.intensity = 0; }
    if (flashTimer > 0) { flashTimer -= dt; if (flashTimer <= 0) document.getElementById('dmg-flash').style.background = 'rgba(0,0,0,0)'; }

    for (const t2 of torches) {
    const f = Math.sin(Date.now() * 0.007 + t2.phase) * 0.4 + Math.sin(Date.now() * 0.019 + t2.phase) * 0.2;
    t2.light.intensity = t2.baseIntensity + f; t2.light.color.setHex(f > 0.2 ? 0xff7700 : 0xff5500);
    }
    for (const col of collectibles) { if (col.active) col.mesh.position.y = -CELL / 2 + 0.22 + Math.sin(t * 2 + col.wx) * 0.05; }
    drawMinimap(); composer.render();
}

function startGame() {
    // SOUND SAFETY INSTRUCTION: Unlocks the audio on the first real click!
    if (audioListener.context.state === 'suspended') {
    audioListener.context.resume();
    }

    document.getElementById('overlay').classList.add('hidden');
    gameStarted = true; animating = true; clock.update();
    for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { if (MAP[r][c] === 3) { camera.position.set(c * CELL, 0.65, r * CELL); break; } } }
        audioLoader.load('sounds/background.mp3', (buffer) => {
        backgroundSound.setBuffer(buffer);
        backgroundSound.setVolume(0.5);
        backgroundSound.setLoop(true);
        backgroundSound.play();
    });
    spawnWave(); gameLoop(); document.getElementById('lock-msg').style.display = 'block';
}

function triggerLevelTransition() {
    animating = false; const flash = document.getElementById('level-flash'); const title = document.getElementById('level-title'); const sub = document.getElementById('level-sub');
    currentLevel++; MAP = MAPS[currentLevel]; ROWS = MAP.length; COLS = MAP[0].length;
    title.textContent = `LEVEL ${currentLevel + 1}`; const levelNames = ['THE CATACOMBS', 'THE OSSUARY', 'THE DEPTHS']; sub.textContent = levelNames[currentLevel] || 'DEEPER';
    flash.style.transition = 'opacity 0.6s'; flash.style.opacity = '1';

    setTimeout(() => {
    for (const m of dungeonMeshes) scene.remove(m); dungeonMeshes = []; collectibles = []; torches = [];
    for (const e of enemies) scene.remove(e.mesh); enemies.length = 0; wave = 0; waveKills = 0; waveTotal = 0; waitingForWave = false; waveTimer = 0;
    for (const h of bulletHoles) scene.remove(h); bulletHoles.length = 0;
    if (currentLevel >= 2) { scene.fog = new THREE.Fog(0x220000, 4, 18); scene.background = new THREE.Color(0x110000); } 
    else { scene.fog.near = 6; scene.fog.far = 28; }
    buildDungeon(); P.dead = false; P.won = false;
    for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { if (MAP[r][c] === 3) { camera.position.set(c * CELL, 0.65, r * CELL); P.yaw = 0; P.pitch = 0; break; } } }
    spawnWave();
    setTimeout(() => { flash.style.transition = 'opacity 1.2s'; flash.style.opacity = '0'; animating = true; clock.update(); gameLoop(); }, 1400);
    }, 700);
}

function endGame(won) {
    animating = false; const ov = document.getElementById('overlay'); ov.classList.remove('hidden');
    document.getElementById('ov-title').textContent = won ? 'ESCAPED' : 'YOU DIED'; document.getElementById('ov-title').style.color = won ? '#008800' : '#cc2222';
    const levelNames = ['THE CATACOMBS', 'THE OSSUARY', 'THE DEPTHS'];
    document.getElementById('ov-sub').textContent = won ? `You escaped all ${MAPS.length} levels.\nWave ${wave} · Score: ${P.score}` : `Devoured in ${levelNames[currentLevel] || 'the depths'}.\nLevel ${currentLevel + 1} · Wave ${wave} · Score: ${P.score}`;
    document.getElementById('ov-score').style.display = 'block'; document.getElementById('ov-score').textContent = P.score + ' pts';
    document.getElementById('ov-btn').textContent = 'TRY AGAIN'; document.getElementById('ov-btn').onclick = () => location.reload();
    if (document.pointerLockElement) document.exitPointerLock();
}

window.addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); });

window.startGame = startGame;