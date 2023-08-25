import JobList from '../components/JobList';
import { useJobs } from '../graphql/hooks';

function HomePage() {
  const { jobs, loading, error } = useJobs();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!jobs) return <div>no data</div>;

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
