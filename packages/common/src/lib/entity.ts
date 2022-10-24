import { UniqueEntityId } from './unique_entity_id';

const isEntity = (v: unknown): v is Entity<unknown> => {
  return v instanceof Entity;
};

export type EntityProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
// export abstract class Entity<EntityProps> {
export abstract class Entity<EntityProps> {
  protected readonly _id?: UniqueEntityId;
  public readonly props: EntityProps;

  constructor(props: EntityProps, id?: UniqueEntityId) {
    this._id = id;
    this.props = props;
  }

  public equals(object?: Entity<EntityProps>): boolean {
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
