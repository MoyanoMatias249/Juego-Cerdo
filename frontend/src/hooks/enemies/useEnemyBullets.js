// src/hooks/enemies/useEnemyBullets.js
import { useEffect, useState, useRef } from 'react';
import useGameSounds from '../useGameSounds';
import bulletSprite from '../../assets/sprites-player/bullet.png';

let enemyBulletIdCounter = 0;
const nextEnemyBulletId = () => `eb-${++enemyBulletIdCounter}`;

function useEnemyBullets(enemies, isGameActive) {
  const [enemyBullets, setEnemyBullets] = useState([]);
  const { playShoot, playCannon } = useGameSounds?.() ?? { playShoot: () => {}, playCannon: () => {} };
  const lastAttackIdByEnemy = useRef(new Map());

  // Spawn de nuevas balas
  useEffect(() => {
    if (!isGameActive) return;

    const newBullets = [];

    enemies.forEach((e) => {

      // ── Bote-wolf ────────────────────────────────────────────────────────
      if (e.type === 'boat-wolf' && e.shoot?.active && e.targetX !== undefined) {
        const dx    = e.targetX - e.x;
        const dy    = e.targetY - e.y;
        const angle = Math.atan2(dy, dx);
        newBullets.push({
          id: nextEnemyBulletId(),
          x: e.x + 51, y: e.y + 10,
          vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4,
          type: 'cannonball',
        });
        playCannon();
        return;
      }

      // ── Wolf normal ──────────────────────────────────────────────────────
      if (e.type === 'wolf' && e.shoot?.active) {
        newBullets.push({
          id: nextEnemyBulletId(),
          x: e.x + 25, y: e.y + 60 + Math.random() * 10,
          vx: 0, vy: 6,
          type: 'basic', sprite: bulletSprite,
        });
        return;
      }

      // ── Bullet-wolf ──────────────────────────────────────────────────────
      if (e.type === 'bullet-wolf' && e.shoot?.active) {
        const lastId    = lastAttackIdByEnemy.current.get(e.id) ?? 0;
        const currentId = e.shoot.attackId ?? 0;
        if (currentId !== lastId) {
          const offsetY = e.direction === 'up' ? -10 : e.direction === 'down' ? 10 : 0;
          newBullets.push(
            { id: nextEnemyBulletId(), x: e.x - 10, y: e.y + 15 + offsetY, vx: -6, vy: 0, type: 'enemy-bullet', sprite: bulletSprite },
            { id: nextEnemyBulletId(), x: e.x - 10, y: e.y + 25 + offsetY, vx: -6, vy: 0, type: 'enemy-bullet', sprite: bulletSprite }
          );
          playShoot();
          lastAttackIdByEnemy.current.set(e.id, currentId);
        }
        return;
      }

      // ── Air-ship boss ────────────────────────────────────────────────────
      if (e.type === 'air-ship' && e.shoot?.active) {
        const lastId    = lastAttackIdByEnemy.current.get(e.id) ?? 0;
        const currentId = e.shoot.attackId ?? 0;

        if (currentId !== lastId) {
          const ox        = e.x + 60;
          const oy        = e.y + 200;
          const tx        = e.targetX ?? 200;
          const ty        = e.targetY ?? 250;
          const dx        = tx - ox;
          const dy        = ty - oy;
          const baseAngle = Math.atan2(dy, dx);
          const speed     = 6;
          const spread    = e.spread ?? 0.22;

          [-spread, 0, spread].forEach((offset) => {
            const angle = baseAngle + offset;
            newBullets.push({
              id:     nextEnemyBulletId(),
              x:      ox,
              y:      oy,
              vx:     Math.cos(angle) * speed,
              vy:     Math.sin(angle) * speed,
              type:   'enemy-bullet',
              sprite: bulletSprite,
            });
          });

          playShoot();
          lastAttackIdByEnemy.current.set(e.id, currentId);
        }
        return;
      }

      // ── Ship-wolf boss ───────────────────────────────────────────────────
      if (e.type === 'ship-wolf' && e.shoot?.active && e.targetX !== undefined) {
        const speed     = 5;
        const cannonTop = { x: e.x + 65, y: e.y - 10 };
        const cannonBot = { x: e.x + 34, y: e.y + 20 };
        const origin    = e.shoot?.origin || 'top';
        const pos       = origin === 'top' ? cannonTop : cannonBot;
        const dx        = e.targetX - pos.x;
        const dy        = e.targetY - pos.y;
        const angle     = Math.atan2(dy, dx);

        if (e.attackPattern === 'triple') {
          [0, 1, 2].forEach((i) => {
            if (!e.heads?.[i]) return;
            const ox = e.x + 30 + i * 40;
            const oy = e.y + 40;
            const a  = Math.atan2(e.targetY - oy, e.targetX - ox);
            newBullets.push({ id: nextEnemyBulletId(), x: ox, y: oy, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, type: 'cannonball' });
          });
          playCannon();
        } else if (e.attackPattern === 'barrage') {
          [-1, 0, 1].forEach((offset) => {
            const a = angle + offset * 0.2;
            newBullets.push({ id: nextEnemyBulletId(), x: cannonTop.x, y: cannonTop.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, type: 'cannonball' });
          });
          playCannon();
        } else if (e.attackPattern === 'cannon') {
          newBullets.push({ id: nextEnemyBulletId(), x: pos.x, y: pos.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, type: 'cannonball' });
          playCannon();
        }
      }
    });

    if (newBullets.length > 0) {
      setEnemyBullets((prev) => [...prev, ...newBullets]);
    }
  }, [enemies, isGameActive]);

  // Movimiento de balas
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameActive) return;
      setEnemyBullets((prev) =>
        prev
          .map((b) => ({ ...b, x: b.x + (b.vx ?? 0), y: b.y + (b.vy ?? 0) }))
          .filter((b) => {
            const m = 50;
            return b.x + 24 > -m && b.x < 900 + m && b.y + 24 > -m && b.y < 700 + m;
          })
      );
    }, 16);
    return () => clearInterval(interval);
  }, [isGameActive]);

  return [enemyBullets, setEnemyBullets];
}

export default useEnemyBullets;