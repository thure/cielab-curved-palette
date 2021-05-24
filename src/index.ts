import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let mesh;
let renderer;
let scene;
let camera;
let controls;

window.addEventListener( 'resize', onWindowResize, false );

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  const material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  controls = new OrbitControls( camera, renderer.domElement );

  document.body.appendChild( renderer.domElement );

}

function animate() {

  renderer.render( scene, camera );

  requestAnimationFrame( animate );

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
