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

    // Red-shark: mismo hitbox que shark cuando está en el aire,
  // sin hitbox mientras nada/carga (solo aleta visible)
  if (entity.type === 'red-shark') {
    if (entity.state === 'jumping' || entity.state === 'falling') {
      return {
        x: entity.x + 10,
        y: entity.y + 10,
        width: 64,
        height: 80,
      };
    }
    return null; // swimming / charging: solo aleta, sin hitbox
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
      x: entity.x + 4,
      y: entity.y + 4,
      width: 16,
      height: 16,
    };
  }

  if (entity.type === 'bullet-wolf') {
    return {
      x: entity.x,
      y: entity.y - 20,
      width: 100,
      height: 60,
    };
  }

  if (entity.type === 'ship-wolf') {
    return {
      x: entity.x + 50,
      y: entity.y,
      width: 250,
      height: 300,
    };
  }
   
    // Air-ship boss — hitbox cubre el barco (parte inferior del sprite)
  // El sprite es 304x304 pero el barco real está en la mitad inferior
  if (entity.type === 'air-ship') {
    return { 
      x: entity.x + 30, 
      y: entity.y + 60, 
      width: 240, 
      height: 240 
    };
  }

  if (entity.type === 'enemy-bullet') {
    return {
      x: entity.x,
      y: entity.y,
      width: 8,
      height: 8,
    };
  }
  return null;
}

