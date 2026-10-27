import React, { useId } from "react";

// P10-1: the labels are now tied to their selects (htmlFor/id), so screen
// readers announce what each one filters — axe "select-name".
const ReviewFilter = ({ filterStars, sortOrder, setFilterStars, setSortOrder }) => {
  const id = useId();
  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-6 flex gap-4 items-center flex-wrap">
      <div>
        <label htmlFor={`${id}-stars`} className="mr-2 font-medium">Filter by Star:</label>
        <select
          id={`${id}-stars`}
          className="border rounded px-2 py-1"
          value={filterStars}
          onChange={(e) => setFilterStars(Number(e.target.value))}
        >
          <option value={0}>All</option>
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s} Stars
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-sort`} className="mr-2 font-medium">Sort:</label>
        <select
          id={`${id}-sort`}
          className="border rounded px-2 py-1"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

export default ReviewFilter;
