import { HTTPMethod } from './HTTPMethod';
import * as joi from 'joi';

const debug = require('debug')('M0ckRoute');

export const m0ckRouteSchema = joi.object({
  description: joi.string(),
  operationId: joi.string(),
  request: joi.object({
    query: joi.any(),
    header: joi.any(),
    body: joi.any()
  }),
  response: joi.object({
    statusCode: joi
      .number()
      .integer()
      .min(100)
      .max(600)
      .required(),
    header: joi.any(),
    body: joi.any()
  })
});

export interface M0ckRouteProperties {
  method: HTTPMethod;
  route: string;
  request: any;
  response: any;
}

export class M0ckRoute implements M0ckRouteProperties {

  method: HTTPMethod;
  route: string;
  description: string;
  operationId: string;
  request: any;
  response: any;

  /**
   *
   * @param method
   * @param route
   */
  constructor (method: HTTPMethod, route: string) {
    this.method = method;
    this.route = route;
  }

  /**
   *
   * @param data
   */
  async loadFromFileData (data: any) {
    const values: any = await this.validate(data);

    this.description = values.description;
    this.operationId = values.operationId;
    this.request = values.request;
    this.response = values.response;
  }

  /**
   *
   * @param data
   */
  async validate (data: any): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      joi.validate(data, m0ckRouteSchema, (err: Error, value: any) => {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
    });
  }
}
