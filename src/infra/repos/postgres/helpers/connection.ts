import { Connection, createConnection, getConnection, getConnectionManager, getRepository, ObjectLiteral, ObjectType, QueryRunner, Repository } from "typeorm";

import { ConnectionNotFoundError, TransactionNotFoundError } from "@/infra/repos/postgres/helpers";
import { DbTransaction } from "@/application/contracts";

export class PgConnection implements DbTransaction {
  private static instance?: PgConnection;
  private queryRunner?: QueryRunner;
  private connection?: Connection;

  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
      return PgConnection.instance;
    }
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    this.connection = getConnectionManager().has("default") ? getConnection() : await createConnection();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }
    await getConnection().close();
    this.queryRunner = undefined;
    this.connection = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }
    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.startTransaction();
  }

  async closeTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new TransactionNotFoundError();
    }
    await this.queryRunner.release();
  }

  async commitTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new TransactionNotFoundError();
    }
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new TransactionNotFoundError();
    }
    await this.queryRunner.rollbackTransaction();
  }

  getRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): Repository<Entity> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }
    if (this.queryRunner) {
      return this.queryRunner.manager.getRepository(entity);
    }

    return getRepository(entity);
  }
}
