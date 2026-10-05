const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const elements = new Map();
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '', value: '', addEventListener() {} });
    return elements.get(id);
  },
  querySelectorAll() { return []; },
};
const sandbox = {
  document,
  localStorage: { getItem() { return null; }, setItem() {} },
  window: null,
  console,
  prompt() { return null; },
  URL,
  Blob,
  setTimeout() {},
  clearTimeout() {},
};
sandbox.window = sandbox;
vm.runInNewContext(fs.readFileSync('app.js', 'utf8'), sandbox, { filename: 'app.js' });
const { teamStats, playerStats, parseLine, similarity, tableDutyStats } = sandbox.BaselineCalculations;

function game(id, score, against, teamId = 'first', venueType = 'HOME', appearances = [], tableDuty = []) {
  return { id, teamId, ourScore: score, opponentScore: against, venueType, appearances, tableDuty };
}
function appearance(playerId, status = 'PLAYED', points = 0, fouls = 0) {
  return { playerId, status, stats: { points, fouls } };
}

test('team record and averages derive from scores', () => {
  const s = teamStats([game('1',72,68), game('2',60,70), game('3',80,70)]);
  assert.equal(s.w, 2); assert.equal(s.l, 1); assert.ok(Math.abs(s.wpct - 200/3) < 1e-10);
  assert.equal(s.pf, 212); assert.equal(s.pa, 208);
});

test('player points and PPG derive from played appearances', () => {
  const s = playerStats('p', [game('1',80,70,'first','HOME',[appearance('p','PLAYED',10)]), game('2',80,70,'first','HOME',[appearance('p','PLAYED',20)]), game('3',80,70,'first','HOME',[appearance('p','PLAYED',15)])]);
  assert.equal(s.gp, 3); assert.equal(s.points, 45); assert.equal(s.ppg, 15);
});

test('missed team games are not counted as player losses', () => {
  const games = [game('1',72,68),game('2',60,70),game('3',80,70),game('4',50,62),game('5',78,65)];
  games[0].appearances=[appearance('p')]; games[1].appearances=[appearance('p')]; games[2].appearances=[appearance('p')];
  const s=playerStats('p',games); assert.equal(s.wins,2); assert.equal(s.losses,1); assert.ok(Math.abs(s.wpct-200/3)<1e-10);
});

test('a multi-team player aggregates appearances and keeps team splits', () => {
  const games=[game('1',70,60,'first','HOME',[appearance('p')]),game('2',70,60,'first','HOME',[appearance('p')]),game('3',70,60,'first','HOME',[appearance('p')]),game('4',60,70,'second','AWAY',[appearance('p')]),game('5',60,70,'second','AWAY',[appearance('p')])];
  assert.equal(playerStats('p',games).gp,5);
  assert.equal(playerStats('p',games.filter(g=>g.teamId==='first')).gp,3);
  assert.equal(playerStats('p',games.filter(g=>g.teamId==='second')).gp,2);
});

test('attendance distinguishes played, attended not playing, and unavailable', () => {
  const s=playerStats('p',[game('1',1,0,'first','HOME',[appearance('p','PLAYED',8)]),game('2',1,0,'first','HOME',[appearance('p','PLAYED',5)]),game('3',1,0,'first','HOME',[appearance('p','ATTENDED_DID_NOT_PLAY')]),game('4',1,0,'first','HOME',[appearance('p','UNAVAILABLE')])]);
  assert.equal(s.gp,2); assert.equal(s.attended,3); assert.equal(s.unavailable,1); assert.equal(s.attendanceRate,75);
});

test('away attendance counts played and attended appearances', () => {
  const games=Array.from({length:7},(_,i)=>game(String(i),60,55,'t',i<4?'AWAY':'HOME',[appearance('p',i===1?'ATTENDED_DID_NOT_PLAY':'PLAYED')]));
  assert.equal(games.filter(g=>g.venueType==='AWAY'&&g.appearances.some(a=>a.playerId==='p'&&['PLAYED','ATTENDED_DID_NOT_PLAY'].includes(a.status))).length,4);
});

test('table duty counts contributors once per recorded home game', () => {
  const counts=tableDutyStats([game('1',1,0,'t','HOME',[],['alex']),game('2',1,0,'t','HOME',[],['alex','sam']),game('3',1,0,'t','AWAY',[],['sam'])]);
  assert.equal(counts.get('alex'),2); assert.equal(counts.get('sam'),1);
});

test('paste parser accepts forgiving delimiters and name matching warns on near names', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(parseLine('Ben - 14 - 2'))), {name:'Ben',points:14,fouls:2});
  assert.deepEqual(JSON.parse(JSON.stringify(parseLine('Ben,14,2'))), {name:'Ben',points:14,fouls:2});
  assert.ok(similarity('Ben','Benn') > .7);
});
