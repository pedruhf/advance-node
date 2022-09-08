import { ServerError, UnauthorizedError } from "@/application/errors";

export type HttpResponse = {
  statusCode: number;
  data: any;
};

export enum HttpStatusCode {
  badRequest = 400,
  unauthorized = 401,
  serverError = 500,
}

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.badRequest,
  data: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: HttpStatusCode.unauthorized,
  data: new UnauthorizedError(),
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.serverError,
  data: new ServerError(error),
});
