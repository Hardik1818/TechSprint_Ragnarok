
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './ServicePaymentModal.css';

interface ServicePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
    serviceIcon: React.ReactNode;
}

const ServicePaymentModal: React.FC<ServicePaymentModalProps> = ({ isOpen, onClose, serviceName, serviceIcon }) => {
    const { user } = useAppContext();
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getPlaceholder = () => {
        switch (serviceName.toLowerCase()) {
            case 'topup': return 'Mobile Number';
            case 'data/voice pack': return 'Mobile Number';
            case 'internet/tv': return 'Customer/Subscriber ID';
            case 'electricity': return 'SC Number';
            case 'khanepani': return 'Customer ID';
            case 'flight': return 'Destination';
            default: return 'Account / ID';
        }
    };

    const handlePay = () => {
        if (!user) return;
        setIsLoading(true);

        setTimeout(() => {
            // Mock transaction logic
            // In a real app, this would be an API call

            // Update local state for demo purposes
            // This simulation just shows success view

            setIsLoading(false);
            setStep(3);
        }, 1500);
    };

    const resetAndClose = () => {
        setStep(1);
        setIdentifier('');
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-backdrop-service">
                <motion.div
                    className="modal-container-service"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                >
                    <button className="close-btn-service" onClick={onClose}><X size={20} /></button>

                    {step === 1 && (
                        <div className="modal-content-service animate-fadeIn">
                            <div className="service-header">
                                <div className="service-icon-lg">
                                    {serviceIcon}
                                </div>
                                <h2>{serviceName}</h2>
                            </div>

                            <div className="input-group">
                                <label>{getPlaceholder()}</label>
                                <input
                                    type="text"
                                    placeholder={`Enter ${getPlaceholder()}`}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="input-group">
                                <label>Amount (NPR)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="balance-hint">
                                Available: Rs. {user?.walletBalance.toLocaleString()}
                            </div>

                            <button
                                className="btn-pay"
                                disabled={!identifier || !amount}
                                onClick={() => setStep(2)}
                            >
                                Proceed
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="modal-content-service animate-fadeIn">
                            <h3>Confirm Payment</h3>

                            <div className="confirm-card">
                                <div className="row">
                                    <span>Service</span>
                                    <span>{serviceName}</span>
                                </div>
                                <div className="row">
                                    <span>{getPlaceholder()}</span>
                                    <span>{identifier}</span>
                                </div>
                                <div className="row total">
                                    <span>Total Amount</span>
                                    <span className="amount">Rs. {Number(amount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-cancel" onClick={() => setStep(1)} disabled={isLoading}>Back</button>
                                <button className="btn-confirm" onClick={handlePay} disabled={isLoading}>
                                    {isLoading ? <span className="spinner-sm"></span> : 'Confirm Payment'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="modal-content-service success-view animate-fadeIn">
                            <div className="success-icon">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2>Payment Successful</h2>
                            <p>You have successfully paid Rs. {Number(amount).toLocaleString()} for {serviceName}.</p>
                            <button className="btn-done" onClick={resetAndClose}>Done</button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServicePaymentModal;
