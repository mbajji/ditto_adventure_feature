const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const questions = require('./questions');
const { tallyTraits, deriveProfile } = require('./personality');
const { encryptEnvelope, decryptEnvelope } = require('./crypto');

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

const personalityStore = new Map();

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

app.post('/api/personality', (req, res) => {
    const { answers } = req.body || {};
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'answers array required' });
    }
    const totals = tallyTraits(answers);
    const profile = deriveProfile(totals);
    const payload = {
        traits: totals,
        profile,
        savedAt: new Date().toISOString(),
    };

    const blob = encryptEnvelope(JSON.stringify(payload));
    const id = randomUUID();
    personalityStore.set(id, blob);

    res.json({
        id,
        profile,
        encrypted: blob,
    });
});

app.get('/api/personality/:id', (req, res) => {
    const blob = personalityStore.get(req.params.id);
    if (!blob) return res.status(404).json({ error: 'not found' });
    const plaintext = decryptEnvelope(blob);
    res.json({ id: req.params.id, ...JSON.parse(plaintext) });
});

app.get('/api/personality/:id/raw', (req, res) => {
    const blob = personalityStore.get(req.params.id);
    if (!blob) return res.status(404).json({ error: 'not found' });
    res.json({ id: req.params.id, encrypted: blob });
});

app.listen(PORT, () => {
    console.log(`ditto api listening on http://localhost:${PORT}`);
});
