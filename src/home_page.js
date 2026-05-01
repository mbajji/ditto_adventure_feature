import { useNavigate } from 'react-router-dom';
import './home_page.css';

function Home(){
    const navigate = useNavigate();
    return(
        <div className="home-page">
            <div className="home-card">
                <div className="home-icon">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4l1.5 3L20 8.5l-3.5 1.5L15 13l-1.5-3L10 8.5 13.5 7 15 4z" fill="#fff"/>
                        <path d="M5 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#fff"/>
                        <path d="M4.5 19.5l9-9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                    <span className="home-icon-sparkle">✨</span>
                </div>
                <h1 className="home-title">Your Quest Awaits</h1>
                <p className="home-description">
                    Embark on an adventure that reveals who you really are. Make choices through 10 epic scenarios involving dragons, portals, treasure hunts, and magical guilds. Your decisions will map your personality and find your perfect match.
                </p>
                <button className="home-button" onClick={() => navigate('/prompt')}>
                    Start Your Journey
                </button>
                <p className="home-footnote">Takes about 3–5 minutes</p>
            </div>
        </div>
    )
}

export default Home;
