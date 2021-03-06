/*!
 *
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as THREE from 'three'
import * as THREE_TEXT2D from 'three-text2d'

type Settings = {
  viewAngle: number
  near: number
  far: number
}

export class Demo {
  _width: number | null = null
  _height: number | null = null
  _renderer: THREE.WebGLRenderer | null = null
  _camera: THREE.PerspectiveCamera | null = null
  _aspect: number | null = null
  _settings: Settings | null = null
  _box1: THREE.Mesh | null = null
  _box2: THREE.Mesh | null = null
  _container: Element | null = null
  _scene: THREE.Scene | null = null

  static get CAMERA_SETTINGS() {
    return {
      viewAngle: 45,
      near: 0.1,
      far: 10000,
    }
  }

  constructor() {
    this._container = document.querySelector('#container')

    this.clearContainer()
    this.createRenderer()

    this._onResize = this._onResize.bind(this)
    this._update = this._update.bind(this)
    this._onResize()

    this.createCamera()
    this.createScene()
    this.createMeshes()
    this.createTexts()

    this._addEventListeners()
    requestAnimationFrame(this._update)
  }

  _update() {
    const ROTATION_VALUE = 4
    const time = window.performance.now() * 0.0001

    this._box1!.rotation.x = Math.sin(time) * ROTATION_VALUE
    this._box1!.rotation.y = Math.cos(time) * ROTATION_VALUE

    this._box2!.rotation.x = Math.sin(time) * ROTATION_VALUE
    this._box2!.rotation.y = Math.cos(time) * ROTATION_VALUE

    this._render()
  }

  _render() {
    this._renderer!.render(this._scene!, this._camera!)
    requestAnimationFrame(this._update)
  }

  _onResize() {
    this._width = window.innerWidth
    this._height = window.innerHeight
    this._aspect = this._width / this._height

    this._renderer!.setPixelRatio(window.devicePixelRatio)
    this._renderer!.setSize(this._width, this._height)

    if (!this._camera) {
      return
    }

    this._camera.aspect = this._aspect
    this._camera.updateProjectionMatrix()
  }

  _addEventListeners() {
    window.addEventListener('resize', this._onResize)
  }

  clearContainer() {
    this._container!.innerHTML = ''
  }

  createRenderer() {
    this._renderer = new THREE.WebGLRenderer()
    this._container!.appendChild(this._renderer.domElement)
  }

  createCamera() {
    this._settings = Demo.CAMERA_SETTINGS
    this._camera = new THREE.PerspectiveCamera(
      this._settings.viewAngle,
      this._aspect!,
      this._settings.near,
      this._settings.far,
    )
  }

  createScene() {
    this._scene = new THREE.Scene()
  }

  createMeshes() {
    // Box1
    this._box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
    this._box1.position.x = -1
    this._box1.position.y = 0
    this._box1.position.z = -5

    // Box2
    this._box2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshNormalMaterial())
    this._box2.position.x = 3
    this._box2.position.y = 0
    this._box2.position.z = -15

    // Room.
    const roomGeometry = new THREE.BoxGeometry(10, 5, 25, 10, 5, 25)
    const roomMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      opacity: 0.3,
      transparent: true,
      side: THREE.BackSide,
    })
    const room = new THREE.Mesh(roomGeometry, roomMaterial)

    room.position.z = -5

    this._scene!.add(this._box1)
    this._scene!.add(this._box2)
    this._scene!.add(room)
  }

  createTexts() {
    const text1 = new THREE_TEXT2D.SpriteText2D('Which one is farther away?', {
      align: THREE_TEXT2D.textAlign.center,
      font: '100px Arial',
      fillStyle: '#FFFFFF',
      antialias: false,
    })
    text1.position.x = 0
    text1.position.y = -1
    text1.position.z = -4
    text1.scale.x = 0.002
    text1.scale.y = 0.002

    this._scene!.add(text1)
  }
}
