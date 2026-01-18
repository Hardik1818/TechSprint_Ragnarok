import {
    TrendingUp,
    PieChart as PieIcon,
    MapPin,
    Calendar
} from 'lucide-react';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
    return (
        <div className="admin-page animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>National Labor Analytics</h1>
                    <p>Data-driven insights into Nepal's workforce and salary trends.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-secondary"><Calendar size={18} /> This Month</button>
                </div>
            </header>

            <div className="analytics-grid">
                <div className="card overview-card">
                    <h3><TrendingUp size={20} /> Economic Velocity</h3>
                    <div className="velocity-stat">
                        <span>Daily Payroll Injection</span>
                        <h1>Rs. 4.2 Crore</h1>
                        <p className="positive">+12.5% vs last month</p>
                    </div>
                    <div className="mini-chart">
                        {/* Mock chart bars */}
                        {[40, 60, 45, 70, 50, 80, 65, 90, 75, 60].map((h, i) => (
                            <div key={i} className="bar" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                <div className="card breakdown-card">
                    <h3><PieIcon size={20} /> Sector Distribution</h3>
                    <div className="donut-chart-mock">
                        <div className="donut-hole"></div>
                    </div>
                    <div className="legend">
                        <div className="l-item">
                            <span className="dot blue"></span>
                            <span>Banking (45%)</span>
                        </div>
                        <div className="l-item">
                            <span className="dot purple"></span>
                            <span>IT Services (30%)</span>
                        </div>
                        <div className="l-item">
                            <span className="dot orange"></span>
                            <span>Manufacturing (25%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card geography-card">
                <div className="card-header">
                    <h3><MapPin size={20} /> Geographic Adoption</h3>
                </div>
                <div className="geo-list">
                    <div className="geo-row header">
                        <span>District</span>
                        <span>Active Users</span>
                        <span>Total Disbursed</span>
                        <span>Growth</span>
                    </div>
                    {[
                        { name: 'Kathmandu', users: '45,200', amount: '2.1 Cr', growth: '+15%' },
                        { name: 'Lalitpur', users: '12,500', amount: '85 Lk', growth: '+8%' },
                        { name: 'Pokhara', users: '8,400', amount: '42 Lk', growth: '+12%' },
                        { name: 'Biratnagar', users: '5,100', amount: '28 Lk', growth: '+5%' },
                    ].map((d, i) => (
                        <div key={i} className="geo-row">
                            <strong>{d.name}</strong>
                            <span>{d.users}</span>
                            <span>Rs. {d.amount}</span>
                            <span className="growth positive">{d.growth}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
