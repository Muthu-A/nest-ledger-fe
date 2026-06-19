import {
  Lightbulb,
  Target,
  Shield,
  TrendingUp,
  HeartHandshake,
  Award,
} from "lucide-react";
import type { ReactNode } from "react";

import "./smartPlanner.css";
import { useState, useEffect } from "react";
import { useMonth } from '../../context/MonthContext'
import { financialPlannerService } from "../../services/financialPlannerService";

interface HealthScore {
  score: number;
  grade: string;
}

interface SalaryAllocation {
  name: string;
  amount: number;
  percentage: number;
}

interface Recommendation {
  type: 'GOAL_CONTRIBUTION' | 'ALERT' | 'INVESTMENT' | 'EMERGENCY_FUND';
  title: string;
  message: string;
}

const iconMap: { [key: string]: ReactNode } = {
  'Family Expenses': <HeartHandshake size={18} />,
  'Goals': <Target size={18} />,
  'Investments': <TrendingUp size={18} />,
  'Emergency Fund': <Shield size={18} />,
  'Miscellaneous': <Award size={18} />,
  'Personal': <Award size={18} />,
};

const classNameMap: { [key: string]: string } = {
  'Family Expenses': 'family',
  'Goals': 'goals',
  'Investments': 'investments',
  'Emergency Fund': 'emergency',
  'Miscellaneous': 'personal',
  'Personal': 'personal',
};

const recommendationTypeMap: { [key: string]: string } = {
  'GOAL_CONTRIBUTION': 'success',
  'ALERT': 'warning',
  'INVESTMENT': 'info',
  'EMERGENCY_FUND': 'info',
};

const recommendationIconMap: { [key: string]: ReactNode } = {
  'GOAL_CONTRIBUTION': <Target size={18} />,
  'ALERT': <Shield size={18} />,
  'INVESTMENT': <TrendingUp size={18} />,
  'EMERGENCY_FUND': <Shield size={18} />,
};

export default function SmartFinancialPlanner() {
  const [healthScore, setHealthScore] = useState<HealthScore>({ score: 0, grade: 'A' });
  const [allocations, setAllocations] = useState<SalaryAllocation[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const { month } = useMonth()

  useEffect(() => {
    loadPlannerData();
  }, [month]);

  const loadPlannerData = async () => {
    try {
      const response = await financialPlannerService.getPlannerData(month);
      if (response.success) {
        setHealthScore(response.data.healthScore);
        setAllocations(response.data.salaryAllocation);
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error('Failed to load planner data:', error);
    }
  };

  return (
    <div className="planner-container">
      {/* Header */}
      <div className="planner-header">
        <Lightbulb size={20} />
        <h3>Smart Financial Planner</h3>
      </div>

      {/* Health Score */}
      <div className="planner-card score-card">
        <div>
          <h4>Financial Health Score</h4>

          <p>Based on income, savings and spending behaviour.</p>
        </div>

        <div className="score-circle">{healthScore.score}</div>
      </div>

      {/* Allocation */}
      <div className="planner-card">
        <h4>Recommended Salary Allocation</h4>

        <div className="allocation-grid">
          {allocations.map((item) => (
            <div
              key={item.name}
              className={`allocation-item ${classNameMap[item.name] || 'personal'}`}
            >
              <div className="allocation-icon">{iconMap[item.name]}</div>

              <span>{item.name}</span>

              <strong>₹{item.amount.toLocaleString('en-IN')}</strong>

              <small>{item.percentage}% of income</small>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="planner-card">
        <h4>Recommendations</h4>

        <div className="recommendation-list">
          {recommendations.map((rec) => (
            <div
              key={rec.title}
              className={`recommendation-item ${recommendationTypeMap[rec.type] || 'info'}`}
            >
              {recommendationIconMap[rec.type]}

              <div>
                <strong>{rec.title}</strong>

                <p>{rec.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
