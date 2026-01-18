import {
    AlertCircle,
    Download,
} from 'lucide-react';
import { useState } from 'react';
import './OrgPayroll.css';

import { useAppContext } from '../context/AppContext';

const OrgPayroll = () => {
    const { employees } = useAppContext();

    const generateCSV = (data: any[], headers: string[], filename: string) => {
        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAuditReport = () => {
        const headers = ['Employee ID', 'Name', 'Role', 'Status', 'Gross Salary', 'Employee SSF (11%)', 'Employer SSF (20%)', 'Monthly Tax', 'Net Salary', 'Daily Payout Limit'];
        const data = employees.map(emp => [
            emp.id,
            `"${emp.name}"`,
            emp.role,
            emp.status,
            emp.salary || 0,
            emp.payroll?.employeeSSF || 0,
            emp.payroll?.employerSSF || 0,
            emp.payroll?.monthlyTax || 0,
            emp.payroll?.netSalary || 0,
            emp.payroll?.dailyPayout || 0
        ]);
        generateCSV(data, headers, `Payroll_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleTaxReport = () => {
        const headers = ['Employee ID', 'Name', 'Annual Gross Income', 'Annual SSF Deduction', 'Taxable Income (Est)', 'Annual Tax Liability', 'Monthly Tax Deducted'];
        const data = employees.map(emp => {
            const annualGross = (emp.salary || 0) * 12;
            const annualSSF = (emp.payroll?.employeeSSF || 0) * 12;
            const annualTax = (emp.payroll?.monthlyTax || 0) * 12;
            return [
                emp.id,
                `"${emp.name}"`,
                annualGross,
                annualSSF,
                annualGross - annualSSF, // Simplified Taxable
                annualTax,
                emp.payroll?.monthlyTax || 0
            ];
        });
        generateCSV(data, headers, `Tax_Report_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const [balance] = useState(12500000);

    return (
        <div className="org-payroll animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>Payroll Stream</h1>
                    <p>Real-time salary accrual monitoring and funding management.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-secondary" onClick={handleAuditReport}><Download size={18} /> Audit Report</button>
                    <button className="btn-secondary" onClick={handleTaxReport}><Download size={18} /> Tax Report</button>
                </div>
            </header>

            <div className="payroll-grid">
                <div className="funding-card" style={{ gridColumn: 'span 2' }}>
                    <h3>Gross Salary & Deductions Breakdown</h3>
                    <p style={{ marginBottom: 16, color: 'var(--text-muted)' }}>Clear breakdown of where the salary budget goes.</p>

                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Gross Salary</th>
                                    <th>SSF (11%)</th>
                                    <th>Monthly Tax</th>
                                    <th>Net Monthly Salary</th>
                                    <th>Daily Payout</th>
                                    <th>Employer SSF (20%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="u-info"><strong>{emp.name}</strong></div>
                                        </td>
                                        <td>NPR {emp.salary?.toLocaleString()}</td>
                                        <td style={{ color: 'var(--warning)' }}>- {emp.payroll?.employeeSSF?.toLocaleString() || 0}</td>
                                        <td style={{ color: 'var(--warning)' }}>- {emp.payroll?.monthlyTax?.toLocaleString() || 0}</td>
                                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                                            {emp.payroll?.netSalary?.toLocaleString() || (emp.salary ? (emp.salary * 0.8).toLocaleString() : 0)}
                                        </td>
                                        <td>{emp.payroll?.dailyPayout?.toLocaleString() || 0}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            <em>{emp.payroll?.employerSSF?.toLocaleString() || 0}</em>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Funding Account Status */}
                <div className="funding-card">
                    <h3>Funding Account</h3>
                    <div className="balance-box">
                        <span className="sub">Current Balance</span>
                        <h2>NPR {balance.toLocaleString()}</h2>
                        <div className="balance-status good">
                            <AlertCircle size={16} /> Healthy Coverage (45 Days)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OrgPayroll;
