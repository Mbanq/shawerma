export module log {
  export function info(args: any): void
  export function error(args: any): void
  export function debug(args: any): void
}

export function Response(
  statusCode: number,
  data: any,
  cors: boolean = true
): ResponseType

export function HttpError(
  statusCode: number,
  message: string,
  cors: boolean = true
): HttpError

export function createHandler(handler: any): any

export interface LogType {
  info: (args: string) => void;
  error: (args: string) => void;
  debug: (args: string) => void;
}
export interface ResponseType {
  statusCode: number;
  body: any;
  headers?: object;
}
export interface HttpErrorType {
  statusCode: number;
  body: any;
  headers?: object;
}

export interface ShawermaInstance {
  createHandler(): void;
  log(): LogType;
  Response(): ResponseType;
  HttpError(): HttpErrorType;
}

declare const shawerma: ShawermaInstance;

export default shawerma;
