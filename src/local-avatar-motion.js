(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LocalAvatarMotion = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function finite(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function getDeterministicPose(timeMs, state) {
    const t = Math.max(0, finite(timeMs, 0));
    const speaking = !!(state && state.speaking);
    const gesture = state && state.gesture === 'point' ? 'point' : 'front';
    const headTilt = Math.sin(t / 1150) * 1.8;
    const bodyLift = Math.sin(t / 900) * 1.15;
    const breathScale = 1 + Math.sin(t / 1250) * 0.008;
    const blinkCycle = t % 4200;
    const blink = blinkCycle >= 3950 && blinkCycle < 4090;
    const mouthOpen = speaking && (Math.floor(t / 180) % 2 === 1);
    const armSwing = Math.sin(t / 1400) * 2.2;

    return {
      speaking,
      gesture,
      mouthOpen,
      blink,
      headTilt,
      bodyLift,
      breathScale,
      leftArm: gesture === 'point' ? 5 : 7 + armSwing,
      rightArm: gesture === 'point' ? -70 : -7 - armSwing
    };
  }

  function createLocalAvatarMotion(initialState) {
    let state = {
      speaking: !!(initialState && initialState.speaking),
      gesture: initialState && initialState.gesture === 'point' ? 'point' : 'front'
    };

    return {
      setSpeaking(value) {
        state = { ...state, speaking: !!value };
        return this.getState();
      },
      setGesture(value) {
        state = { ...state, gesture: value === 'point' ? 'point' : 'front' };
        return this.getState();
      },
      getPose(timeMs) {
        return getDeterministicPose(timeMs, state);
      },
      getState() {
        return { ...state };
      }
    };
  }

  return { getDeterministicPose, createLocalAvatarMotion };
});
