import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const PieChartCard = () => {
  // Assuming these data are fetched from an API or stored in state
  const chartData = [
    { title: 'Category 1', value: 30, color: '#EF4444' },
    { title: 'Category 2', value: 70, color: '#F59E0B' },
  ];

  return (
    <div className="cards">
      <div className="bg-white rounded-lg">
        <div className="flex justify-center">
          <div className="chart-container">
            <PieChart
              data={chartData}
              radius={30} // Adjust the radius to fit the desired size
              lineWidth={40} // Adjust the line width to fit the desired size
              segmentsShift={(index) => (index === 0 ? 0 : 0.5)}
            />
          </div>
        </div>
        {/* Rest of the code */}
      </div>
    </div>
  );
};

export default PieChartCard;
