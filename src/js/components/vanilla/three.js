// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { DotScreenShader } from 'models/utils/dot-screen-shader';

export default (element) => {
    // Canvas
    const canvas = element.querySelector('canvas.js-scene');

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };


    const params = {
        exposure: 1.09,
        bloomStrength: 0.45,
        bloomThreshold: 0,
        bloomRadius: 0.73
    };

    const cursor = {
        x: 0,
        y: 0,
    };

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    });

    const controls = new OrbitControls(camera, canvas);
    let composer;

    let gui;
    let time = 0;
    let human;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/assets/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const init = () => {
        addEventListeners();
        setCamera();
        setControls();
        setRenderer();
        setLight();
        addObjects();
        addSettings();
        initPost();
        tick();
    };

    function addSettings() {
        gui = new dat.GUI();

        // exposure
        gui.add(params, 'exposure', 0, 2, 0.01).onChange(() => {
            renderer.toneMappingExposure = params.exposure;
        });        



        addCameraGui();
    }

    function addObjects() {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const env = '/assets/models/env.jpg';
        pmremGenerator.compileEquirectangularShader();

        let envMap = new THREE.TextureLoader().load(env, (texture) => {
            envMap = pmremGenerator.fromEquirectangular(texture).texture;
            // scene.environment = env;
            // texture.dispose();
            pmremGenerator.dispose();

            gltfLoader.load('/assets/models/panama_lowres3.glb', (gltf) => {
                scene.add(gltf.scene);

                human = gltf.scene.children[0];

                human.scale.set(1, 1, 1);
                human.rotation.set(0, -0.5 * Math.PI, 0);
                human.position.set(0, -0.8, 0.03);

                human.geometry.center();
                // console.log(human);

                human.material = new THREE.MeshStandardMaterial({
                    metalness: 1,
                    roughness: 0.28,
                });
                human.material.envMap = envMap;
                
                
                human.material.onBeforeCompile = (shader) => {
                    console.log('before compile happen');
                    shader.uniforms.uTime = { value: 0 };
                    shader.fragmentShader =
                        `
                    uniform float uTime;

                    mat4 rotationMatrix(vec3 axis, float angle) {
                        axis = normalize(axis);
                        float s = sin(angle);
                        float c = cos(angle);
                        float oc = 1.0 - c;
                        
                        return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                                    0.0,                                0.0,                                0.0,                                1.0);
                    }
                    
                    vec3 rotate(vec3 v, vec3 axis, float angle) {
                        mat4 m = rotationMatrix(axis, angle);
                        return (m * vec4(v, 1.0)).xyz;
                    }

                    ` + shader.fragmentShader;

                    shader.fragmentShader = shader.fragmentShader.replace(
                        `#include <envmap_physical_pars_fragment>`,
                        `#if defined( USE_ENVMAP )
                            vec3 getIBLIrradiance( const in vec3 normal ) {
                                #if defined( ENVMAP_TYPE_CUBE_UV )
                                    vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
                                    vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
                                    return PI * envMapColor.rgb * envMapIntensity;
                                #else
                                    return vec3( 0.0 );
                                #endif
                            }
                            vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
                                #if defined( ENVMAP_TYPE_CUBE_UV )
                                    vec3 reflectVec = reflect( - viewDir, normal );
                                    // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
                                    reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
                                    reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
                                    reflectVec = rotate(reflectVec, vec3(1.0, 0.0, 0.0), uTime * 0.05);
                                    vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
                                    return envMapColor.rgb * envMapIntensity;
                                #else
                                    return vec3( 0.0 );
                                #endif
                            }
                        #endif
                    `
                    );
                    human.material.userData.shader = shader;


                    initGsap();
                };

                // add sets to gui
                gui.add(human.position, 'x', -2, 2, 0.01)
                    .onChange((val) => {
                        human.position.x = val;
                    })
                    .name('Model Position X');
                gui.add(human.position, 'y', -2, 2, 0.01)
                    .onChange((val) => {
                        human.position.y = val;
                    })
                    .name('Model Position Y');
                gui.add(human.position, 'z', -2, 2, 0.01)
                    .onChange((val) => {
                        human.position.z = val;
                    })
                    .name('Model Position Z');
                gui.add(human.rotation, 'x', -2, 2, 0.01)
                    .onChange((val) => {
                        human.rotation.x = val;
                    })
                    .name('Model rotation X');
                gui.add(human.rotation, 'y', -2, 2, 0.01)
                    .onChange((val) => {
                        human.rotation.y = val;
                    })
                    .name('Model rotation Y');
                gui.add(human.rotation, 'z', -2, 2, 0.01)
                    .onChange((val) => {
                        human.rotation.z = val;
                    })
                    .name('Model rotation Z');


                gui.add(human.material, 'metalness', -2, 2, 0.01)
                    .onChange((val) => {
                        human.material.metalness = val;
                    })
                    .name('Model metalness');
            });
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

        window.addEventListener('mousemove', (event) => {
            cursor.x = event.clientX / sizes.width - 0.5;
            cursor.y = -(event.clientY / sizes.height - 0.5);
        });
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

    function initGsap() {
        const scene = gsap.timeline();

        const cameraScene = cameraTimeline();
        scene.add(cameraScene);

    }

    function initPost() {
        const renderScene = new RenderPass( scene, camera );

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;

        composer = new EffectComposer( renderer );
        composer.addPass( renderScene );
        composer.addPass( bloomPass );


        const effect1 = new ShaderPass( DotScreenShader );
        effect1.uniforms[ 'scale' ].value = 4;
        composer.addPass( effect1 );


        // gui

        gui.add(bloomPass, 'threshold', 0, 1, 0.01).onChange((val) => {
            bloomPass.threshold = val;
        });
        gui.add(bloomPass, 'strength', 0, 5, 0.01).onChange((val) => {
            bloomPass.strength = val;
        });
        gui.add(bloomPass, 'radius', 0, 1.5, 0.01).onChange((val) => {
            bloomPass.radius = val;
        });

    }

    function setLight() {
        // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        // scene.add(ambientLight);

        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // directionalLight.position.set(0.5, 0, 0.866)
        // scene.add(directionalLight)
    }

    function setCamera() {
        camera.position.set(0.57, 1.07, 0.94);
        camera.zoom = 16;
        camera.updateProjectionMatrix();
        scene.add(camera);
    }

    function setControls() {
        // Controls
        controls.enableDamping = true;
        // controls.target.set(0, 0.8, 0 );
    }

    function setRenderer() {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = params.exposure;
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

        // tl.to(human.position, {
        //     scrollTrigger: {
        //         trigger: '.js-header',
        //         start: () => `top top-=${window.innerHeight * 3 + 100}`,
        //         end: () => `+=${window.innerHeight}`,
        //         scrub: true,
        //         invalidateOnRefresh: true,
                
        //     },
        //     y: -0.4,
        // });

        return tl;
    }

    const tick = () => {
        // Update controls
        controls.update();

        // Render
        composer.render(scene, camera);

        time += 0.05;
        // Call tick again on the next frame
        window.requestAnimationFrame(tick);

        if (human) {
            // human.rotation.z = time * 0.05;

            if (human.material.userData) {
                // console.log(human.material.userData.shader);
                human.material.userData.shader.uniforms.uTime.value = time;
            }

            // Update camera
            // camera.position.x = cursor.x / 5
            // camera.position.y = cursor.y * 5
            // camera.lookAt(human.position)
        }
    };

    init();
};
