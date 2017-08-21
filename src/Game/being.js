import { Game } from './game';
import Entity from './entity';

export default class Being extends Entity {
  constructor(props) {
    super(props);
    this.health = props['health'] || 3;
    this.defence = props['defence'] || 0;
    this.attack = props['attack'] || 1;
  }
  newPosition(newX, newY) {
    // draws new position and deletes old
    // redraw old position
    let oldKey = Game._map.getTile(this._x, this._y);
    Game.display.draw(
      this._x,
      this._y,
      oldKey.getChar(),
      oldKey.getForeground(),
      oldKey.getBackground()
    );

    // redraw new position
    this._x = newX;
    this._y = newY;
    this.draw();
  }
  tryMove(x, y) {
    // returns true if walkable else false
    var tile = Game._map.getTile(x, y);
    // returns being if there is one else false
    let entity = Game._map.getEntity(x, y);
    // Check if we can walk on the tile
    if (tile.isWalkable() && !entity) return true;
    // Fights entity at new position
    if (entity) {
      this.combat(entity);
    }
    return false;
  }
  combat(entity) {
    entity.health -= this.attack - entity.defence;
    console.log(this, this.health);
    console.log(entity, entity.health);
    // todo: entity color changed for .5s when taking damage
    if (entity.health <= 0) {
      // Remove scheduler, Remove entity
      entity.getMap().removeEntity(entity);
      console.log(Game.scheduler);
    }
    if (this.name !== 'player') {
      // have the enemy fight back
      this.health -= entity.attack - this.defence;
      if (this.health <= 0) {
        // todo: endgame
        // event listener for enter then switchscreen
        console.log('player died');
        window.removeEventListener('keydown', this);
        Game.engine.lock();
        return;
      }
    }
  }
}
