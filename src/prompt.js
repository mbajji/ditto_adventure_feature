import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './prompt.css';

function Prompt(){
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/questions?count=10')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to load questions');
                return r.json();
            })
            .then((data) => {
                setQuestions(data.questions || []);
                setLoading(false);
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    }, []);

    const handlePick = (option) => {
        const next = [...answers, { questionId: questions[index].id, optionId: option.id, traits: option.traits }];
        setAnswers(next);

        if (index + 1 >= questions.length) {
            navigate('/results', { state: { answers: next } });
        } else {
            setIndex(index + 1);
        }
    };

    if (loading) {
        return (
            <div className="prompt-page">
                <div className="prompt-wrap"><p className="prompt-loading">Summoning your quest...</p></div>
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <div className="prompt-page">
                <div className="prompt-wrap">
                    <p className="prompt-error">
                        {error || 'No questions available.'}
                        <br />Make sure the backend is running: <code>npm run server</code>
                    </p>
                </div>
            </div>
        );
    }

    const current = questions[index];
    const percent = Math.round(((index) / questions.length) * 100);

    return (
        <div className="prompt-page">
            <div className="prompt-wrap">
                <div className="prompt-progress-row">
                    <span>Question {index + 1} of {questions.length}</span>
                    <span>{percent}%</span>
                </div>
                <div className="prompt-progress-track">
                    <div className="prompt-progress-fill" style={{ width: `${percent}%` }} />
                </div>

                <div className="prompt-card">
                    <span className="prompt-pill">Scenario</span>
                    <p className="prompt-scenario">{current.scenario}</p>
                    <h2 className="prompt-question">{current.prompt}</h2>

                    <div className="prompt-options">
                        {current.options.map((opt) => (
                            <button
                                key={opt.id}
                                className="prompt-option"
                                onClick={() => handlePick(opt)}
                            >
                                <span className="prompt-option-letter">{opt.id}</span>
                                <span className="prompt-option-label">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Prompt;
