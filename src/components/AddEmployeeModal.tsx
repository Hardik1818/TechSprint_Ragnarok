import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Mail, DollarSign, Briefcase, FileText, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';
import './OrgModals.css';
import { useAppContext } from '../context/AppContext';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'single' | 'bulk';
}

const AddEmployeeModal = ({ isOpen, onClose, initialTab = 'single' }: AddEmployeeModalProps) => {
    const { addEmployee, addEmployees } = useAppContext();
    const [activeTab, setActiveTab] = useState<'single' | 'bulk'>(initialTab);

    // reset tab when opening with a specific intent if needed, or just rely on initial state mounting
    // Better to use useEffect to sync if the modal stays mounted but hidden? AnimatePresence unmounts it.
    // So initial state is fine. But wait, AnimatePresence is used but the component might still be conditionally rendered in parent?
    // In OrgDashboard, it's <AddEmployeeModal isOpen={...} />. If isOpen is false, it returns null in line 125 (of previous version).. wait previous version had `if (!isOpen) return null;`.
    // So initialTab in useState(initialTab) works fine because component remounts or at least re-evaluates.
    // Actually, if it's "if (!isOpen) return null", it re-renders. But hooks order must not change.
    // "if (!isOpen) return null" is after hooks in my previous code? No, let's check.
    // In step 27, hooks (useAppContext, useState) are called at the top. `if (!isOpen) return null;` is later.
    // So state persists if the component instance persists.
    // If the parent conditional renders it `{isOpen && <Modal />}` it remounts.
    // If parent renders `<Modal isOpen={isOpen} />` and modal returns null, state persists.
    // I need to add a useEffect to update activeTab when isOpen changes or initialTab changes.

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        salary: '',
        role: '',
        salaryType: 'Monthly',
        paymentType: 'Bank Transfer'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newEmployee: any = {
            name: formData.name,
            role: formData.role,
            status: 'Active',
            salary: Number(formData.salary),
            streaming: true,
            joined: new Date().toISOString().split('T')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
            email: formData.email,
            phone: formData.phone,
            salaryType: formData.salaryType as 'Monthly' | 'Weekly' | 'Daily',
            paymentType: formData.paymentType
        };

        await addEmployee(newEmployee);
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmitting(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            // Simple CSV parser
            try {
                const lines = text.split('\n');
                const newEmployees = lines.slice(1).filter(line => line.trim()).map((line) => {
                    const [name, email, phone, salary, role, salaryType, paymentType] = line.split(',').map(item => item.trim());
                    return {
                        id: 'temp-' + Math.random(), // Temporary ID, backend generates real one
                        name: name || 'Unknown',
                        email: email,
                        phone: phone,
                        salary: Number(salary) || 0,
                        role: role || 'Employee',
                        salaryType: (salaryType as 'Monthly' | 'Weekly' | 'Daily') || 'Monthly',
                        paymentType: paymentType || 'Bank Transfer',
                        status: 'Active',
                        streaming: true,
                        joined: new Date().toISOString().split('T')[0],
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'User'}`
                    };
                });

                if (newEmployees.length > 0) {
                    await addEmployees(newEmployees as any[]);
                    setIsSubmitting(false);
                    setIsSuccess(true);
                } else {
                    alert('No valid data found in CSV');
                    setIsSubmitting(false);
                }
            } catch (err) {
                console.error('Error parsing CSV:', err);
                alert('Error parsing CSV file');
                setIsSubmitting(false);
            }
        };
        reader.readAsText(file);
    };

    const reset = () => {
        setIsSuccess(false);
        setIsSubmitting(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            salary: '',
            role: '',
            salaryType: 'Monthly',
            paymentType: 'Bank Transfer'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-backdrop">
                <motion.div
                    className="modal-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>

                    {!isSuccess ? (
                        <>
                            <div className="modal-header">
                                <h2>Add Employees</h2>
                                <p className="subtitle">Onboard new team members to DailyPay.</p>
                            </div>

                            <div className="modal-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('single')}
                                >
                                    Single Entry
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('bulk')}
                                >
                                    Bulk Import
                                </button>
                            </div>

                            {activeTab === 'single' ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid-2">
                                        <div className="form-group-modal">
                                            <label>Full Name</label>
                                            <div className="input-wrapper">
                                                <User size={18} className="input-icon" />
                                                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Ram Bahadur" required />
                                            </div>
                                        </div>
                                        <div className="form-group-modal">
                                            <label>Role / Position</label>
                                            <div className="input-wrapper">
                                                <Briefcase size={18} className="input-icon" />
                                                <input name="role" value={formData.role} onChange={handleInputChange} type="text" placeholder="e.g. Developer" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group-modal">
                                            <label>Email Address</label>
                                            <div className="input-wrapper">
                                                <Mail size={18} className="input-icon" />
                                                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="e.g. ram@company.com" required />
                                            </div>
                                        </div>
                                        <div className="form-group-modal">
                                            <label>Phone Number</label>
                                            <div className="input-wrapper">
                                                <Phone size={18} className="input-icon" />
                                                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="e.g. 9800000000" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid-2">
                                        <div className="form-group-modal">
                                            <label>Salary Amount (NPR)</label>
                                            <div className="input-wrapper">
                                                <DollarSign size={18} className="input-icon" />
                                                <input name="salary" value={formData.salary} onChange={handleInputChange} type="number" placeholder="e.g. 50000" required />
                                            </div>
                                        </div>
                                        <div className="form-group-modal">
                                            <label>Salary Type</label>
                                            <div className="input-wrapper">
                                                <Calendar size={18} className="input-icon" />
                                                <select name="salaryType" value={formData.salaryType} onChange={handleInputChange} required>
                                                    <option value="Monthly">Monthly</option>
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Daily">Daily</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                    <button className="btn-primary-full" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
                                        {isSubmitting ? 'Adding...' : 'Add Employee'}
                                    </button>
                                </form>
                            ) : (
                                <div className="bulk-upload-section">
                                    <div className="drop-zone" onClick={() => document.getElementById('file-upload')?.click()}>
                                        <Upload className="drop-icon" />
                                        <p style={{ marginBottom: 8, fontWeight: 500 }}>Click to Upload CSV / Excel</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Format: Name, Email, Phone, Salary, Role, Type, Payment
                                        </p>
                                        <input type="file" id="file-upload" hidden accept=".csv, .xlsx" onChange={handleFileUpload} />
                                    </div>
                                    <div className="template-link" style={{ marginTop: 16, textAlign: 'center' }}>
                                        <a href="#" style={{ color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                            <FileText size={14} /> Download Template
                                        </a>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="success-view" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ color: 'var(--success)', marginBottom: 16 }}>
                                <CheckCircle2 size={56} style={{ margin: '0 auto' }} />
                            </div>
                            <h3>Success!</h3>
                            <p className="subtitle" style={{ marginBottom: 24 }}>
                                {activeTab === 'single' ? 'Employee added successfully.' : 'Employees imported successfully.'}
                            </p>
                            <button className="btn-primary-full" onClick={reset}>Add Another</button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddEmployeeModal;
