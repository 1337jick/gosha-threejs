// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// import typefaceFont from '/src/static/assets/fonts/font.json';

export default (element) => {
    function init() {
        /**
         * Base
         */

        // Canvas
        const canvas = document.querySelector('canvas.js-scene');

        // Scene
        const scene = new THREE.Scene();



        const material = new THREE.MeshNormalMaterial({wireframe: false})

        // load font
        const fontLoader = new FontLoader()
        fontLoader.load('/assets/fonts/fira.json', (font) => {
            const textGeometry = new TextGeometry(
                'Gosha',
                {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            )
 
            
            const text = new THREE.Mesh(textGeometry, material)

            textGeometry.computeBoundingBox()
            scene.add(text)


            textGeometry.center()
        });


        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

        for(let i = 0; i < 200; i++) {

            const donut = new THREE.Mesh(donutGeometry, material)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }

       



        /**
         * Object
         */


        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            // Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.x = 1;
        camera.position.y = 1;
        camera.position.z = 2;
        scene.add(camera);

        // Controls
        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        

        let orbit;

        document.addEventListener('mousemove', function(e){
            let scale = -0.001;

 
            camera.rotation.y =  e.movementX * scale
            camera.rotation.x = e.movementY * scale
            camera.rotation.z = 0; //this is important to keep the camera level..
        })
        camera.rotation.order = "YXZ"
        

        

        const tick = () => {
            // Update controls
            controls.update();

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        };

        tick();
    }

    init();
};
