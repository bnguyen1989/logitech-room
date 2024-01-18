import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';
import { Glb } from './glb/Glb.js';

const API_ROUTE = `/api/alpha`;

export class Alpha extends Route {
  public glb: Glb;

  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
    this.glb = new Glb(auth);
  }
}
