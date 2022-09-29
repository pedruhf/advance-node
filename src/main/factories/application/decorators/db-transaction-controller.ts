import { Controller } from "@/application/controllers";
import { DbTransactionControllerDecorator } from "@/application/decorators";
import { makePgConnection } from "../../infra/repos/helpers";

export const makePgTransactionController = (decoratee: Controller): DbTransactionControllerDecorator => {
  return new DbTransactionControllerDecorator(decoratee, makePgConnection());
};
