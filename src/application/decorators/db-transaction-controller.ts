import { HttpResponse } from "@/application/helpers";
import { Controller } from "@/application/controllers";
import { DbTransaction } from "@/application/contracts";

export class DbTransactionControllerDecorator extends Controller {
  constructor(private readonly decoratee: Controller, private readonly db: DbTransaction) {
    super();
  }

  async perform(httpRequest: any): Promise<HttpResponse> {
    await this.db.openTransaction();
    try {
      const httpResponse = await this.decoratee.perform(httpRequest);
      await this.db.commitTransaction();
      return httpResponse;
    } catch (error) {
      await this.db.rollbackTransaction();
      throw error;
    } finally {
      await this.db.closeTransaction();
    }
  }
}
