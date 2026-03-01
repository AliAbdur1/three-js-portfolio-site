import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { gsap } from 'gsap'
import GUI from 'lil-gui'
console.log(gsap)

function Example() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    // Scene
    const scene = new THREE.Scene()

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // Group

    const cameraGroup = new THREE.Group()
    scene.add(cameraGroup)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.z = 6
    cameraGroup.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas,
        alpha: true
     })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#2b0101ff')

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // GUI
    const gui = new GUI()

    //Texture
    const textureLoader = new THREE.TextureLoader()
    const gradientTexture = textureLoader.load('src/static/textures/gradients/3.jpg')
    gradientTexture.magFilter = THREE.NearestFilter
    // Material
    const parameters = {
      materialColor: '#f7d6d6'
    }
    
    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture
    })
    
    // Material Gui contols
    gui.addColor(parameters, 'materialColor').onChange(() => {
      material.color.set(parameters.materialColor)
      particlesMaterial.color.set(parameters.materialColor)
    })
    //Meshes

    // Meshes
    const objectsDistance = 4
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    )

    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      material
    )

    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    )

    mesh1.position.y = - objectsDistance * 0
    mesh1.position.x = 2
  
    mesh2.position.y = - objectsDistance * 1
    mesh2.position.x = -2
    
    mesh3.position.y = - objectsDistance * 2
    mesh3.position.x = 2

    scene.add(mesh1, mesh2, mesh3)

    const sectionMeshes = [mesh1, mesh2, mesh3]

    // Particles
    const particlesCount = 200
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length //this will make the particles spread out based on the objects array
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      size: 0.03,
      sizeAttenuation: true
    })

    //Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
    directionalLight.position.set(1, 1, 1)

    scene.add(directionalLight)

    // Resize Handler
    const handleResize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    //Scroll
    let scrollY = window.scrollY
    let currentSection = 0

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY

      const newSection = Math.round(scrollY / sizes.height) // each section is made to fit one veiwport height

      if(newSection !== currentSection) {
        currentSection = newSection
        gsap.to(
          sectionMeshes[currentSection].rotation,
          {
            duration: 1.5,
            ease: 'power2.inout',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'

          }
        )
      }
    })

    //Scroll end

    //Cursor
    const cursor = {
    }
    cursor.x = 0
    cursor.y = 0

    window.addEventListener('mousemove', (event) => {
      cursor.x = event.clientX / sizes.width - 0.5
      cursor.y = event.clientY / sizes.height - 0.5
    })

    // Animation
    const clock = new THREE.Clock();
    let previousTime = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime // screen frenquency stuff...

      //animate camera
      camera.position.y = - scrollY / sizes.height * objectsDistance
      const parallaxX = cursor.x * 0.5
      const parallaxY = - cursor.y * 0.5 //this inversion is important for the parallax effect
      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
      // Animate Meshes
      for( const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
      }
      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }

    tick()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      gui.destroy()
      renderer.dispose()
    }

  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="exampleOnScreen"
    />
  )
}

export default Example