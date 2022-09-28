import { ObjectLiteral, ObjectType, Repository } from "typeorm";

import { PgConnection } from "@/infra/repos/postgres/helpers";

export abstract class PgRepo {
  constructor(private readonly connection: PgConnection = PgConnection.getInstance()) {}

  getRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity);
  }
}
