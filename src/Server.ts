import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';

export interface ServerOptions {
  port: number;
  handler: (ctx: Koa.Context, next: Function) => void;
}

export class Server {
  server: Koa;

  /**
   *
   */
  constructor (options: ServerOptions) {
    this.server = new Koa();
    this.server.use(cors());
    this.server.use(bodyParser());
    this.server.use(options.handler);
  }

  /**
   *
   */
  listen (): void {
    this.server.listen(8080);
  }
}
