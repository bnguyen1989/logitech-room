import { z } from 'zod';

import { get } from '../../../operators/get.js';
import { getById } from '../../../operators/getById.js';
import { Pagination } from '../../../shared.js';
import type { ThreekitAuthProps } from '../../../ThreekitAuthProps.js';
import { File } from '../../files/Files.js';
import { Route } from '../../Route.js';

export const JobRun = z.object({
  results: z.object({
    files: z.array(File)
  })
});
export type JobRun = z.infer<typeof JobRun>;

export const JobRunListing = Pagination.merge(
  z.object({
    runs: z.array(JobRun)
  })
);
export type JobRunListing = z.infer<typeof JobRunListing>;

export const QueryJobRunProps = z.object({
  jobId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional()
});
export type QueryJobRunProps = z.infer<typeof QueryJobRunProps>;

const API_ROUTE = '/jobs/runs';

export class JobRuns extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  get(queryProps?: QueryJobRunProps) {
    return get<QueryJobRunProps, JobRunListing>(this.context, queryProps);
  }

  getById(id: string) {
    const assetId = z.string().uuid().parse(id);
    return getById<JobRun>(this.context, assetId);
  }
}
