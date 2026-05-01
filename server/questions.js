// Each option carries trait weights. After 10 questions we tally weights to
// build a personality profile. Traits used:
//   adv  - adventurous / risk-taking
//   cau  - cautious / measured
//   soc  - social / extroverted
//   sol  - solitary / introverted
//   emp  - empathetic / nurturing
//   log  - logical / analytical
//   cre  - creative / imaginative
//   amb  - ambitious / driven

const questions = [
    {
        scenario: "You've just joined a secret quest guild. Your assigned partner hasn't shown up to the first mission briefing.",
        prompt: "What do you do?",
        options: [
            { label: "Start planning solo - they'll catch up when they can", traits: { sol: 2, log: 1, amb: 1 } },
            { label: "Send multiple messages asking if everything's okay", traits: { emp: 2, soc: 1, cau: 1 } },
            { label: "Request a solo mission instead - I work better alone anyway", traits: { sol: 3, amb: 1 } },
        ],
    },
    {
        scenario: "A dragon offers you a deal: tell it your deepest secret in exchange for a chest of gold.",
        prompt: "What's your move?",
        options: [
            { label: "Take the deal - secrets are just stories anyway", traits: { adv: 2, soc: 1 } },
            { label: "Negotiate something smaller in return for less risk", traits: { cau: 2, log: 2 } },
            { label: "Walk away - some things aren't for sale", traits: { sol: 2, emp: 1 } },
        ],
    },
    {
        scenario: "A glowing portal appears in your kitchen. There's no label, no instructions, no return ticket.",
        prompt: "Do you step through?",
        options: [
            { label: "Immediately - this is what I've been waiting for", traits: { adv: 3, cre: 1 } },
            { label: "Only after researching every possible outcome", traits: { cau: 2, log: 2 } },
            { label: "Bring a friend - adventures are better shared", traits: { soc: 2, emp: 1, adv: 1 } },
        ],
    },
    {
        scenario: "Your guild is split on a treasure hunt: half want the safe path, half want the shortcut through the haunted forest.",
        prompt: "Which side do you join?",
        options: [
            { label: "Haunted forest - the story will be worth it", traits: { adv: 2, cre: 1 } },
            { label: "Safe path - I'd rather arrive than impress", traits: { cau: 2, log: 1 } },
            { label: "Try to convince both sides to compromise", traits: { emp: 2, soc: 2 } },
        ],
    },
    {
        scenario: "A wizard offers you one of three gifts: a map of every road, a book of every spell, or a key to every door.",
        prompt: "Which do you take?",
        options: [
            { label: "The map - I want to see everywhere", traits: { adv: 2, cur: 1, cre: 1 } },
            { label: "The book - knowledge is the real power", traits: { log: 3, amb: 1 } },
            { label: "The key - opportunities matter more than information", traits: { amb: 2, adv: 1 } },
        ],
    },
    {
        scenario: "You find a wounded creature in the woods that can speak but you don't recognize its language.",
        prompt: "What do you do?",
        options: [
            { label: "Sit with it and try to learn the language", traits: { emp: 3, cre: 1 } },
            { label: "Carry it to the nearest healer immediately", traits: { emp: 2, log: 1, cau: 1 } },
            { label: "Mark its location and bring back help", traits: { log: 2, cau: 2 } },
        ],
    },
    {
        scenario: "A rival guild challenges yours to a tournament. The prize is bragging rights - and a cursed sword.",
        prompt: "How do you compete?",
        options: [
            { label: "Go all in - I want the win and the sword", traits: { amb: 3, adv: 1 } },
            { label: "Compete cleanly - I just want to test myself", traits: { log: 1, sol: 1, amb: 1 } },
            { label: "Hype up my teammates - the win is theirs too", traits: { soc: 2, emp: 2 } },
        ],
    },
    {
        scenario: "You've been chosen to lead a quest party of strangers across the continent.",
        prompt: "What's your leadership style?",
        options: [
            { label: "Plan the route, assign roles, set expectations", traits: { log: 2, amb: 2 } },
            { label: "Lead by listening - everyone's voice matters", traits: { emp: 2, soc: 2 } },
            { label: "Lead by example - I'll do the hardest job myself", traits: { sol: 2, amb: 1, adv: 1 } },
        ],
    },
    {
        scenario: "An enchanted mirror shows you a future you didn't expect.",
        prompt: "How do you respond?",
        options: [
            { label: "Embrace it - the unexpected is the point", traits: { adv: 2, cre: 2 } },
            { label: "Question the mirror - futures aren't fixed", traits: { log: 2, cau: 1 } },
            { label: "Talk it through with someone I trust", traits: { soc: 1, emp: 2 } },
        ],
    },
    {
        scenario: "A festival night in the capital. Music, fireworks, a thousand strangers in masks.",
        prompt: "Where do you spend the evening?",
        options: [
            { label: "In the middle of the crowd, dancing with everyone", traits: { soc: 3, adv: 1 } },
            { label: "On a quiet rooftop, watching it all from above", traits: { sol: 2, cre: 2 } },
            { label: "At a small table with one person worth knowing", traits: { emp: 2, sol: 1, soc: 1 } },
        ],
    },
    {
        scenario: "You stumble on an unguarded chest in a dungeon. It's almost certainly trapped.",
        prompt: "What's your call?",
        options: [
            { label: "Open it - the reward beats the risk", traits: { adv: 3 } },
            { label: "Disarm what I can find first, then carefully open", traits: { log: 2, cau: 2 } },
            { label: "Leave it - if it were safe, someone would've taken it", traits: { cau: 3, log: 1 } },
        ],
    },
    {
        scenario: "Your guildmate failed a mission and is being publicly criticized at the meeting.",
        prompt: "What do you do?",
        options: [
            { label: "Defend them out loud - everyone fails sometimes", traits: { emp: 3, soc: 1 } },
            { label: "Pull them aside privately afterward to check in", traits: { emp: 2, sol: 1 } },
            { label: "Stay quiet - they need to learn from this", traits: { log: 2, cau: 1 } },
        ],
    },
    {
        scenario: "A bard challenges you to write a song about your life so far.",
        prompt: "What's the song about?",
        options: [
            { label: "All the places I haven't been yet", traits: { adv: 2, cre: 2 } },
            { label: "The people who shaped me", traits: { emp: 2, soc: 1 } },
            { label: "What I'm building, brick by brick", traits: { amb: 2, log: 1 } },
        ],
    },
    {
        scenario: "You're offered immortality, but you'd lose the ability to feel surprise.",
        prompt: "What do you choose?",
        options: [
            { label: "Refuse - surprise is what makes life worth it", traits: { adv: 2, cre: 2, emp: 1 } },
            { label: "Accept - more time means more I can do", traits: { amb: 3, log: 1 } },
            { label: "Negotiate - there has to be a middle ground", traits: { log: 2, cau: 1 } },
        ],
    },
    {
        scenario: "Your dream date in a fantasy world.",
        prompt: "What does it look like?",
        options: [
            { label: "Sword fighting lesson, then dinner with the moon", traits: { adv: 2, soc: 1 } },
            { label: "Quiet bookstore in a sleepy magical village", traits: { sol: 2, cre: 2 } },
            { label: "Stargazing on a cliff, talking till sunrise", traits: { emp: 2, cre: 1, soc: 1 } },
        ],
    },
];

module.exports = questions;
