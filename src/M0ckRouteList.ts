import { M0ckRoute } from './M0ckRoute';
import { HTTPMethod } from './HTTPMethod';

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
   * @param method
   * @param path
   */
  match (method: HTTPMethod, path: string): M0ckRoute {
    const match = this.routes.find((m0ckRoute: M0ckRoute) => {
      return m0ckRoute.method === method && m0ckRoute.route === path;
    });

    if (!match) {
      return null;
    }

    return match;
  }
}
