import { z } from 'zod';

import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { EntityMetadata, Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';

export const PlayerSettings = z.object({
  logo: z.boolean(),
  arSize: z.number(),
  arButton: z.boolean(),
  vraySize: z.number(),
  webglSize: z.number(),
  helpButton: z.boolean(),
  imageFormat: z.string(),
  shareButton: z.boolean(),
  zipManifest: z.boolean(),
  zoomEnabled: z.boolean(),
  imageFitMode: z.string(),
  imageQuality: z.number(),
  defaultStages: z.object({
    model: z.string(),
    texture: z.string(),
    material: z.string()
  }),
  imageResolution: z.string(),
  zoomImageFormat: z.string(),
  fullScreenButton: z.boolean(),
  zoomImageQuality: z.number(),
  defaultPlayerMode: z.string(),
  checkAssetFileSize: z.boolean(),
  saveSceneGraphState: z.boolean(),
  zoomImageResolution: z.string(),
  zoomImageLoadingDelay: z.number(),
  skipEvalInvisibleNodes: z.boolean(),
  connectorSnappingDistance: z.number(),
  deferEvalConfiguratorAsset: z.boolean()
});
export type PlayerSettings = z.infer<typeof PlayerSettings>;

export const OrgFeatures = z.object({
  vrayRendering: z.boolean(),
  webGLRendering: z.boolean(),
  productConfiguration: z.string(),
  approvalWorkflow: z.boolean(),
  productsLimit: z.number(),
  assetsLimit: z.number(),
  usersLimit: z.number(),
  publicShare: z.boolean(),
  webglRoughness: z.string(),
  subscriptionStartDate: z.string(),
  rapidCompactCompression: z.boolean().nullable(),
  rapidCompactCompressionHost: z.string(),
  rapidCompactCompressionToken: z.string().nullable(),
  rapidCompactCompressionLimit: z.number(),
  dwgImport: z.string().nullable(),
  dwgImportLimit: z.number(),
  renderHoursLimit: z.number(),
  jobPriority: z.number(),
  showWarnings: z.boolean(),
  vrayVersion: z.string(),
  webglRenderMode: z.string(),
  advancedAr: z.number(),
  basicAr: z.boolean(),
  playerWaterMark: z.boolean(),
  advancedAnalytics: z.boolean(),
  fastCompositor: z.boolean()
});
export type OrgFeatures = z.infer<typeof OrgFeatures>;

export const OrgMember = z.object({
  id: z.string().uuid(),
  joinedAt: z.string().optional()
});
export type OrgMember = z.infer<typeof OrgMember>;

export const Org = EntityMetadata.merge(
  z.object({
    id: z.string().uuid(),
    slug: z.string(),
    name: z.string(),
    members: z.array(OrgMember),
    userId: z.string().uuid(),
    profile: z.record(z.string(), z.string()),
    features: OrgFeatures,
    playerSettings: PlayerSettings,
    languages: z.object({
      values: z.array(
        z.object({
          label: z.string(),
          value: z.string()
        })
      ),
      defaultValue: z.string()
    }),
    clientId: z.string().nullable(),
    featureflags: z.string().uuid(),
    supportAccessEndOn: z.string().nullable()
  })
);
export type Org = z.infer<typeof Org>;

export const OrgListing = Pagination.merge(
  z.object({
    orgs: Org.array()
  })
);
export type OrgListing = z.infer<typeof OrgListing>;

export type QueryOrgProps = object; // TODO: Define this.

const API_ROUTE = `/api/orgs`;

export class Orgs extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  /*
  BEN: This route does not exist on the /orgs REST API endpoint as of Dec 6, 2023
  healthcheck() {
    return healthcheck(this.context);
  }*/

  get(queryProps?: QueryOrgProps) {
    return get<QueryOrgProps, OrgListing>(this.context, queryProps);
  }

  getById(id?: string) {
    const orgId = z
      .string()
      .uuid()
      .parse(id ?? this.context.auth.orgId);
    return getById<Org>(this.context, orgId);
  }
}
