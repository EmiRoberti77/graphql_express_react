import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import {
  companyByIdQuery,
  getJobByIdQuery,
  jobsQuery,
  createJobMutation,
} from './queries';

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

export function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: {
      limit,
      offset,
    },
    fetchPolicy: 'network-only',
  });

  return {
    items: data?.jobs?.items,
    totalCount: data?.jobs?.totalCount,
    loading,
    error: Boolean(error),
  };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: getJobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };

  return {
    createJob,
    loading,
  };
}
