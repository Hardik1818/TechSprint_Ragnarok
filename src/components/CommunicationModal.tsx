import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Users, Check
} from 'lucide-react';
import { useState } from 'react';
import './OrgModals.css';

interface CommunicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CommunicationModal = ({ isOpen, onClose }: CommunicationModalProps) => {
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('all'); // all, specific
    const [sentMessages, setSentMessages] = useState([
        { id: 1, to: 'All Employees', body: 'Please update your KYC details by Friday.', date: 'Today, 10:30 AM', read: 45 },
        { id: 2, to: 'Engineering Team', body: 'Server maintenance scheduled for tonight.', date: 'Yesterday, 4:00 PM', read: 12 }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMsg = {
            id: Date.now(),
            to: recipient === 'all' ? 'All Employees' : 'Selected Employees',
            body: message,
            date: 'Just now',
            read: 0
        };

        setSentMessages([newMsg, ...sentMessages]);
        setMessage('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-backdrop">
                <motion.div
                    className="modal-container large"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                >
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>

                    <div className="modal-header">
                        <h2>Communication Hub</h2>
                        <p className="subtitle">Send notifications and announcements to your team.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                        <div className="compose-section">
                            <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>Compose Message</h4>

                            <div className="form-group-modal">
                                <label>Recipients</label>
                                <div className="input-wrapper">
                                    <Users size={18} className="input-icon" />
                                    <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
                                        <option value="all">All Employees</option>
                                        <option value="dept_eng">Engineering Dept</option>
                                        <option value="dept_sales">Sales Dept</option>
                                        <option value="uk">Users with Unverified KYC</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-modal">
                                <label>Message</label>
                                <div className="input-wrapper">
                                    <textarea
                                        placeholder="Type your announcement here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ height: 120, resize: 'none' }}
                                    />
                                </div>
                            </div>

                            <button className="btn-primary-full" onClick={handleSend} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <Send size={16} /> Send Notification
                            </button>
                        </div>

                        <div className="history-section" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: 24 }}>
                            <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>Recent Broadcasts</h4>
                            <div className="msg-list">
                                {sentMessages.map(msg => (
                                    <div key={msg.id} className="msg-item">
                                        <div className="msg-header-row">
                                            <strong>{msg.to}</strong>
                                            <span>{msg.date}</span>
                                        </div>
                                        <p className="msg-body" style={{ margin: '8px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            "{msg.body}"
                                        </p>
                                        <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)' }}>
                                            <Check size={12} /> {msg.read} Read
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CommunicationModal;
