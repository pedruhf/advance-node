import { ServerError, UnauthorizedError } from "@/application/errors";

export type HttpResponse<T = any> = {
  statusCode: number;
  data: T;
};

export enum HttpStatusCode {
  ok = 200,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  serverError = 500,
}

export const success = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.ok,
  data,
});

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.badRequest,
  data: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: HttpStatusCode.unauthorized,
  data: new UnauthorizedError(),
});

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.serverError,
  data: new ServerError(error),
});
