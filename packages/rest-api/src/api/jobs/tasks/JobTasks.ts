import { z } from 'zod';

import { get } from '../../../operators/get.js';
import { getById } from '../../../operators/getById.js';
import { Pagination } from '../../../shared.js';
import type { ThreekitAuthProps } from '../../../ThreekitAuthProps.js';
import { Route } from '../../Route.js';
import { JobRun } from '../runs/JobRuns.js';

export const JobTask = z.object({
  id: z.string().uuid(),
  runs: z.array(JobRun)
});
export type JobTask = z.infer<typeof JobTask>;

export const JobTaskListing = Pagination.merge(
  z.object({
    tasks: z.array(JobTask)
  })
);
export type JobTaskListing = z.infer<typeof JobTaskListing>;

export const QueryJobTaskProps = z.object({
  jobId: z.string().uuid().optional(),
  runStatus: z.string().optional()
});
export type QueryJobTaskProps = z.infer<typeof QueryJobTaskProps>;

const API_ROUTE = '/jobs/tasks';

export class JobTasks extends Route {
  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
  }

  get(queryProps?: QueryJobTaskProps) {
    return get<QueryJobTaskProps, JobTaskListing>(this.context, queryProps);
  }

  getById(id: string) {
    const assetId = z.string().uuid().parse(id);
    return getById<JobTask>(this.context, assetId);
  }
}
