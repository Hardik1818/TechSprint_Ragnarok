
import {
    ShieldCheck,
    Search,
    Filter,
    Download,
    MoreVertical,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';
import './AdminCompliance.css';

const AdminCompliance = () => {


    const reports = [
        { id: 'R-2024-001', org: 'Nabil Bank', type: 'Payroll Audit', status: 'Compliant', date: '2026-01-15', auditor: 'System' },
        { id: 'R-2024-002', org: 'Daraz Nepal', type: 'Tax Deduction', status: 'Flagged', date: '2026-01-14', auditor: 'System' },
        { id: 'R-2024-003', org: 'CIMEX Inc', type: 'Labor Law', status: 'Compliant', date: '2026-01-12', auditor: 'Officer Ram' },
        { id: 'R-2024-004', org: 'Pathao', type: 'Payroll Audit', status: 'Pending', date: '2026-01-10', auditor: 'System' },
        { id: 'R-2024-005', org: 'Nepal Telecom', type: 'Tax Deduction', status: 'Compliant', date: '2026-01-08', auditor: 'Officer Sita' },
    ];

    return (
        <div className="admin-page animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>Compliance & Audits</h1>
                    <p>Monitor regulatory adherence and automated audit logs.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-secondary"><Download size={18} /> Export Reports</button>
                    <button className="btn-primary"><ShieldCheck size={18} /> Run Manual Audit</button>
                </div>
            </header>

            <div className="compliance-stats">
                <div className="c-stat-card">
                    <div className="st-icon green"><CheckCircle size={24} /></div>
                    <div className="st-info">
                        <span>Fully Compliant</span>
                        <strong>142 Orgs</strong>
                    </div>
                </div>
                <div className="c-stat-card">
                    <div className="st-icon yellow"><Clock size={24} /></div>
                    <div className="st-info">
                        <span>Pending Review</span>
                        <strong>12 Orgs</strong>
                    </div>
                </div>
                <div className="c-stat-card">
                    <div className="st-icon red"><AlertTriangle size={24} /></div>
                    <div className="st-info">
                        <span>Critical Flags</span>
                        <strong>3 Orgs</strong>
                    </div>
                </div>
            </div>

            <div className="audit-table-container card">
                <div className="table-header">
                    <h3>Recent Audit Logs</h3>
                    <div className="table-actions">
                        <div className="search-box-sm">
                            <Search size={16} />
                            <input type="text" placeholder="Search logs..." />
                        </div>
                        <button className="icon-btn-sm"><Filter size={16} /></button>
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Organization</th>
                            <th>Audit Type</th>
                            <th>Date</th>
                            <th>Auditor</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((r, i) => (
                            <tr key={i}>
                                <td className="mono">{r.id}</td>
                                <td><strong>{r.org}</strong></td>
                                <td>{r.type}</td>
                                <td>{r.date}</td>
                                <td>{r.auditor}</td>
                                <td>
                                    <span className={`status-pill ${r.status.toLowerCase()}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="action-btn"><MoreVertical size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCompliance;
