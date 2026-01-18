import {
    DollarSign,
    AlertCircle,
    Download,
} from 'lucide-react';
import './OrgPayroll.css';

const OrgPayroll = () => {

    return (
        <div className="org-payroll animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>Payroll Stream</h1>
                    <p>Real-time salary accrual monitoring and funding management.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-secondary"><Download size={18} /> Reports</button>
                    <button className="btn-primary"><DollarSign size={18} /> Top-up Fund</button>
                </div>
            </header>

            <div className="payroll-grid">
                {/* Live Stream Monitor */}

                {/* Funding Account Status */}
                <div className="funding-card">
                    <h3>Funding Account</h3>
                    <div className="balance-box">
                        <span className="sub">Current Balance</span>
                        <h2>NPR 12,500,000</h2>
                        <div className="balance-status good">
                            <AlertCircle size={16} /> Healthy Coverage (45 Days)
                        </div>
                    </div>
                    <div className="fund-stats">
                        <div className="f-stat">
                            <span>Daily Burn Rate</span>
                            <strong>NPR 450,000</strong>
                        </div>
                        <div className="f-stat">
                            <span>Next Auto-Topup</span>
                            <strong>Feb 1, 2026</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="transactions-section">
                <h3>Disbursement History</h3>
                <div className="card table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { date: 'Jan 16, 2026', type: 'Early Withdrawal', desc: 'Employee Withdrawals (45 Users)', amount: '125,000', status: 'Completed' },
                                { date: 'Jan 16, 2026', type: 'Accrual Allocation', desc: 'Daily Salary Logging', amount: '2,450,500', status: 'Processing' },
                                { date: 'Jan 15, 2026', type: 'Early Withdrawal', desc: 'Employee Withdrawals (32 Users)', amount: '98,500', status: 'Completed' },
                                { date: 'Jan 01, 2026', type: 'Payroll Cycle', desc: 'Monthly Salary Settlement', amount: '12,450,000', status: 'Completed' },
                            ].map((tx, i) => (
                                <tr key={i}>
                                    <td>{tx.date}</td>
                                    <td>{tx.type}</td>
                                    <td>{tx.desc}</td>
                                    <td><strong>NPR {tx.amount}</strong></td>
                                    <td><span className="status-pill active">{tx.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrgPayroll;
