import { TrendIcon, UsersIcon, DollarIcon, ChartIcon } from "../icons";

const stats = [
  { label: "Total Revenue", value: "$45,231", change: "+12.5%", icon: <DollarIcon /> },
  { label: "Active Users", value: "8,549", change: "+8.2%", icon: <UsersIcon /> },
  { label: "Growth Rate", value: "23.1%", change: "+2.4%", icon: <TrendIcon /> },
  { label: "Conversion", value: "4.8%", change: "+0.9%", icon: <ChartIcon /> }
];

export function StatCard() {
  return (
    <div className="stat-dashboard">
      <h3 className="stat-dashboard-title">Dashboard Overview</h3>
      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-details">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-change positive">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
