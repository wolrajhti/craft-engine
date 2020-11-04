import * as THREE from 'three';
import { Socket } from 'socket.io';
import { Entity } from './entity';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class GameClient {
  private _entities = new Map<number, Entity>();
  private _scene = new THREE.Scene();
  private _entityContainer = new THREE.Object3D();
  private _renderer = new THREE.WebGLRenderer();
  private _camera: THREE.PerspectiveCamera;
  private _controls: OrbitControls;
  private _raycaster = new THREE.Raycaster();
  private _selectedEntities = new Set<number>();
  constructor(private _socket: Socket) {
    const geometry = new THREE.PlaneBufferGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({color: 0x343434, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(geometry, material);
    this._scene.add(plane);
    this._scene.add(this._entityContainer);

    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this._camera.position.z = 500;
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);

    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    const mouse = new THREE.Vector2();
    this._renderer.domElement.addEventListener('click', event => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log(mouse.x, mouse.y);
      this._clickHandler(mouse);
    });

    _socket.on('entity', (type, uuid, x, y) => this.addEntity(type, uuid, x, y));
  }
  addEntity(type: 'c' | 'f' | 's', uuid: number, x: number, y: number) {
    const entity = new Entity(type, uuid, x, y);
    this._entities.set(entity.uuid, entity);
    this._entityContainer.add(entity.mesh);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this._renderer.render(this._scene, this._camera);
  }
  private _clickHandler(mouse: THREE.Vector2) {
    this._raycaster.setFromCamera(mouse, this._camera);
    const inters = this._raycaster.intersectObjects(this._entityContainer.children);
    inters.forEach(inter => {
      const entity = inter.object.userData as Entity;
      if (this._selectedEntities.has(entity.uuid)) {
        this._unselectEntity(entity);
      } else {
        this._selectEntity(entity);
      }
    });
  }
  private _selectEntity(entity: Entity): void {
    entity.select();
    this._selectedEntities.add(entity.uuid);
  }
  private _unselectEntity(entity: Entity): void {
    entity.unselect();
    this._selectedEntities.delete(entity.uuid);
  }
  getSelectedEntityUuids(): number[] {
    return [...this._selectedEntities.values()];
  }
}