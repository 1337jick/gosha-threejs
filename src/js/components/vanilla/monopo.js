// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';

import { DotScreenShader } from 'models/utils/dot-screen-shader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';



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


    const uniforms = {
      mRefractionRatio: 1.02,
      mFresnelBias: 0.1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
  };


    // Scene
    const scene = new THREE.Scene();
    let gui;

    let renderer, composer, camera, controls, material, materialSmall, geometry, geometrySmall, plane, planeSmall, cubeRenderTarget, cubeCamera;

    let time = 0;

    const init = () => {
        addEventListeners();
        setCamera();
        setRenderer();
        setLight();
        addObjects();
        addSettings();
        initPost();
        tick();
    };

    function addSettings() {
        gui = new dat.GUI();

        gui.add(uniforms, 'mRefractionRatio', 0, 2, 0.01).onChange((val) => {
          materialSmall.uniforms.mRefractionRatio.value = val;
        });
        gui.add(uniforms, 'mFresnelBias', 0, 2, 0.01).onChange((val) => {
          materialSmall.uniforms.mFresnelBias.value = val;
        });
        gui.add(uniforms, 'mFresnelScale', 0, 2, 0.01).onChange((val) => {
          materialSmall.uniforms.mFresnelScale.value = val;
        });
        gui.add(uniforms, 'mFresnelPower', 0, 2, 0.01).onChange((val) => {
          materialSmall.uniforms.mFresnelPower.value = val;
        });

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

            vertexShader: vertex,
            fragmentShader: fragment
        });
        

        geometry = new THREE.SphereGeometry(3, 32, 32);


        plane = new THREE.Mesh(geometry, material);
        scene.add(plane);



        // inner sphere
        geometrySmall = new THREE.SphereGeometry(0.4, 32, 32);
        materialSmall = new THREE.ShaderMaterial ({
            extensions: {
                derivatives: "#extension GL_OES_standard _derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                tCube: { value: 0 },
                mRefractionRatio: { value: uniforms.mRefractionRatio },
                mFresnelBias: { value: uniforms.mFresnelBias },
                mFresnelPower: { value: uniforms.mFresnelPower },
                mFresnelScale: { value: uniforms.mFresnelScale },
                resolution: { value: new THREE.Vector4 () },
            },
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex1,
            fragmentShader: fragment1
        });
        planeSmall = new THREE.Mesh(geometrySmall, materialSmall);
        scene.add(planeSmall);
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

    }




    function setLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

    }

    function setCamera() {
        camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 1000);
        controls = new OrbitControls(camera, canvas);

        camera.position.set(0,0, 1.3)


        camera.updateProjectionMatrix();
        scene.add(camera);

        controls.enableDamping = true;
        controls.enableZoom = false;
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

    function initPost() {
      const renderScene = new RenderPass( scene, camera );

      composer = new EffectComposer( renderer );
      composer.addPass( renderScene );


      const dotEffect = new ShaderPass( DotScreenShader );
      // dotEffect.uniforms[ 'scale' ].value = 4;
      composer.addPass( dotEffect );


      // gui

  }


    const tick = () => {
        // Update controls
        controls.update();

        time += 0.003;

        planeSmall.visible = false;
        cubeCamera.update(renderer, scene);
        planeSmall.visible = true;
        
        materialSmall.uniforms.tCube.value = cubeRenderTarget.texture;
        material.uniforms.time.value = time;
        window.requestAnimationFrame(tick);

        // Render
        // renderer.render(scene, camera);
        composer.render(scene, camera);


    };

    init();
};
