import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../graphql/hooks';

const JOBS_PER_PAGE = 5;
const direction = {
  FORWARD: 'forward',
  BACKWARDS: 'backwards',
};

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { items, totalCount, loading, error } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );
  console.log('totalCount', totalCount);
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (!items) return <div>no data</div>;

  const onChangePage = (dir) => {
    switch (dir) {
      case direction.FORWARD:
        setCurrentPage(currentPage + 1);
        break;
      case direction.BACKWARDS:
        setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={items} />
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => onChangePage(direction.BACKWARDS)}
        >
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onChangePage(direction.FORWARD)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
