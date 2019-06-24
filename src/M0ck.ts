import * as readdir from 'recursive-readdir';
import { Context } from 'koa';

import { M0ckFile } from './M0ckFile';
import { Server } from './Server';
import { M0ckRouteList } from './M0ckRouteList';
import { M0ckRoute } from './M0ckRoute';
import { mapStringToHTTPMethod } from './HTTPMethod';

const debug = require('debug')('m0ck');

export interface M0ckOptions {
  srcDir: string;
  host?: string;
  port?: number;
}

export class M0ck {
  server: Server;
  m0ckRoutes: M0ckRouteList;
  options: M0ckOptions;

  /**
   *
   * @param options
   */
  constructor (options: M0ckOptions) {
    this.options = options;

    this.server = new Server({
      host: options.host || '0.0.0.0',
      port: options.port || 8080,
      handler: this.routeHandler.bind(this)
    });

    this.m0ckRoutes = new M0ckRouteList();
  }

  /**
   *
   */
  async startup (): Promise<void> {
    const files: Array<M0ckFile> = await this.loadMocks();
    files.forEach((m0ckFile: M0ckFile) => {
      m0ckFile.m0ckRoutes.forEach((m0ckRoute: M0ckRoute) => {
        this.m0ckRoutes.add(m0ckRoute);
      });
    });
    console.log(`Loaded ${files.length} mock files [${this.m0ckRoutes.routes.length} routes]`);

    this.server.listen();
    console.log(`Server started at: ${this.server.host}:${this.server.port}`);
  }

  /**
   *
   * @param ctx
   * @param next
   */
  private async routeHandler (ctx: Context, next: Function): Promise<any> {
    const m0ckRoute: M0ckRoute = this.m0ckRoutes.match({
      headers: ctx.headers,
      query: ctx.query,
      body: ctx.request.body,
      method: mapStringToHTTPMethod(ctx.method),
      path: ctx.path
    });

    if (!m0ckRoute) {
      debug('Route %s %s not mocked', ctx.req.method, ctx.req.url);
      ctx.status = 404;
      ctx.body = 'Not Mocked';
      return;
    }

    console.log(`Route matched: ${ctx.method} ${ctx.path} [${m0ckRoute.description}]`);


    ctx.body = m0ckRoute.response.body;
  }

  /**
   *
   */
  private async loadMocks (): Promise<Array<M0ckFile>> {
    const filePaths = await this.readMockDirectory();

    if (filePaths.length === 0) {
      debug('No m0ck files found in source directory: %s', this.options.srcDir);
      throw new Error('Could not find any m0ck files');
    }

    const files = await this.loadM0ckFiles(filePaths);

    if (files.length === 0) {
      debug('No valid m0ck files found in sources directory: %s', this.options.srcDir);
      throw new Error('Could not find any valid m0ck files');
    }

    debug('Found %d m0ck files', filePaths.length);

    return files;
  }

  /**
   *
   */
  private async readMockDirectory (): Promise<Array<string>> {
    let filePaths: Array<string>;
    try {
      filePaths = await new Promise<Array<string>>((resolve: Function, reject: Function) => {
        readdir(this.options.srcDir, [`.*`], (err: Error, files: Array<string>) => {
          if (err) {
            return reject(err);
          }
          return resolve(files);
        });
      });
    } catch (e) {
      debug('Could not read m0ck files from directory: %s', this.options.srcDir);
      throw e;
    }

    return filePaths;
  }

  /**
   *
   * @param filePaths
   */
  private async loadM0ckFiles (filePaths: Array<string>): Promise<Array<M0ckFile>> {
    const files: Array<M0ckFile> = [];
    for (const filePath of filePaths) {
      let m0ckFile = new M0ckFile(filePath, this.options.srcDir);

      try {
        await m0ckFile.loadFile();
      } catch (e) {
        console.log(`Could not load m0ck file: ${filePath}`);
        throw e;
      }

      files.push(m0ckFile);
    }

    return files;
  }
}
