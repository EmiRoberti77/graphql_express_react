import JobList from '../components/JobList';
//import { jobs } from '../lib/fake-data';
import { getJobs } from '../graphql/queries';
import { useEffect, useState } from 'react';

function HomePage() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getJobs();
      setJobs(response);
    };
    fetchJobs();
  }, []);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
