import * as THREE from 'three';

export function createBoss(scene, combat) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x220011, emissive: 0xaa0022, metalness: 0.6, roughness: 0.3 })
  );
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xff0044 })
  );
  core.position.z = -1.5;
  group.add(body, core);
  group.visible = false;
  scene.add(group);

  let active = false;
  let hp = 100;
  let nextSpawn = 450;

  function spawn(dist) {
    if (active || dist < nextSpawn) return;
    active = true;
    hp = 100;
    group.visible = true;
    group.position.set(0, 2.5, -70);
    nextSpawn += 500;
  }

  function update(dt, player, speed) {
    if (!active) return null;
    group.position.z += speed * 9 * dt;
    group.rotation.y = Math.sin(performance.now() * 0.001) * 0.15;

    // Попадание лазеров обрабатывается в combat (дополнительная проверка)
    if (group.position.z > 8) {
      active = false;
      group.visible = false;
      return 'escaped';
    }
    return null;
  }

  function hit(dmg = 12) {
    if (!active) return;
    hp -= dmg;
    if (hp <= 0) {
      active = false;
      group.visible = false;
      return 'killed';
    }
    return null;
  }

  function getHP() { return hp; }
  function isActive() { return active; }

  return { spawn, update, hit, getHP, isActive, group };
}
