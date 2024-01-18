import { z } from 'zod';

import { healthcheck } from '../../operators/healthCheck.js';
import { request } from '../../operators/request.js';
import { Configuration, EntityMetadata } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { JobRun } from '../jobs/runs/JobRuns.js';
import { Route } from '../Route.js';

export const ExportFormat = z.enum(['glb', 'usdz', 'step', 'stl', 'dxf']);
export type ExportFormat = z.infer<typeof ExportFormat>;

export const RendererType = z.enum(['webgl', 'vray']);
export type RendererType = z.infer<typeof RendererType>;

export const AssetJobImportProps = z.object({
  fileId: z.string().uuid(),
  parentFolderId: z.string().uuid().optional(),
  targetAssetId: z.string().uuid().optional(),
  sync: z.boolean().optional(),
  settings: z
    .object({
      vrSceneMode: z.string().optional(),
      vrSceneTool: z.string().optional(),
      importAs: z.string().optional(),
      dontOverwriteAssets: z.boolean().optional(),
      updateMaterials: z.boolean().optional(),
      updateTextures: z.boolean().optional()
    })
    .optional()
});
export type AssetJobImportProps = z.infer<typeof AssetJobImportProps>;

export const AssetJobsExportProps = z.object({
  assetId: z.string(),
  configuration: Configuration.optional(),
  format: ExportFormat,
  cache: z.string().optional(),
  sync: z.boolean().optional(),
  settings: z
    .object({
      arExport: z.boolean().optional()
    })
    .optional()
});
export type AssetJobExportProps = z.infer<typeof AssetJobsExportProps>;

export const AssetJobsExportResponse = EntityMetadata.merge(
  z.object({
    fileId: z.string().uuid(),
    jobId: z.string().uuid(),
    job: z.object({
      _id: z.string().uuid(),
      runs: z.array(JobRun)
    })
  })
);
export type AssetJobExportResponse = z.infer<typeof AssetJobsExportResponse>;

export const AssertJobRenderWebGLProps = z.object({
  assetId: z.string().uuid(),
  configuration: Configuration.optional(),
  stageId: z.string().uuid().optional(),
  stageConfiguration: Configuration.optional(),
  sync: z.boolean().optional(),
  cache: z.boolean().optional(),
  wait: z.boolean().optional()
});
export type AssetJobRenderWebGLProps = z.infer<
  typeof AssertJobRenderWebGLProps
>;

export const AssetJobRenderVRayProps = z.object({
  assetId: z.string().uuid(),
  configuration: Configuration.optional(),
  stageId: z.string().uuid().optional(),
  stageConfiguration: Configuration.optional(),
  type: RendererType.optional(),
  layerId: z.string().uuid().optional(),
  configurations: z.array(Configuration).optional(),
  subset: z.object({}).optional(),
  cache: z.boolean().optional(),
  wait: z.boolean().optional()
});
export type AssetJobRenderVRayProps = z.infer<typeof AssetJobRenderVRayProps>;

const API_ROUTE = `/api/asset-jobs`;

export class AssetJobs extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  healthcheck() {
    return healthcheck(this.context);
  }

  import(_importProps: AssetJobImportProps) {
    throw new Error('Not implemented');
  }

  export(exportProps: AssetJobExportProps) {
    // TODO: Make this more generic to support any export type, copy from Node-SDK project.
    const {
      assetId,
      configuration = {},
      cache = 'true',
      sync = false,
      format,
      settings
    } = AssetJobsExportProps.parse(exportProps);

    return request<AssetJobExportResponse>(this.context, {
      method: 'POST',
      url: `${assetId}/export/${format}`,
      params: { orgId: this.context.auth.orgId },
      data: {
        assetId,
        cache,
        sync,
        configuration,
        settings
      }
    });
  }
}
