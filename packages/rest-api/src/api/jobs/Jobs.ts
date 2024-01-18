import { z } from 'zod';

import { get } from '../../operators/get.js';
import { getById } from '../../operators/getById.js';
import { Pagination } from '../../shared.js';
import type { ThreekitAuthProps } from '../../ThreekitAuthProps.js';
import { Route } from '../Route.js';
import { JobRun, JobRuns } from './runs/JobRuns.js';
import { JobTasks } from './tasks/JobTasks.js';

export const Job = z.object({
  id: z.string().uuid(),
  runs: z.array(JobRun)
});
export type Job = z.infer<typeof Job>;

export const JobListing = Pagination.merge(
  z.object({
    jobs: z.array(Job)
  })
);
export type JobListing = z.infer<typeof JobListing>;

export const QueryJobProps = z.object({
  status: z.string().optional()
});
export type QueryJobProps = z.infer<typeof QueryJobProps>;

const API_ROUTE = '/jobs';

export class Jobs extends Route {
  public runs: JobRuns;
  public tasks: JobTasks;

  constructor(auth: ThreekitAuthProps) {
    super(auth, API_ROUTE);
    this.runs = new JobRuns(auth);
    this.tasks = new JobTasks(auth);
  }

  get(queryProps?: QueryJobProps) {
    return get<QueryJobProps, JobListing>(this.context, queryProps);
  }

  getById(id: string) {
    const assetId = z.string().uuid().parse(id);
    return getById<Job>(this.context, assetId);
  }
}
