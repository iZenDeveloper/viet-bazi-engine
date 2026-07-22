export function localizeFacts(chart, locale = 'vi') {
    const english = { DAY_MASTER: `Day Master is ${chart.dayMaster.name} ${chart.dayMaster.element}.`, SEASON: `Birth month is ${chart.pillars.month.branch.name}; seasonal qi favors ${chart.pillars.month.branch.element}.`, ELEMENT_BALANCE: `${[...chart.elements].sort((a, b) => b.percent - a.percent)[0].element} is the strongest element; Day Master ${chart.dayMaster.element} is ${chart.elements.find(x => x.element === chart.dayMaster.element).strength}.`, NEAR_SOLAR_TERM: `Birth time is close to a solar-term boundary; verify the input.` };
    const facts = chart.metadata.facts.map(f => ({ code: f.code, text: locale === 'vi' ? f.vi : (english[f.code] ?? f.vi), confidence: f.confidence, evidence: f.evidence }));
    return { schemaVersion: '1.0', locale, facts, warnings: locale === 'vi' ? chart.metadata.warnings : chart.metadata.warnings.map(() => 'Review the calculation warnings before interpretation.') };
}
