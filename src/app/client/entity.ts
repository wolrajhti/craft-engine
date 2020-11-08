import * as THREE from 'three';

export class Entity {
  mesh: THREE.Mesh;
  div: HTMLDivElement;
  constructor(
    public readonly type: 'c' | 'f' | 's',
    public readonly uuid: number,
    public x: number,
    public y: number,
  ) {
    const geometry = this._getGeometry();
    const material = this._getMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.userData = this;
    console.log(this.x, this.y);
    const labels = document.getElementById('labels');
    if (labels) {
      labels.insertAdjacentHTML(
        'beforeend',
        `<div id="${type}${uuid}">
          ${type}${uuid}
        </div>`
      );
    }
    this.div = document.getElementById(type + uuid) as HTMLDivElement;
    this.mesh.position.add(new THREE.Vector3(this.x, this.y));
  }
  select(): void {
    (this.mesh.material as THREE.MeshBasicMaterial).color = new THREE.Color(0x545454);
  }
  unselect(): void {
    this.mesh.material = this._getMaterial();
  }
  private _getGeometry(): THREE.BufferGeometry {
    if (this.type === 'c') {
      return new THREE.ConeBufferGeometry(5, 5, 3);
    } else if (this.type === 'f') {
      return new THREE.BoxBufferGeometry(10, 10, 10);
    } else /* if (type === 's') */ {
      return new THREE.BoxBufferGeometry(10, 10, 10);
    }
  }
  private _getMaterial(): THREE.MeshBasicMaterial {
    if (this.type === 'c') {
      return new THREE.MeshBasicMaterial({color: 0xff0000});
    } else if (this.type === 'f') {
      return new THREE.MeshBasicMaterial({color: 0x00ff00});
    } else /* if (type === 's') */ {
      return new THREE.MeshBasicMaterial({color: 0xff0000});
    }
  }
}