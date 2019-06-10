import * as Joi from 'Joi';
import * as Koa from 'koa';

import { HTTPMethod } from './HTTPMethod';
import {HTTPRequest} from "./M0ckRouteList";

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
  match (request: HTTPRequest): boolean {
    if (this.request.headers) {
      if (!this.matchObject(this.request.headers, request.headers)) {
        return false;
      }
    }

    if (this.request.query) {
      if (!this.matchObject(this.request.query, request.query)) {
        return false;
      }
    }

    if (this.request.body) {
      if (!this.matchObject(this.request.body, request.body)) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param object1
   * @param object2
   */
  matchObject (object1: any, object2: any): boolean {
    for (const key in object1) {
      if (object1[key] !== object2[key]) return false;

      if (typeof (object1[key]) === 'object') {
        if (!this.matchObject(object1[key], object2[key])) {
          return false;
        }
      } else {
        if (object1[key] !== object2[key]) {
          return false;
        }
      }
    }

    return true;
  }
}
