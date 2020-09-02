import * as THREE from 'three';

export class Entity {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  mesh: THREE.Mesh;
  constructor(
    public readonly type: 'c' | 'f' | 's',
    public readonly uuid: number,
    public x: number,
    public y: number,
  ) {
    if (type === 'c') {
      this.geometry = new THREE.ConeBufferGeometry(5, 5, 3);
      this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
    } else if (type === 'f') {
      this.geometry = new THREE.BoxBufferGeometry(10, 10, 10);
      this.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    } else /* if (type === 's') */ {
      this.geometry = new THREE.BoxBufferGeometry(10, 10, 10);
      this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
    }
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData = this;
    console.log(this.x, this.y);
    this.mesh.position.add(new THREE.Vector3(this.x, this.y));
  }
}