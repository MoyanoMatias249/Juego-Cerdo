export function getEnemyHitbox(entity) {
  if (entity.type === 'basic') {
    return {
      x: entity.x,
      y: entity.y + 10,
      width: 100,
      height: 30,
    };
  }

  if (entity.type === 'wolf') {
    return {
      x: entity.x,
      y: entity.y - 20,
      width: 100,
      height: 60,
    };
  }

  if (entity.type === 'shark') {
    if (entity.state === 'jumping' || entity.state === 'falling') {
      return {
        x: entity.x + 10,
        y: entity.y + 10,
        width: 64,
        height: 80,
      };
    } else {
      // No hitbox si está como aleta
      return null;
    }
  }
  if (entity.type === 'boat-wolf') {
    return {
      x: entity.x + 14,
      y: entity.y,
      width: 122,
      height: 82,
    };
  }

   if (entity.type === 'cannonball') {
    return {
      x: entity.x,
      y: entity.y,
      width: 24,
      height: 24,
    };
  }

  return null;
}
