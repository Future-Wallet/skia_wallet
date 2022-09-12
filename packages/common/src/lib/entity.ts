import { UniqueEntityId } from './unique_entity_id';

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

/**
 * Base entity class used on all the entities.
 *
 * Entities are objects that we determine their are unique because
 * of their `id`s.
 *
 * It cannot exist two entities with the same id. If you prefer to
 * not use an id, then use a `ValueObject`.
 */
export abstract class Entity<T> {
  protected readonly _id?: UniqueEntityId;
  public readonly props: T;

  constructor(props: T, id?: UniqueEntityId) {
    this._id = id;
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id == object._id;
  }
}
