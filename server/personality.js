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

    const confrontScore = t('amb') + t('log');
    const mediateScore = t('emp') + t('soc');
    const avoidScore = t('cau') + t('sol');
    const top = Math.max(confrontScore, mediateScore, avoidScore);
    let conflict;
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

module.exports = { tallyTraits, deriveProfile };
