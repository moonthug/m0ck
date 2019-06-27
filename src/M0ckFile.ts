import { promises as fs } from 'fs';
import * as path from 'path';

import * as jsYaml from 'js-yaml';

import { mapStringToHTTPMethod } from './HTTPMethod';
import { M0ckRoute } from './M0ckRoute';

const _eval = require('eval');
const debug = require('debug')('M0ckFile');

export const validExtensions = ['.js', '.yaml'];

/**
 *
 * @param filePath
 */
const loadYAMLFile = async (filePath: string): Promise<any> => {
  const file = await fs.readFile(filePath);
  const fileString = file.toString();
  return jsYaml.safeLoad(fileString);
};

/**
 *
 * @param filePath
 */
const loadJSFile = async (filePath: string): Promise<any> => {
  const file = await fs.readFile(filePath);
  const fileString = file.toString();
  return _eval(fileString);
};

/**
 *
 */
export class M0ckFile {
  filePath: string;
  srcDir: string;

  m0ckRoutes: Array<M0ckRoute>;

  /**
   *
   * @param filePath
   * @param srcDir
   */
  constructor (filePath: string, srcDir: string) {
    this.filePath = filePath;
    this.srcDir = srcDir;

    this.m0ckRoutes = new Array<M0ckRoute>();
  }

  /**
   *
   */
  async loadFile (): Promise<void> {
    const extension = path.extname(this.filePath).toLowerCase();

    if (validExtensions.indexOf(extension) === -1) {
      debug(`Invalid extension '%s' for file '%s'`, extension, this.filePath);
      return null;
    }

    const basename = path.basename(this.filePath, extension);
    const route = '/' + path.relative(this.srcDir, path.dirname(this.filePath));
    const method = mapStringToHTTPMethod(basename);

    if (!method) {
      debug(`Invalid method '%s' for file '%s'`, method, this.filePath);
      return null;
    }

    // @TODO Support JSON?
    let data: any;
    try {
      let fileData;
      switch (extension) {
        case '.yaml':
          fileData = await loadYAMLFile(this.filePath);
          break;

        case '.js':
          fileData = await loadJSFile(this.filePath);
          break;
      }

      if (fileData.hasOwnProperty('routes')) {
        fileData = fileData.routes;
      }

      data = Array.isArray(fileData) ? fileData : [fileData];
    } catch (e) {
      debug(`Could not load YAML file '%s'`, this.filePath);
      throw e;
    }

    for (const m0ckData of data) {
      const m0ckRoute = new M0ckRoute(method, route);
      await m0ckRoute.loadFromFileData(m0ckData);
      this.m0ckRoutes.push(m0ckRoute);
    }
    debug(`M0ck file '%s' loaded'`, this.filePath);
  }

}
