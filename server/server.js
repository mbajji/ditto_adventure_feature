const express = require('express');
const cors = require('cors');
const questions = require('./questions');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

app.get('/api/questions', (req, res) => {
    const count = Math.min(Number(req.query.count) || 10, questions.length);
    const picked = shuffle(questions).slice(0, count).map((q, i) => ({
        id: i,
        scenario: q.scenario,
        prompt: q.prompt,
        options: q.options.map((o, j) => ({
            id: String.fromCharCode(65 + j),
            label: o.label,
            traits: o.traits,
        })),
    }));
    res.json({ questions: picked });
});

app.post('/api/match', (req, res) => {
    const { answers } = req.body || {};
    const totals = {};
    (answers || []).forEach((a) => {
        Object.entries(a.traits || {}).forEach(([t, v]) => {
            totals[t] = (totals[t] || 0) + v;
        });
    });
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
    res.json({ traits: totals, topTraits: top });
});

app.listen(PORT, () => {
    console.log(`ditto api listening on http://localhost:${PORT}`);
});
