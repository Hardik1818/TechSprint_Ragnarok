import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import './DefineCycleModal.css';

interface DefineCycleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DefineCycleModal: React.FC<DefineCycleModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [cycleDate, setCycleDate] = useState('15');
    const [depositAmount, setDepositAmount] = useState('2400000');
    const [loading, setLoading] = useState(false);

    const handleDeposit = () => {
        setLoading(true);
        setTimeout(() => {
            setStep(3);
            setLoading(false);
        }, 2000);
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

                    {step === 1 && (
                        <div className="modal-content animate-fadeIn">
                            <h2>Salary Cycle Setup</h2>
                            <p className="subtitle">Configure the monthly salary streaming cycle.</p>

                            <div className="form-group-modal">
                                <label>Cycle Start Date</label>
                                <div className="input-with-icon">
                                    <Calendar size={18} />
                                    <select value={cycleDate} onChange={(e) => setCycleDate(e.target.value)}>
                                        <option value="1">1st of Month</option>
                                        <option value="15">15th of Month</option>
                                        <option value="25">25th of Month</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-modal">
                                <label>Total Deposit Amount (NPR)</label>
                                <div className="input-with-icon">
                                    <DollarSign size={18} />
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="cycle-summary">
                                <p><strong>452</strong> Employees included</p>
                                <p>Streaming <strong>Rs. {Number(depositAmount).toLocaleString()}</strong> over 30 days</p>
                            </div>

                            <button className="btn-primary-full" onClick={() => setStep(2)}>
                                Review Deposit
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="modal-content animate-fadeIn">
                            <h2>Confirm Deposit</h2>
                            <p className="subtitle">Please review the details before confirming.</p>

                            <div className="confirm-card">
                                <div className="c-row">
                                    <span>From Account</span>
                                    <strong>Nabil Bank (**** 8821)</strong>
                                </div>
                                <div className="c-row">
                                    <span>To DailyPay Setup</span>
                                    <strong>Org Wallet (Safe)</strong>
                                </div>
                                <div className="c-row total">
                                    <span>Total Amount</span>
                                    <strong>Rs. {Number(depositAmount).toLocaleString()}</strong>
                                </div>
                            </div>

                            <button className="btn-primary-full" onClick={handleDeposit} disabled={loading}>
                                {loading ? 'Processing...' : 'Confirm & Deposit'}
                            </button>
                            <button
                                className="btn-text"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Back
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="modal-content success-view animate-fadeIn">
                            <div className="success-icon">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2>Cycle Activated!</h2>
                            <p>Salary streaming has started for the new cycle.</p>

                            <button className="btn-primary-full" onClick={onClose}>
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DefineCycleModal;
