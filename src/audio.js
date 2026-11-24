export function createAudio() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let muted = false;
  let musicStep = 0;
  const bass = [65.41, 65.41, 77.78, 65.41, 87.31, 87.31, 98.00, 77.78];

  function sfx(type) {
    if (muted || ctx.state === 'suspended') return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if (type === 'laser') {
      o.type = 'sawtooth'; o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(220, t + 0.12);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    } else if (type === 'coin') {
      o.type = 'triangle'; o.frequency.setValueAtTime(980, t); o.frequency.setValueAtTime(1400, t + 0.06);
      g.gain.setValueAtTime(0.14, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    } else if (type === 'crash') {
      o.type = 'sawtooth'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.4);
      g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    } else if (type === 'shield') {
      o.type = 'sine'; o.frequency.setValueAtTime(420, t); o.frequency.linearRampToValueAtTime(980, t + 0.25);
      g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    }
    o.start(t); o.stop(t + 0.45);
  }

  // Фоновый бас
  setInterval(() => {
    if (muted || !window.isPlaying) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(bass[musicStep % 8], t);
    f.type = 'lowpass'; f.frequency.setValueAtTime(320, t);
    g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(f); f.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.14);
    musicStep++;
  }, 170);

  return {
    sfx,
    toggle() { muted = !muted; return muted; },
    resume() { if (ctx.state === 'suspended') ctx.resume(); }
  };
}
