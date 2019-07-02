import * as Koa from 'koa';

import { M0ckRoute } from './M0ckRoute';
import { HTTPMethod, mapStringToHTTPMethod } from './HTTPMethod';

const debug = require('debug')('M0ckRouteList');

export interface HTTPRequest {
  headers?: any;
  query?: any;
  body?: any;
  method: HTTPMethod;
  path: string;
}

interface ScoredM0ckRoute {
  score: number;
  m0ckRoute: M0ckRoute;
}

export class M0ckRouteList {
  routes: Array<M0ckRoute>;

  /**
   *
   */
  constructor () {
    this.routes = new Array<M0ckRoute>();
  }

  /**
   *
   * @param m0ckRoute
   */
  add (m0ckRoute: M0ckRoute): void {
    this.routes.push(m0ckRoute);
  }

  /**
   *
   * @param request
   */
  match (request: HTTPRequest): M0ckRoute {

    // Match path and Method
    const routeMatches = this.routes.filter((m0ckRoute: M0ckRoute) => {
      return m0ckRoute.method === request.method && m0ckRoute.route === request.path;
    });

    debug('Found %d route matches for %s %s', routeMatches.length, request.method, request.path);

    if (routeMatches.length === 0) {
      return null;
    }

    const requestMatches = routeMatches
      .map((m0ckRoute: M0ckRoute): ScoredM0ckRoute => {
        const score = m0ckRoute.match(request);
        return { m0ckRoute, score };
      })
      .filter((scoredM0ckRoute: ScoredM0ckRoute) => {
        return scoredM0ckRoute.score !== 0;
      })
      .sort((a: ScoredM0ckRoute, b: ScoredM0ckRoute) => {
        return b.score - a.score;
      });

    if (requestMatches.length === 0) {
      return null;
    }

    debug('Found %d request matches', requestMatches.length);

    return requestMatches[0].m0ckRoute;
  }
}
