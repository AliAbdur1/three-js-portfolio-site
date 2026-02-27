import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

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

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.z = 6
    scene.add(camera)

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

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY
    })

    //Scroll end

    // Animation
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      //animate camera
      camera.position.y = - scrollY / sizes.height * objectsDistance
      // Animate Meshes
      for( const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
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