import { z } from 'zod';

import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { healthcheck } from '../../operators/healthCheck.js';
import { EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

const AccessTokenBase = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  domains: z.array(z.string()),
  permissions: z.enum(['public', 'private']),
  lastUsedOn: z.string().optional(),
  serviceAccountId: z.string()
});

export const AccessToken = EntityMetadata.merge(AccessTokenBase);
export type Accesstoken = z.infer<typeof AccessToken>;

export const AccessTokenListing = Pagination.merge(
  z.object({
    accesstokens: z.array(AccessToken)
  })
);
export type AccesstokenListing = z.infer<typeof AccessTokenListing>;

export const CreateAccessTokenProps = AccessToken.pick({
  orgId: true,
  name: true,
  domains: true,
  permissions: true,
  serviceAccountId: true
});
export type CreateAccesstokenProps = z.infer<typeof CreateAccessTokenProps>;

export type QueryAccessTokenProps = {
  serviceAccountId?: string;
};

const API_ROUTE = `/api/accesstokens`;

export class AccessTokens extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  async get(queryProps: QueryAccessTokenProps) {
    return get<QueryAccessTokenProps, AccesstokenListing>(
      this.context,
      queryProps
    );
  }

  getById(tokenId: string) {
    return getById<Accesstoken>(this.context, tokenId);
  }

  async validateToken(origin: string, token: string) {
    const {
      data: { deletedAt, permissions, domains }
    } = await this.getById(token);

    if (deletedAt) {
      throw new Error(`${token} token is removed.`);
    }

    if (permissions === 'private') {
      return;
    }

    const isDomainsListingValid = Array.isArray(domains) && domains.length > 0;
    const isDomainsMatchOrigin = domains.some((domainOrPattern) =>
      this.validateDomain(origin, domainOrPattern)
    );

    if (!isDomainsListingValid || !isDomainsMatchOrigin) {
      throw new Error(`${token} token do not have ${origin} whitelisted.`);
    }
  }

  validateDomain(domain: string, domainOrPattern: string): boolean {
    const WILDCARD = '*';

    if (!domainOrPattern.includes(WILDCARD)) {
      return domainOrPattern.includes(domain);
    }

    const [, afterWildcardPattern] = domainOrPattern.split(WILDCARD);

    return domain.endsWith(afterWildcardPattern);
  }
}
