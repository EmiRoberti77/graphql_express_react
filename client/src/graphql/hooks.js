import { useQuery } from '@apollo/client';
import { companyByIdQuery, getJobByIdQuery, jobsQuery } from './queries';

export function useCompany(companyId) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { companyId: companyId },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(jobId) {
  const { data, loading, error } = useQuery(getJobByIdQuery, {
    variables: {
      jobId,
    },
  });

  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
  });
  console.log(data, loading, error);
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}
