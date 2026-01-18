import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Landmark, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './WithdrawModal.css';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAppContext();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'bank' | 'esewa' | 'khalti' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStep(3); // Success step
            setIsLoading(false);
        }, 2000);
    };

    const resetAndClose = () => {
        setStep(1);
        setAmount('');
        setMethod(null);
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
                    <button className="close-btn" onClick={resetAndClose}><X size={20} /></button>

                    {step === 1 && (
                        <div className="modal-content animate-fadeIn">
                            <h2>Transfer Funds</h2>
                            <p className="subtitle">Select a destination for your daily salary.</p>

                            <div className="amount-input">
                                <span className="currency">NPR</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <p className="limit-hint">Available Limit: Rs. {user?.walletBalance.toLocaleString()}</p>

                            <div className="payment-methods">
                                <div
                                    className={`method-card ${method === 'bank' ? 'selected' : ''}`}
                                    onClick={() => setMethod('bank')}
                                >
                                    <Landmark size={24} />
                                    <span>Bank Transfer</span>
                                </div>
                                <div
                                    className={`method-card ${method === 'esewa' ? 'selected' : ''}`}
                                    onClick={() => setMethod('esewa')}
                                >
                                    <div className="wallet-icon esewa">e</div>
                                    <span>eSewa</span>
                                </div>
                                <div
                                    className={`method-card ${method === 'khalti' ? 'selected' : ''}`}
                                    onClick={() => setMethod('khalti')}
                                >
                                    <div className="wallet-icon khalti">K</div>
                                    <span>Khalti</span>
                                </div>
                            </div>

                            <button
                                className="btn-primary-full"
                                disabled={!amount || !method}
                                onClick={() => setStep(2)}
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="modal-content animate-fadeIn">
                            <h2>Confirm Transfer</h2>

                            <div className="confirm-details">
                                <div className="detail-row">
                                    <span>Amount</span>
                                    <strong>Rs. {Number(amount).toLocaleString()}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Fee</span>
                                    <strong>Rs. 10.00</strong>
                                </div>
                                <div className="detail-row total">
                                    <span>Total Deducted</span>
                                    <strong>Rs. {(Number(amount) + 10).toLocaleString()}</strong>
                                </div>
                            </div>

                            <div className="info-box">
                                <p>Transferring to <strong>{method === 'bank' ? 'Nabil Bank (**** 1234)' : method}</strong></p>
                            </div>

                            <button
                                className="btn-primary-full"
                                onClick={handleWithdraw}
                                disabled={isLoading}
                            >
                                {isLoading ? <span className="spinner-sm"></span> : 'Confirm & Send'}
                            </button>
                            <button
                                className="btn-text"
                                onClick={() => setStep(1)}
                                disabled={isLoading}
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
                            <h2>Transfer Successful!</h2>
                            <p>Rs. {Number(amount).toLocaleString()} has been sent to your account.</p>

                            <button className="btn-primary-full" onClick={resetAndClose}>
                                Done
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WithdrawModal;
