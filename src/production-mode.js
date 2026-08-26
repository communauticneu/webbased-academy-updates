(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AcademyProductionMode = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TOTAL_DURATION_SECONDS = 40;
  const PHASES = Object.freeze([
    Object.freeze({
      id: 'avatar1',
      start: 0,
      end: 10,
      speech: 'Willkommen zu unserem ersten vollständigen Academy-Test. Der Avatar führt Sie jetzt in das Thema Wissen verstehen ein.'
    }),
    Object.freeze({
      id: 'board',
      start: 10,
      end: 25,
      speech: 'Auf der Schultafel erscheint nun der zentrale Text. Wissen wird verständlich, wenn Sprache, klare Begriffe und eine übersichtliche Darstellung zusammenwirken.'
    }),
    Object.freeze({
      id: 'graphic',
      start: 25,
      end: 33,
      speech: 'Die ergänzende Grafik macht den Zusammenhang auf einen Blick sichtbar.'
    }),
    Object.freeze({
      id: 'avatar2',
      start: 33,
      end: 40,
      speech: 'Damit endet der Test. Wir kehren jetzt zum Avatar zurück.'
    })
  ]);
  const COMPLETE_PHASE = Object.freeze({ id: 'complete', start: 40, end: 40, speech: '' });

  function clampTime(value) {
    const time = Number(value);
    if (!Number.isFinite(time)) return 0;
    return Math.min(TOTAL_DURATION_SECONDS, Math.max(0, time));
  }

  function getProductionPhase(time) {
    const safeTime = clampTime(time);
    return PHASES.find(phase => safeTime >= phase.start && safeTime < phase.end) || COMPLETE_PHASE;
  }

  function formatProductionTime(time) {
    const safeTime = clampTime(time);
    const seconds = Math.floor(safeTime);
    const tenth = Math.floor((safeTime - seconds) * 10);
    return '00:' + String(seconds).padStart(2, '0') + '.' + tenth;
  }

  function getFrameDeltaSeconds(previousTimestamp, currentTimestamp) {
    const previous = Number(previousTimestamp);
    const current = Number(currentTimestamp);
    if (!Number.isFinite(previous) || !Number.isFinite(current) || current <= previous) return 0;
    return (current - previous) / 1000;
  }

  function createProductionTimeline(options) {
    const onPhaseChange = options && typeof options.onPhaseChange === 'function'
      ? options.onPhaseChange
      : function () {};
    const onTimeChange = options && typeof options.onTimeChange === 'function'
      ? options.onTimeChange
      : function () {};
    let time = 0;
    let running = false;
    let phase = getProductionPhase(0);
    let announcedPhaseId = null;

    function announce(nextPhase) {
      phase = nextPhase;
      if (phase.id !== announcedPhaseId) {
        announcedPhaseId = phase.id;
        onPhaseChange(phase);
      }
    }

    return {
      start() {
        if (time >= TOTAL_DURATION_SECONDS) time = 0;
        running = true;
        announce(getProductionPhase(time));
        onTimeChange(time);
        return this.getState();
      },
      advance(seconds) {
        if (!running) return this.getState();
        const previousTime = time;
        time = clampTime(time + Math.max(0, Number(seconds) || 0));
        PHASES.forEach(candidate => {
          if (candidate.start > previousTime && candidate.start <= time) announce(candidate);
        });
        if (time >= TOTAL_DURATION_SECONDS) {
          running = false;
          announce(COMPLETE_PHASE);
        } else {
          announce(getProductionPhase(time));
        }
        onTimeChange(time);
        return this.getState();
      },
      pause() {
        running = false;
        return this.getState();
      },
      reset() {
        time = 0;
        running = false;
        announcedPhaseId = null;
        phase = getProductionPhase(0);
        onTimeChange(time);
        return this.getState();
      },
      getState() {
        return { time, running, phase };
      }
    };
  }

  function createSpeechCoordinator(options) {
    const synth = options && options.synth;
    const Utterance = options && options.Utterance;
    let selectedVoice = null;
    let phaseId = null;
    let speaking = false;

    function stopSpeech() {
      if (synth && typeof synth.cancel === 'function') synth.cancel();
      speaking = false;
    }

    return {
      setVoice(voice) {
        selectedVoice = voice || null;
      },
      enterPhase(nextPhaseId, force) {
        if (nextPhaseId === phaseId && !force) return { phaseId, speaking };
        phaseId = nextPhaseId;
        stopSpeech();
        const phase = PHASES.find(item => item.id === nextPhaseId);
        if (!phase || !phase.speech || !synth || typeof synth.speak !== 'function' || !Utterance) {
          return { phaseId, speaking };
        }
        const utterance = new Utterance(phase.speech);
        utterance.lang = selectedVoice && selectedVoice.lang ? selectedVoice.lang : 'de-AT';
        utterance.rate = 1;
        utterance.pitch = 1;
        if (selectedVoice) utterance.voice = selectedVoice;
        synth.speak(utterance);
        speaking = true;
        return { phaseId, speaking };
      },
      pause() {
        stopSpeech();
        return { phaseId, speaking };
      },
      reset() {
        stopSpeech();
        phaseId = null;
        return { phaseId, speaking };
      },
      getState() {
        return { phaseId, speaking, selectedVoice };
      }
    };
  }

  return {
    TOTAL_DURATION_SECONDS,
    PHASES,
    getProductionPhase,
    formatProductionTime,
    getFrameDeltaSeconds,
    createProductionTimeline,
    createSpeechCoordinator
  };
});
