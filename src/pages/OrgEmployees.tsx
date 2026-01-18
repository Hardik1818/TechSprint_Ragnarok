import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    FileText,
    UserPlus
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddEmployeeModal from '../components/AddEmployeeModal';
import './OrgEmployees.css';

const OrgEmployees = () => {
    const { employees } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStartTab, setModalStartTab] = useState<'single' | 'bulk'>('single');

    const filtered = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const openModal = (tab: 'single' | 'bulk') => {
        setModalStartTab(tab);
        setIsModalOpen(true);
    };

    return (
        <div className="org-page animate-fadeIn">
            <header className="page-header">
                <div>
                    <h1>Employee Management</h1>
                    <p>Manage salary streaming eligibility and status for your team.</p>
                </div>
                <div className="header-btns">
                    <button className="btn-secondary" onClick={() => openModal('bulk')}><FileText size={18} /> Bulk Import</button>
                    <button className="btn-primary" onClick={() => openModal('single')}><UserPlus size={18} /> Add Employee</button>
                </div>
            </header>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-actions">
                    <button className="filter-btn"><Filter size={18} /> Filter</button>
                    <button className="filter-btn"><Download size={18} /> Export</button>
                </div>
            </div>

            <div className="card table-card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Monthly Salary</th>
                                <th>Status</th>
                                <th>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map(emp => (
                                    <tr key={emp.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="u-info">
                                                    <strong>{emp.name}</strong>
                                                    <span>{emp.joined}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{emp.role}</td>
                                        <td>NPR {emp.salary.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-pill ${emp.status.toLowerCase().replace(' ', '-')}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="action-btn"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialTab={modalStartTab}
            />
        </div>
    );
};

export default OrgEmployees;
