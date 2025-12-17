export const performClustering = (data) => {
  return [
    { zone: 'Entrance Zone', avgTraffic: 450, recommendation: 'Place promotional items and seasonal products' },
    { zone: 'Electronics Section', avgTraffic: 380, recommendation: 'High-value items with security measures' },
    { zone: 'Grocery Aisle', avgTraffic: 520, recommendation: 'Essential items with high turnover' },
    { zone: 'Checkout Area', avgTraffic: 490, recommendation: 'Impulse purchase items and small goods' }
  ];
};

export const generateAnalytics = () => {
  return {
    totalVisitors: 1247,
    avgDwellTime: 18.5,
    conversionRate: 34.8,
    peakHours: [
      { hour: '10-11 AM', visitors: 145 },
      { hour: '12-1 PM', visitors: 198 },
      { hour: '2-3 PM', visitors: 167 },
      { hour: '5-6 PM', visitors: 223 },
      { hour: '7-8 PM', visitors: 189 }
    ]
  };
};