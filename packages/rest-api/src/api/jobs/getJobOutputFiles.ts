import { File } from '../files/Files.js';
import { Job } from './Jobs.js';

export const getJobOutputFiles = async (job: Job) => {
  const files: File[] = [];
  job.runs.forEach((run) => {
    run.results.files.forEach((file: File) => {
      files.push(file);
    });
  });
  return files;
};
