import { useLocation, useNavigate } from 'react-router-dom';
import './results.css';

function tallyTraits(answers) {
    const totals = {};
    (answers || []).forEach((a) => {
        Object.entries(a.traits || {}).forEach(([t, v]) => {
            totals[t] = (totals[t] || 0) + v;
        });
    });
    return totals;
}

function deriveProfile(totals) {
    const t = (k) => totals[k] || 0;

    let attachment;
    if (t('emp') >= 4 && t('soc') >= 2) attachment = 'Secure';
    else if (t('cau') >= 4 && t('emp') >= 2) attachment = 'Anxious';
    else if (t('sol') >= 4) attachment = 'Avoidant';
    else attachment = 'Earned Secure';

    let social;
    if (t('soc') > t('sol') + 2) social = 'Extrovert';
    else if (t('sol') > t('soc') + 2) social = 'Introvert';
    else social = 'Ambivert';

    let conflict;
    const confrontScore = t('amb') + t('log');
    const mediateScore = t('emp') + t('soc');
    const avoidScore = t('cau') + t('sol');
    const top = Math.max(confrontScore, mediateScore, avoidScore);
    if (top === confrontScore) conflict = 'Confront';
    else if (top === mediateScore) conflict = 'Mediate';
    else conflict = 'Reflect';

    const valueMap = {
        adv: 'Adventure',
        amb: 'Achievement',
        emp: 'Connection',
        cre: 'Creativity',
        log: 'Knowledge',
        cau: 'Stability',
        soc: 'Belonging',
        sol: 'Independence',
    };
    const topValue = Object.entries(totals)
        .filter(([k]) => valueMap[k])
        .sort((a, b) => b[1] - a[1])[0];
    const coreValue = topValue ? valueMap[topValue[0]] : 'Adventure';

    return { attachment, social, conflict, coreValue };
}

const ICONS = {
    heart: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    ),
    people: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    chat: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    ),
    compass: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
    ),
};

function Results(){
    const navigate = useNavigate();
    const location = useLocation();
    const answers = location.state?.answers;

    if (!answers) {
        return (
            <div className="results-page">
                <div className="results-wrap">
                    <p className="results-empty">No quest results yet. <button className="results-btn-secondary" onClick={() => navigate('/')}>Start one</button></p>
                </div>
            </div>
        );
    }

    const totals = tallyTraits(answers);
    const profile = deriveProfile(totals);

    const cards = [
        { icon: ICONS.heart, label: 'Attachment Style', value: profile.attachment },
        { icon: ICONS.people, label: 'Social Energy', value: profile.social },
        { icon: ICONS.chat, label: 'Conflict Approach', value: profile.conflict },
        { icon: ICONS.compass, label: 'Core Values', value: profile.coreValue },
    ];

    return (
        <div className="results-page">
            <div className="results-wrap">
                <div className="results-header">
                    <div className="results-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
                            <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" fill="#fff"/>
                        </svg>
                    </div>
                    <h1 className="results-title">Quest Complete!</h1>
                    <p className="results-subtitle">Here's what your adventure revealed</p>
                </div>

                <div className="results-cards">
                    {cards.map((c) => (
                        <div key={c.label} className="results-card">
                            <div className="results-card-icon">{c.icon}</div>
                            <div>
                                <p className="results-card-label">{c.label}</p>
                                <p className="results-card-value">{c.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="results-cta">
                    <h2 className="results-cta-title">Your Destiny Awaits</h2>
                    <p className="results-cta-text">
                        Based on your adventure choices, we're finding companions who match your quest style. Your matches will complement your personality across all dimensions.
                    </p>
                    <div className="results-cta-buttons">
                        <button className="results-btn-primary" onClick={() => navigate('/matches')}>View Matches</button>
                        <button className="results-btn-secondary" onClick={() => navigate('/prompt')}>New Adventure</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Results;
