import React, { useState, useEffect } from 'react';
import { range } from 'lodash';

const History = () => {
  const pageSize = 5;
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch members data based on userId from localStorage
    const userId = localStorage.getItem('userId');
    fetch(`api/v1/member/getmembers?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  // Generate history entries for the current page
  const generateHistoryEntries = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return members.slice(startIndex, startIndex + pageSize).map((member) => ({
      id: member.id,
      memberName: member.name,
      event: member.event,
      date: member.date,
    }));
  };

  // Get history entries for the current page
  const historyEntries = generateHistoryEntries();

  return (
    <div className="m-4">
      <div className="history bg-white p-4">
        <div className="text-xl font-bold mb-4">Recent Activities</div>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Event</th>
                <th className="py-2 px-4">Member Name</th>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {historyEntries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="py-2 px-4">{entry.event}</td>
                  <td className="py-2 px-4">{entry.memberName}</td>
                  <td className="py-2 px-4">{entry.id}</td>
                  <td className="py-2 px-4">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Render pagination */}
        <div className="flex bg-gray-200 justify-end mt-4">
          {range(1, Math.ceil(members.length / pageSize) + 1).map((page) => (
            <button
              key={page}
              className={`${currentPage === page ? 'main-bg text-white' : 'bg-gray-200 text-gray-700'
                } w-8 h-8 mx-1 focus:outline-none`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
