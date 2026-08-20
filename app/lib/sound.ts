export type YunoSound =
  | "skip"
  | "save"
  | "connect"
  | "match"
  | "messageSent"
  | "messageReceived"
  | "skillHourEarned";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;

  const AudioContextClass =
    window.AudioContext ??
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function tone(
  context: AudioContext,
  {
    frequency,
    endFrequency = frequency,
    duration,
    volume,
    delay = 0,
    type = "sine",
  }: {
    frequency: number;
    endFrequency?: number;
    duration: number;
    volume: number;
    delay?: number;
    type?: OscillatorType;
  },
) {
  const now = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    Math.max(endFrequency, 1),
    now + duration,
  );

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + duration,
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function noise(
  context: AudioContext,
  {
    duration,
    volume,
  }: {
    duration: number;
    volume: number;
  },
) {
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(
    1,
    sampleRate * duration,
    sampleRate,
  );

  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] =
      (Math.random() * 2 - 1) *
      Math.pow(1 - index / data.length, 2);
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = buffer;

  filter.type = "bandpass";
  filter.frequency.value = 1100;
  filter.Q.value = 0.7;

  gain.gain.value = volume;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  source.start();
}

export async function playYunoSound(sound: YunoSound) {
  const context = getAudioContext();

  if (!context) return;

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  switch (sound) {
    case "skip":
      noise(context, {
        duration: 0.12,
        volume: 0.025,
      });

      tone(context, {
        frequency: 420,
        endFrequency: 220,
        duration: 0.13,
        volume: 0.025,
        type: "sine",
      });
      break;

    case "save":
      tone(context, {
        frequency: 620,
        endFrequency: 760,
        duration: 0.1,
        volume: 0.035,
      });

      tone(context, {
        frequency: 900,
        duration: 0.09,
        volume: 0.025,
        delay: 0.055,
      });
      break;

    case "connect":
      tone(context, {
        frequency: 380,
        endFrequency: 620,
        duration: 0.12,
        volume: 0.035,
      });

      tone(context, {
        frequency: 620,
        endFrequency: 820,
        duration: 0.13,
        volume: 0.03,
        delay: 0.075,
      });
      break;

    case "match":
      tone(context, {
        frequency: 523.25,
        endFrequency: 659.25,
        duration: 0.18,
        volume: 0.045,
      });

      tone(context, {
        frequency: 659.25,
        endFrequency: 783.99,
        duration: 0.2,
        volume: 0.045,
        delay: 0.12,
      });

      tone(context, {
        frequency: 783.99,
        endFrequency: 1046.5,
        duration: 0.42,
        volume: 0.04,
        delay: 0.26,
      });

      tone(context, {
        frequency: 392,
        endFrequency: 523.25,
        duration: 0.55,
        volume: 0.02,
        delay: 0.1,
        type: "triangle",
      });
      break;

    case "messageSent":
      tone(context, {
        frequency: 540,
        endFrequency: 720,
        duration: 0.08,
        volume: 0.02,
      });
      break;

    case "messageReceived":
      tone(context, {
        frequency: 720,
        duration: 0.09,
        volume: 0.022,
      });

      tone(context, {
        frequency: 880,
        duration: 0.11,
        volume: 0.02,
        delay: 0.07,
      });
      break;

    case "skillHourEarned":
      tone(context, {
        frequency: 523.25,
        endFrequency: 659.25,
        duration: 0.15,
        volume: 0.035,
      });

      tone(context, {
        frequency: 659.25,
        endFrequency: 783.99,
        duration: 0.16,
        volume: 0.035,
        delay: 0.11,
      });

      tone(context, {
        frequency: 1046.5,
        duration: 0.32,
        volume: 0.04,
        delay: 0.24,
      });
      break;
  }
}
