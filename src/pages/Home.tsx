import { useNavigate } from 'react-router-dom';
import {
    Shield,
    Zap,
    ArrowRight,
    CheckCircle2,
    Users,
    Building,
    Lock,
    Smartphone,
    PieChart
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Navigation */}
            <nav className="home-nav">
                <div className="logo">
                    <div className="logo-icon">DP</div>
                    <span>DailyPay <span className="blue">Nepal</span></span>
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How it Works</a>
                    <button className="btn-login-select" onClick={() => navigate('/login')}>
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="badge">Revolutionizing Salary in Nepal</span>
                    <h1>Your Money, <span className="gradient-text">Earned Daily.</span></h1>
                    <p>
                        Why wait 30 days for your hard-earned money? DailyPay Nepal gives you
                        instant access to your daily earnings, helping you stay debt-free
                        and financially independent.
                    </p>
                    <div className="hero-cta">
                        <button className="btn-primary-lg" onClick={() => navigate('/login')}>
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary-lg">Watch Video</button>
                    </div>
                    <div className="hero-stats">
                        <div className="h-stat">
                            <strong>12%</strong>
                            <span>Interest Saved</span>
                        </div>
                        <div className="h-stat">
                            <strong>50+</strong>
                            <span>Partner Orgs</span>
                        </div>
                        <div className="h-stat">
                            <strong>10k+</strong>
                            <span>Active Users</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image-container">
                    <div className="glass-card main-preview">
                        <div className="preview-header">
                            <div className="p-avatar"></div>
                            <div className="p-info">
                                <div className="p-line-sm"></div>
                                <div className="p-line-lg"></div>
                            </div>
                        </div>
                        <div className="p-balance">
                            <span>Current Earnings</span>
                            <h3>Rs. 32,450.00</h3>
                        </div>
                        <div className="p-graph">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div key={i} className="p-bar" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                    <div className="floating-card c1">
                        <Zap size={20} className="blue" />
                        <span>Instant Credit</span>
                    </div>
                    <div className="floating-card c2">
                        <Shield size={20} className="green" />
                        <span>Regulatory Compliant</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="section-title">
                    <h2>Why choose <span className="blue">DailyPay?</span></h2>
                    <p>We're changing the way Nepal gets paid.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="f-icon-box"><Zap size={24} /></div>
                        <h3>Instant Salary Access</h3>
                        <p>Withdraw your earned salary any day of the month. No waiting for payday.</p>
                    </div>
                    <div className="feature-card">
                        <div className="f-icon-box"><PieChart size={24} /></div>
                        <h3>Zero Interest</h3>
                        <p>This is not a loan. It's your own money. No interest, just a small flat fee.</p>
                    </div>
                    <div className="feature-card">
                        <div className="f-icon-box"><Smartphone size={24} /></div>
                        <h3>Digital Wallets</h3>
                        <p>Transfer instantly to eSewa, Khalti, IME Pay, or any bank account.</p>
                    </div>
                    <div className="feature-card">
                        <div className="f-icon-box"><Shield size={24} /></div>
                        <h3>Bank Grade Security</h3>
                        <p>Your data is encrypted and secure with top-tier banking standards.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <div className="section-title">
                    <h2>How it <span className="blue">Works</span></h2>
                    <p>Simple steps to financial freedom.</p>
                </div>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>You Work</h3>
                            <p>Go to work as usual. Your daily earnings are tracked automatically.</p>
                        </div>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Balance Builds</h3>
                            <p>At the end of each day, your earned salary is added to your available balance.</p>
                        </div>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Withdraw Instantly</h3>
                            <p>Need cash? Transfer funds to your account in seconds.</p>
                        </div>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Receive Remainder</h3>
                            <p>On payday, receive the remaining salary after deductions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Selection Section */}
            <section className="role-selection" id="login">
                <div className="section-title">
                    <h2>Ready to <span className="blue">Join?</span></h2>
                    <p>Choose your platform to get started</p>
                </div>

                <div className="role-grid">
                    <div className="role-card">
                        <div className="role-icon"><Users size={32} /></div>
                        <h3>For Employees</h3>
                        <p>Access your earned salary daily, track earnings, and transfer to any bank or wallet.</p>
                        <ul className="role-features">
                            <li><CheckCircle2 size={16} /> Zero-interest access</li>
                            <li><CheckCircle2 size={16} /> Instant bank transfers</li>
                            <li><CheckCircle2 size={16} /> Financial literacy tools</li>
                        </ul>
                        <button className="btn-role" onClick={() => navigate('/login?role=employee')}>Employee Login</button>
                    </div>

                    <div className="role-card featured">
                        <div className="role-icon"><Building size={32} /></div>
                        <h3>For Organizations</h3>
                        <p>Retain talent and improve employee productivity with our automated salary streaming system.</p>
                        <ul className="role-features">
                            <li><CheckCircle2 size={16} /> Automated payroll sync</li>
                            <li><CheckCircle2 size={16} /> Zero cost to employer</li>
                            <li><CheckCircle2 size={16} /> Detailed analytics</li>
                        </ul>
                        <button className="btn-role highlight" onClick={() => navigate('/login?role=org')}>Organization Portal</button>
                    </div>

                    <div className="role-card">
                        <div className="role-icon"><Lock size={32} /></div>
                        <h3>Regulatory Hub</h3>
                        <p>Secure portal for government audits, compliance tracking, and national labor insights.</p>
                        <ul className="role-features">
                            <li><CheckCircle2 size={16} /> Tax compliance</li>
                            <li><CheckCircle2 size={16} /> Labor data insights</li>
                            <li><CheckCircle2 size={16} /> Audit trail</li>
                        </ul>
                        <button className="btn-role" onClick={() => navigate('/login?role=admin')}>Admin Access</button>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="footer-content">
                    <div className="f-logo">
                        <div className="logo-icon">DP</div>
                        <span>DailyPay Nepal</span>
                    </div>
                    <p>© 2026 DailyPay Nepal. Improving financial stability for every Nepalese employee.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
