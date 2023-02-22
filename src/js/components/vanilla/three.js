// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import vertex from 'models/utils/shader/vertex.glsl';
import fragment from 'models/utils/shader/fragment.glsl';
import vertex1 from 'models/utils/shader/vertex1.glsl';
import fragment1 from 'models/utils/shader/fragment1.glsl';

export default (element) => {
    // Canvas
    const canvas = element.querySelector('canvas.js-scene');


    console.log(vertex);
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };


    const params = {
        progress: 0,
        exposure: 1.09,
        bloomStrength: 0.45,
        bloomThreshold: 0,
        bloomRadius: 0.73
    };

    const cursor = {
        x: 0, 
    };

    // Scene
    const scene = new THREE.Scene();


    let renderer, camera, controls, material, materialSmall, geometry, geometrySmall, plane, planeSmall, composer, cubeRenderTarget, cubeCamera, invader;

    let gui;
    let time = 0;
    let human;

    let dotEffect, rayEffect;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/assets/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const init = () => {
        addEventListeners();
        setCamera();
        setRenderer();
        setLight();
        addObjects();
        addSettings();
        // initPost();
        tick();
    };

    function addSettings() {
        gui = new dat.GUI();


        addCameraGui();
    }

    function addObjects() {
        cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
            encoding: THREE.sRGBEncoding // temporary -- to prevent the material's shader from recompiling every frame 
        });

        cubeCamera = new THREE.CubeCamera( 0.1, 10, cubeRenderTarget );

        // bg sphere
        material = new THREE.ShaderMaterial ({
            extensions: {
                derivatives: "#extension GL_OES_standard _derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector4 () },
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });
        

        geometry = new THREE.SphereGeometry(3, 32, 32);


        plane = new THREE.Mesh(geometry, material);
        scene.add(plane);



        // inner sphere
        // geometrySmall = new THREE.SphereGeometry(0.4, 32, 32);
        // materialSmall = new THREE.ShaderMaterial ({
        //     extensions: {
        //         derivatives: "#extension GL_OES_standard _derivatives : enable"
        //     },
        //     side: THREE.DoubleSide,
        //     uniforms: {
        //         time: { value: 0 },
        //         tCube: { value: 0 },
        //         resolution: { value: new THREE.Vector4 () },
        //     },
        //     // wireframe: true,
        //     // transparent: true,
        //     vertexShader: vertex1,
        //     fragmentShader: fragment1
        // });
        // planeSmall = new THREE.Mesh(geometrySmall, materialSmall);
        // scene.add(planeSmall);

        gltfLoader.load('/assets/models/invader.glb', (gltf) => {
    

            invader = gltf.scene.children[0];

            invader.scale.set(0.4, 0.4, 0.4);
            // invader.rotation.set(0, -0.5 * Math.PI, 0);
            // invader.position.set(0, -0.8, 0.03);

            // invader.geometry.center();
            // console.log(invader);

            invader.material = new THREE.ShaderMaterial({
                extensions: {
                    derivatives: "#extension GL_OES_standard _derivatives : enable"
                },
                side: THREE.DoubleSide,
                uniforms: {
                    time: { value: 0 },
                    tCube: { value: 0 },
                    resolution: { value: new THREE.Vector4 () },
                },
                // wireframe: true,
                // transparent: true,
                vertexShader: vertex1,
                fragmentShader: fragment1
            });

            scene.add(gltf.scene);

            
 


        });
    }

    function addEventListeners() {
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

        // window.addEventListener('mousemove', (event) => {
        //     cursor.x = event.clientX / sizes.width - 0.5;
        //     cursor.y = -(event.clientY / sizes.height - 0.5);
        // });
    }

    function addCameraGui() {
        // camera
        gui.add(camera.position, 'x', -5, 5, 0.01)
            .onChange((val) => {
                camera.position.x = val;
                controls.update();
            })
            .name('Camera Position X');
        gui.add(camera.position, 'y', -5, 5, 0.01)
            .onChange((val) => {
                camera.position.y = val;
                controls.update();
            })
            .name('Camera Position Y');
        gui.add(camera.position, 'z', -5, 5, 0.01)
            .onChange((val) => {
                camera.position.z = val;
                controls.update();
            })
            .name('Camera Position Z');
        gui.add(camera, 'zoom', -20, 20, 0.01)
            .onChange((val) => {
                camera.zoom = val;
                camera.updateProjectionMatrix();
            })
            .name('Camera Zoom');

    }




    function setLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // directionalLight.position.set(0.5, 0, 0.866)
        // scene.add(directionalLight)
    }

    function setCamera() {
        camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 1000);
        controls = new OrbitControls(camera, canvas);
        camera.position.set(0,0, 1.3)


        camera.updateProjectionMatrix();
        scene.add(camera);

        controls.enableDamping = true;
    }

    function setRenderer() {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        }); 
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(sizes.width, sizes.height);
        renderer.setClearColor(0x222222, 1);
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = THREE.sRGBEncoding;


    }


    function cameraTimeline() {
        const tl = gsap.timeline();

        tl.to(camera.position, {
            scrollTrigger: {
                trigger: '.js-header',
                start: () => `top top`,
                end: () => `+=${window.innerHeight*3}`,
                scrub: true,
                invalidateOnRefresh: true,
                
            },
            x: -1,
            y: 0,
            z: 0,
        });
        tl.to(camera, {
            scrollTrigger: {
                trigger: '.js-header',
                start: () => `top+=1000 top`,
                end: () => `+=${window.innerHeight*2}`,
                scrub: true,
                invalidateOnRefresh: true,
                
            },
            zoom: 5,

            onUpdate: () => {
	
                camera.updateProjectionMatrix();
            
            }
        });

        tl.to(human.position, {
            scrollTrigger: {
                trigger: '.js-header',
                start: () => `top top-=${window.innerHeight * 3 + 100}`,
                end: () => `+=${window.innerHeight}`,
                scrub: true,
                invalidateOnRefresh: true,
                
            },
            y: -0.4,
        });

        return tl;
    }

    const tick = () => {
        // Update controls
        controls.update();

        time += 0.003;

        if(invader) {
            invader.visible = false;
            cubeCamera.update(renderer, scene);
            invader.visible = true;
            
            invader.uniforms.tCube.value = cubeRenderTarget.texture;
            material.uniforms.time.value = time;
            window.requestAnimationFrame(tick);
    
            // Render
            renderer.render(scene, camera);
    
        }



    };

    init();
};
