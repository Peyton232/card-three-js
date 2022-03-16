import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Texture Loader
 */
const loadingManager = new THREE.LoadingManager()

const textureLoader = new THREE.TextureLoader(loadingManager)
const cardBackTexture = textureLoader.load('/CardFaceBack2-2.png')
const cardTexture = textureLoader.load('/CardFace.png')
const backdropTexture = textureLoader.load('/backdrop-4.png')
const matcapTexture = textureLoader.load('/matcap4.png')


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Lights
 */
//=============================================
    const ambientLight = new THREE.AmbientLight()
    ambientLight.color = new THREE.Color(0xffffff)
    ambientLight.intensity = .25
    scene.add(ambientLight)
//=============================================


/**
 * Objects
 */
// Material

const gltfLoader = new GLTFLoader()

gltfLoader.load(
    
    '/models/sonrCard.glb',

    (gltf) =>
    {
        const sonrMaterial = new THREE.MeshPhysicalMaterial( {
            color: 0xffffff,
            metalness:0,
            roughness: .43,
            ior: 1.5,
            transmission: 1, // use material.transmission for glass materials
            specularIntensity: 1,
            specularColor: 0xffffff,
            opacity: 1,
            side: THREE.DoubleSide,
            transparent: true
        } );

        const cardMaterial = new THREE.MeshBasicMaterial({
            map: cardTexture,
            opacity: .75,
            transparent: true
        });

        const card = new THREE.Mesh(
            new THREE.PlaneGeometry(.60, 1.20,),
            cardMaterial
        )

        const cardBackMaterial = new THREE.MeshBasicMaterial({
            map: cardBackTexture,
            opacity: .75,
            transparent: true
        });

        const cardBack = new THREE.Mesh(
            new THREE.PlaneGeometry(.60, 1.20,),
            cardBackMaterial
        )


        let sonrCard = gltf.scene.children.find((child) => child.name === "Card");
        sonrCard.scale.set(sonrCard.scale.x * .3, sonrCard.scale.y * .3, sonrCard.scale.z * .3)

    
        sonrCard.material = sonrMaterial

        sonrCard.position.x = 0
        sonrCard.position.y = .35
        sonrCard.position.z = -.03

        sonrCard.rotation.z = .42
     
        
        card.position.y = .35
        card.position.z = -.021

        card.rotation.z = -1.15

        cardBack.position.x = 0
        cardBack.position.y = .35
        cardBack.position.z = -.0309


        cardBack.rotation.x = 3.14
        cardBack.rotation.y = 0
        cardBack.rotation.z = -1.99
        
        scene.add(sonrCard, card, cardBack)

    }

)

const tableMaterial = new THREE.MeshMatcapMaterial()
tableMaterial.matcap = matcapTexture

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

const table = new THREE.Mesh(
    new THREE.CylinderGeometry(.75, .75, 1, 100),
    tableMaterial
)   
table.position.y = -0.69
table.receiveShadow = true;


scene.add(table)
scene.background = backdropTexture;

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
   
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(63, sizes.width / sizes.height, 0.1, 3)
camera.position.x = 0.1824358
camera.position.y = .28457
camera.position.z = 1.6826


scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.enablePan = false
controls.enableZoom = false
controls.enableRotate = false


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



