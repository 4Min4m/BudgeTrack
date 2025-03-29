import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useStore } from '../store/useStore';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FinancialInsights: React.FC = () => {
  const receipts = useStore((state) => state.receipts);

  // Calculate spending by category
  const spendingByCategory = receipts.reduce((acc, receipt) => {
    acc[receipt.category] = (acc[receipt.category] || 0) + receipt.total;
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(spendingByCategory),
    datasets: [
      {
        data: Object.values(spendingByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  // Monthly spending data
  const monthlySpending = receipts.reduce((acc, receipt) => {
    const month = receipt.date.toLocaleString('default', { month: 'long' });
    acc[month] = (acc[month] || 0) + receipt.total;
    return acc;
  }, {} as Record<string, number>);

  const barData = {
    labels: Object.keys(monthlySpending),
    datasets: [
      {
        label: 'Monthly Spending',
        data: Object.values(monthlySpending),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
          <div className="h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Spending</h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Budget Overview</h3>
        <div className="space-y-4">
          {useStore((state) => state.budgets).map((budget) => (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{budget.category}</span>
                <span className="text-sm text-gray-500">
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialInsights;