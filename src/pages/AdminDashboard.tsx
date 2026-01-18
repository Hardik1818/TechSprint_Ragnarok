import { useState } from 'react';
import {
    BarChart3,
    ShieldAlert,
    FileText,
    Globe,
    Download,
    Search,
    LayoutDashboard,
    Users,
    History,
    Bell,
    Edit,
    Save,
    X,
    MessageSquare
} from 'lucide-react';
import { useAppContext, type Employee } from '../context/AppContext';
import '../components/OrgModals.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const {
        user,
        employees,
        updateEmployee,
        unlockRequests,
        handleUnlockRequest,
        transactions,
        auditLogs,
        sendNotification
    } = useAppContext();

    const [activeTab, setActiveTab] = useState('overview');

    // Employee Edit State
    const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
    const [editReason, setEditReason] = useState('');
    const [editForm, setEditForm] = useState<Partial<Employee>>({});

    // Notification State
    const [notifForm, setNotifForm] = useState({ title: '', message: '', recipient: 'All' });
    const [notifSuccess, setNotifSuccess] = useState(false);

    const handleEditClick = (emp: Employee) => {
        setEditingEmp(emp);
        setEditForm({ name: emp.name, role: emp.role, phone: emp.phone, email: emp.email });
        setEditReason('');
    };

    const handleSaveEdit = () => {
        if (!editingEmp || !editReason) return alert('Reason is mandatory.');
        updateEmployee(editingEmp.id, editForm, editReason, user?.name || 'Admin');
        setEditingEmp(null);
    };

    const handleSendNotif = (e: React.FormEvent) => {
        e.preventDefault();
        sendNotification(notifForm.title, notifForm.message, notifForm.recipient);
        setNotifSuccess(true);
        setNotifForm({ title: '', message: '', recipient: 'All' });
        setTimeout(() => setNotifSuccess(false), 3000);
    };

    return (
        <div className="admin-dashboard animate-fadeIn">
            {/* Top Navigation for Tabs */}
            <div className="admin-tabs-nav" style={{
                display: 'flex',
                gap: 20,
                marginBottom: 24,
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: 0
            }}>
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'employees', label: 'Employees', icon: Users },
                    { id: 'transactions', label: 'Transactions', icon: History },
                    { id: 'audit', label: 'Audit Logs', icon: FileText },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            marginBottom: -1
                        }}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab (Original Content) */}
            {activeTab === 'overview' && (
                <>
                    <header className="page-header">
                        <div>
                            <h1>Regulatory Dashboard</h1>
                            <p>Government of Nepal • {user?.name}</p>
                        </div>
                        <div className="header-btns">
                            <button className="btn-secondary"><Download size={18} /> Export Data</button>
                        </div>
                    </header>

                    <div className="admin-stats">
                        {[
                            { label: 'Total Payroll Transacted', value: 'NPR 4.2B', icon: BarChart3 },
                            { label: 'Compliance Rate', value: '99.2%', icon: Globe },
                            { label: 'Pending Audits', value: '12', icon: ShieldAlert },
                        ].map((s, i) => (
                            <div key={i} className="admin-stat-card">
                                <s.icon size={24} className="s-icon" />
                                <div>
                                    <div className="s-label">{s.label}</div>
                                    <div className="s-value">{s.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="admin-grid">
                        <section className="card">
                            <div className="card-header">
                                <h3>Unlock Requests</h3>
                                <div className="search-box-sm">
                                    <Search size={14} />
                                    <input type="text" placeholder="Search..." />
                                </div>
                            </div>
                            <div className="org-list-mini">
                                {unlockRequests.length === 0 && <p style={{ padding: 16, color: 'var(--text-muted)' }}>No pending requests.</p>}
                                {unlockRequests.filter(r => r.status === 'Pending').map((req, i) => {
                                    const employee = employees.find(e => e.id.toString() === req.employeeId);
                                    const lockedAmount = employee ? employee.salary * 0.4 : 0;
                                    return (
                                        <div key={i} className="org-row-mini">
                                            <div className="org-info-mini">
                                                <strong>{req.employeeName}</strong>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{employee?.role || 'Employee'}</span>
                                                <span style={{ marginTop: 4 }}>
                                                    Requested: <b style={{ color: 'var(--text)' }}>NPR {req.amount.toLocaleString()}</b>
                                                    <span style={{ margin: '0 6px', color: 'var(--glass-border)' }}>|</span>
                                                    Locked: NPR {lockedAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    className="btn-action reject"
                                                    onClick={() => handleUnlockRequest(req.id, 'Rejected')}
                                                >Reject</button>
                                                <button
                                                    className="btn-action approve"
                                                    onClick={() => handleUnlockRequest(req.id, 'Approved')}
                                                >Approve</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="card labor-insights">
                            <h3>Market Insights</h3>
                            <div className="insight-item">
                                <div className="i-header">
                                    <FileText size={18} />
                                    <span>Salary Distribution (Monthly)</span>
                                </div>
                                <div className="mock-bar-chart">
                                    <div className="m-bar" style={{ height: '30%' }}></div>
                                    <div className="m-bar" style={{ height: '60%' }}></div>
                                    <div className="m-bar" style={{ height: '90%' }}></div>
                                    <div className="m-bar" style={{ height: '50%' }}></div>
                                </div>
                            </div>
                            <p className="i-desc">DailyPay liquidity has decreased informal lending by an estimated 24% in IT sectors.</p>
                        </section>
                    </div>
                </>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
                <div className="card">
                    <div className="card-header">
                        <h3>Employee Management</h3>
                        <div className="search-box-sm">
                            <Search size={14} />
                            <input type="text" placeholder="Search employees..." />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Salary Locked</th>
                                    <th>Salary Earned</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id}>
                                        <td>
                                            <strong>{emp.name}</strong><br />
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.email}</span>
                                        </td>
                                        <td>{emp.role}</td>
                                        <td><span className={`status-pill ${emp.status.toLowerCase()}`}>{emp.status}</span></td>
                                        <td>NPR {(emp.salary * 0.4).toLocaleString()}</td>
                                        <td>NPR {emp.salary.toLocaleString()}</td>
                                        <td>
                                            <button className="btn-action edit" onClick={() => handleEditClick(emp)}>
                                                <Edit size={16} /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="card">
                    <h3>Transaction History</h3>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td className="mono">{tx.id}</td>
                                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                                        <td>{tx.userId}</td>
                                        <td>{tx.type}</td>
                                        <td><strong>NPR {tx.amount.toLocaleString()}</strong></td>
                                        <td><span className="status-pill active">{tx.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'audit' && (
                <div className="card">
                    <h3>Audit Logs</h3>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Admin</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map(log => (
                                    <tr key={log.id}>
                                        <td style={{ fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td>{log.changedBy}</td>
                                        <td><strong>{log.action}</strong></td>
                                        <td>{log.targetType}: {log.targetId}</td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 300 }}>{log.details}</td>
                                    </tr>
                                ))}
                                {auditLogs.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>No audit logs yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h3>Send System Notification</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Broadcast messages to organizations or specific users.</p>

                    <form onSubmit={handleSendNotif}>
                        <div className="form-group-modal">
                            <label>Title</label>
                            <div className="input-wrapper">
                                <MessageSquare size={18} className="input-icon" />
                                <input
                                    type="text"
                                    required
                                    value={notifForm.title}
                                    onChange={e => setNotifForm({ ...notifForm, title: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group-modal">
                            <label>Message</label>
                            <div className="input-wrapper">
                                <textarea
                                    required
                                    style={{ paddingLeft: 12, height: 100 }}
                                    value={notifForm.message}
                                    onChange={e => setNotifForm({ ...notifForm, message: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group-modal">
                            <label>Recipient</label>
                            <div className="input-wrapper">
                                <Users size={18} className="input-icon" />
                                <select
                                    value={notifForm.recipient}
                                    onChange={e => setNotifForm({ ...notifForm, recipient: e.target.value })}
                                >
                                    <option value="All">All Users</option>
                                    <option value="Org:Nabil">Nabil Bank</option>
                                    <option value="Employees">All Employees</option>
                                </select>
                            </div>
                        </div>
                        <button className="btn-primary-full">
                            {notifSuccess ? 'Sent Successfully!' : 'Send Notification'}
                        </button>
                    </form>
                </div>
            )}

            {/* Edit Employee Modal */}
            {editingEmp && (
                <div className="modal-backdrop">
                    <div className="modal-container">
                        <button className="close-btn" onClick={() => setEditingEmp(null)}><X size={20} /></button>
                        <div className="modal-header">
                            <h2>Edit Employee</h2>
                            <p className="subtitle">ID: {editingEmp.id}</p>
                        </div>
                        <div className="form-group-modal">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="styled-input"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group-modal">
                            <label>Role</label>
                            <input
                                type="text"
                                className="styled-input"
                                value={editForm.role}
                                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                            />
                        </div>
                        <div className="form-group-modal">
                            <label>Email</label>
                            <input
                                type="email"
                                className="styled-input"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group-modal" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 16 }}>
                            <label style={{ color: 'var(--warning)' }}>Reason for Change (Mandatory)</label>
                            <textarea
                                placeholder="Audit log reason..."
                                required
                                value={editReason}
                                onChange={e => setEditReason(e.target.value)}
                                style={{ width: '100%', padding: 10, borderRadius: 8, background: 'rgba(255,179,0,0.1)', border: '1px solid var(--warning)', color: 'var(--text)' }}
                            />
                        </div>
                        <button className="btn-primary-full" onClick={handleSaveEdit}>
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
