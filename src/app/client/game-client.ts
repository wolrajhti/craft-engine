import * as THREE from 'three';
import { Socket } from 'socket.io';
import { Entity } from './entity';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class GameClient {
  private _entities: Entity[] = [];
  private _scene = new THREE.Scene();
  private _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  private _renderer = new THREE.WebGLRenderer();
  private _controls = new OrbitControls(this._camera, this._renderer.domElement);
  constructor(private _socket: Socket) {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);
    this._camera.position.z = 500;
    this._camera.rotateX(Math.PI / 2);

    _socket.on('entity', (type, uuid, x, y) => this.addEntity(type, uuid, x, y));
  }
  addEntity(type: 'c' | 'f' | 's', uuid: number, x: number, y: number) {
    const entity = new Entity(type, uuid, x, y);
    this._entities.push(entity);
    this._scene.add(entity.mesh);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this._renderer.render(this._scene, this._camera);
  }
  getLastEntity() {
    return this._entities[this._entities.length - 1];
  }
}