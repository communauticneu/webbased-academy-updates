const test = require('node:test');
const assert = require('node:assert/strict');

const {
  TOTAL_DURATION_SECONDS,
  getProductionPhase,
  formatProductionTime,
  getFrameDeltaSeconds,
  createSpeechCoordinator,
  createProductionTimeline
} = require('../src/production-mode');

test('maps every production boundary to the requested 40-second phase', () => {
  assert.equal(TOTAL_DURATION_SECONDS, 40);
  assert.equal(getProductionPhase(0).id, 'avatar1');
  assert.equal(getProductionPhase(9.999).id, 'avatar1');
  assert.equal(getProductionPhase(10).id, 'board');
  assert.equal(getProductionPhase(24.999).id, 'board');
  assert.equal(getProductionPhase(25).id, 'graphic');
  assert.equal(getProductionPhase(32.999).id, 'graphic');
  assert.equal(getProductionPhase(33).id, 'avatar2');
  assert.equal(getProductionPhase(40).id, 'complete');
});

test('formats the production clock without exceeding 40 seconds', () => {
  assert.equal(formatProductionTime(0), '00:00.0');
  assert.equal(formatProductionTime(25.67), '00:25.6');
  assert.equal(formatProductionTime(99), '00:40.0');
});

test('keeps the full elapsed wall-clock time after a delayed animation frame', () => {
  assert.equal(getFrameDeltaSeconds(1000, 1400), 0.4);
  assert.equal(getFrameDeltaSeconds(1000, 3500), 2.5);
  assert.equal(getFrameDeltaSeconds(3500, 1000), 0);
});

test('starts one German speech segment for each entered phase using the selected voice', () => {
  const spoken = [];
  let cancelCount = 0;
  const selectedVoice = { name: 'Technische Teststimme', lang: 'de-AT' };
  const synth = {
    cancel() { cancelCount += 1; },
    speak(utterance) { spoken.push(utterance); }
  };
  class Utterance {
    constructor(text) { this.text = text; }
  }
  const speech = createSpeechCoordinator({ synth, Utterance });
  speech.setVoice(selectedVoice);

  const result = speech.enterPhase('board');

  assert.equal(result.phaseId, 'board');
  assert.equal(result.speaking, true);
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].voice, selectedVoice);
  assert.equal(spoken[0].lang, 'de-AT');
  assert.match(spoken[0].text, /Schultafel/);
  assert.equal(cancelCount, 1);
});

test('does not restart speech inside the same phase and stops it on pause or reset', () => {
  let speakCount = 0;
  let cancelCount = 0;
  const synth = {
    cancel() { cancelCount += 1; },
    speak() { speakCount += 1; }
  };
  class Utterance {
    constructor(text) { this.text = text; }
  }
  const speech = createSpeechCoordinator({ synth, Utterance });

  speech.enterPhase('avatar1');
  speech.enterPhase('avatar1');
  speech.pause();
  assert.equal(speech.getState().speaking, false);
  speech.reset();

  assert.equal(speakCount, 1);
  assert.equal(cancelCount, 3);
  assert.equal(speech.getState().phaseId, null);
});

test('runs, pauses and resets the production timeline without losing its position', () => {
  const enteredPhases = [];
  const timeline = createProductionTimeline({
    onPhaseChange(phase) { enteredPhases.push(phase.id); }
  });

  timeline.start();
  timeline.advance(10);
  timeline.advance(15);
  assert.deepEqual(enteredPhases, ['avatar1', 'board', 'graphic']);
  assert.equal(timeline.getState().time, 25);

  timeline.pause();
  timeline.advance(8);
  assert.equal(timeline.getState().time, 25);
  assert.equal(timeline.getState().running, false);

  timeline.start();
  timeline.advance(15);
  assert.equal(timeline.getState().time, 40);
  assert.equal(timeline.getState().running, false);
  assert.equal(timeline.getState().phase.id, 'complete');

  timeline.reset();
  assert.equal(timeline.getState().time, 0);
  assert.equal(timeline.getState().phase.id, 'avatar1');
});
