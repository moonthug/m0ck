import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';

const debug = require('debug')('m0ck:server');

export interface ServerOptions {
  host?: string;
  port?: number;
  handler: (ctx: Koa.Context, next: Function) => void;
}

export class Server {
  server: Koa;
  host: string;
  port: number;

  /**
   *
   */
  constructor (options: ServerOptions) {
    this.host = options.host || '0.0.0.0';
    this.port = options.port || 8080;
    this.server = new Koa();
    this.server.use(cors());
    this.server.use(bodyParser());
    this.server.use(options.handler);
  }

  /**
   *
   */
  listen (): void {
    debug('Starting server at %s:%s', this.port, this.host);
    this.server.listen(this.port, this.host);
  }
}
