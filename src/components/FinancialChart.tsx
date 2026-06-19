    import Chart from "react-apexcharts";

interface Props {
  data: {
    month: string;
    income: number;
    expense: number;
    savings: number;
  }[];
}

export default function FinancialChart({ data }: Props) {
  const options: ApexCharts.ApexOptions = {
    chart: {
     type: 'area',
    height: 350,
    zoom: {
      enabled: false,
    },
    },

    stroke: {
      curve: "straight",
    },

    colors: [
      "#22C55E",
      "#EF4444",
      "#3B82F6",
    ],

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: data.map((item) => item.month),
      labels: {
        style: {
          colors: "#64748B",
        },
      },
    },

    yaxis: {
      labels: {
        formatter: (value) =>
          `₹${Math.round(value / 1000)}k`,
      },
    },

    tooltip: {
      y: {
        formatter: (value) =>
          `₹${value.toLocaleString()}`,
      },
    },

     legend: {
    horizontalAlign: 'left',
  },
  };

  const series = [
    {
      name: "Expense",
      data: data.map((item) => item.expense),
    },
  ];

  return (
    <Chart
      options={options}
      series={series}
    />
  );
}