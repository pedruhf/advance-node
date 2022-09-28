import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addPictureAndInitialsToUsuariosTable1664327822148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("usuarios", new TableColumn({ name: "foto", type: "varchar", isNullable: true }));
    await queryRunner.addColumn("usuarios", new TableColumn({ name: "iniciais", type: "varchar", isNullable: true }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("usuarios", "foto");
    await queryRunner.dropColumn("usuarios", "iniciais");
  }
}
