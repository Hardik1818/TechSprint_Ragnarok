import { motion } from 'framer-motion';
import {
    PlusCircle,
    Wallet,
    CreditCard,
    PieChart,
    ArrowUpRight,
    Search,
    Download,
    MessageSquare,
    Bell,
    MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DefineCycleModal from '../components/DefineCycleModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import CommunicationModal from '../components/CommunicationModal';
import './OrgDashboard.css';

const OrgDashboard = () => {
    const { user } = useAppContext();
    const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
    const [isCommunicationOpen, setIsCommunicationOpen] = useState(false);

    // Requested Metrics
    const stats = [
        { label: 'Total Loaded Balance', value: 'NPR 5,000,000', icon: Wallet, color: 'blue', sub: 'Lifetime Deposit' },
        { label: 'Distributed Balance', value: 'NPR 2,400,000', icon: ArrowUpRight, color: 'green', sub: 'Total Distributed' },
        { label: 'Remaining for Dist.', value: 'NPR 2,100,000', icon: PieChart, color: 'orange', sub: 'Allocated' },
        { label: 'Current Available', value: 'NPR 500,000', icon: CreditCard, color: 'purple', sub: 'Free Cash' },
    ];

    const transactions = [
        { id: 'TX1001', date: '2025-01-16', employee: 'Kiran Thapa', amount: '2,000', type: 'Daily Stream', status: 'Completed' },
        { id: 'TX1002', date: '2025-01-16', employee: 'Sita Sharma', amount: '2,500', type: 'Daily Stream', status: 'Completed' },
        { id: 'TX1003', date: '2025-01-15', employee: 'Ram Prasad', amount: '15,000', type: 'Advance', status: 'Approved' },
        { id: 'TX1004', date: '2025-01-15', employee: 'Kiran Thapa', amount: '2,000', type: 'Daily Stream', status: 'Completed' },
        { id: 'TX1005', date: '2025-01-14', employee: 'Hari Krishna', amount: '5,000', type: 'Bonus', status: 'Completed' },
    ];

    return (
        <div className="org-dashboard animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>Organization Portal</h1>
                    <p>Logged in as <strong>{user?.name}</strong></p>
                </div>
                <div className="header-btns">
                    <button className="btn-icon-secondary" onClick={() => setIsCommunicationOpen(true)} title="Messages">
                        <MessageSquare size={20} />
                    </button>
                    <button className="btn-primary" onClick={() => setIsAddEmployeeOpen(true)}>
                        <PlusCircle size={18} /> Add Employees
                    </button>
                </div>
            </header>

            <div className="org-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={`stat-icon-bg ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">{stat.label}</span>
                            <h3 className="stat-value">{stat.value}</h3>
                            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{stat.sub}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="org-content">
                <div className="org-main">
                    <section className="card employee-list-card">
                        <div className="card-header">
                            <h3>Employee Salary Streams</h3>
                            <button className="text-btn">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="org-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Salary</th>
                                        <th>Daily Rate</th>
                                        <th>Accrued Today</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Kiran Thapa', salary: '45,000', rate: '1,500', accrued: '12,000', status: 'Active' },
                                        { name: 'Sita Sharma', salary: '75,000', rate: '2,500', accrued: '20,000', status: 'Active' },
                                        { name: 'Ram Prasad', salary: '55,000', rate: '1,833', accrued: '14,600', status: 'On Leave' },
                                    ].map((emp, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className="table-user">
                                                    <span>{emp.name}</span>
                                                </div>
                                            </td>
                                            <td>NPR {emp.salary}</td>
                                            <td>NPR {emp.rate}</td>
                                            <td><span className="accrued-tag">NPR {emp.accrued}</span></td>
                                            <td><span className={`status-pill ${emp.status.toLowerCase().replace(' ', '')}`}>{emp.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section className="card transaction-history-card" style={{ marginTop: '24px' }}>
                        <div className="card-header" style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <h3>Wallet Transaction Statement</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recent transfers to employee wallets.</p>
                            </div>
                            <div className="actions" style={{ display: 'flex', gap: 12 }}>
                                <div className="search-box" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--surface-light)',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <Search size={16} color="var(--text-muted)" />
                                    <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', paddingLeft: 8, fontSize: '0.9rem', outline: 'none' }} />
                                </div>
                                <button className="btn-secondary" style={{ padding: '8px 12px' }}><Download size={16} /> Export</button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="org-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Employee</th>
                                        <th>Amount</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, i) => (
                                        <tr key={i}>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tx.date}</td>
                                            <td>
                                                <div className="table-user">
                                                    <span>{tx.employee}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>NPR {tx.amount}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="action-btn-ghost">
                                                    <MoreHorizontal size={16} color="var(--text-muted)" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <div className="org-side">
                    <section className="card cycle-card">
                        <h3>Salary Cycle</h3>
                        <div className="cycle-progress">
                            <div className="cycle-info">
                                <span>Month Progress</span>
                                <strong>16 / 30 Days</strong>
                            </div>
                            <div className="p-bar-large">
                                <div className="p-fill" style={{ width: '53%' }}></div>
                            </div>
                        </div>
                        <p className="cycle-hint">Next organization deposit required in 14 days.</p>
                        <button className="btn-outline-full" onClick={() => setIsCycleModalOpen(true)}>Manage Deposit Cycle</button>
                    </section>

                    {/* Updated Side Card: Notification Summary */}
                    <section className="card help-card" style={{ cursor: 'pointer' }} onClick={() => setIsCommunicationOpen(true)}>
                        <div className="help-icon" style={{ background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary)' }}>
                            <Bell size={24} />
                        </div>
                        <h4>Announcements</h4>
                        <p>You have <strong>2</strong> active broadcasts running this week.</p>
                        <button className="text-btn" style={{ marginTop: 8 }}>Manage Messages</button>
                    </section>
                </div>
            </div>

            <DefineCycleModal isOpen={isCycleModalOpen} onClose={() => setIsCycleModalOpen(false)} />
            <AddEmployeeModal isOpen={isAddEmployeeOpen} onClose={() => setIsAddEmployeeOpen(false)} />
            <CommunicationModal isOpen={isCommunicationOpen} onClose={() => setIsCommunicationOpen(false)} />
        </div>
    );
};

export default OrgDashboard;
