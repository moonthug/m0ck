import * as Joi from 'joi';

import { HTTPMethod } from './HTTPMethod';
import { HTTPRequest } from './M0ckRouteList';

const debug = require('debug')('M0ckRoute');

export const m0ckRouteSchema = Joi.object({
  description: Joi.string(),
  operationId: Joi.string(),
  request: Joi.object({
    query: Joi.any(),
    header: Joi.any(),
    body: Joi.any()
  }),
  response: Joi.object({
    statusCode: Joi
      .number()
      .integer()
      .min(100)
      .max(600)
      .required(),
    header: Joi.any(),
    body: Joi.any()
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

    this.description = values.description || 'No Description';
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
      Joi.validate(data, m0ckRouteSchema, (err: Error, value: any) => {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
    });
  }

  /**
   *
   * @param request
   */
  match (request: HTTPRequest): number {
    // @TODO make matching better. Current is too basic

    let match = 0;

    if (!this.request) {
      match++;
      return match;
    }

    if (this.request.header) {
      match++;
      match += this.scoreObjectMatch(this.request.header, request.headers);
    }

    if (this.request.query) {
      match++;
      match += this.scoreObjectMatch(this.request.query, request.query);
    }

    if (this.request.body) {
      match++;
      match += this.scoreObjectMatch(this.request.body, request.body);
    }

    return match;
  }

  /**
   *
   * @param object1
   * @param object2
   * @param matchedProperties
   */
  scoreObjectMatch (object1: any, object2: any, matchedProperties: number = 0): number {
    for (const key in object1) {
      if (Object.prototype.hasOwnProperty.call(object1, key) !== Object.prototype.hasOwnProperty.call(object2, key)) {
        return matchedProperties;
      }

      if (typeof (object1[key]) === 'object') {
        if (!this.scoreObjectMatch(object1[key], object2[key], matchedProperties)) {
          return matchedProperties;
        }
      } else {
        if (object1[key] !== object2[key]) {
          return matchedProperties;
        } else {
          matchedProperties++;
        }
      }
    }

    return matchedProperties;
  }
}
