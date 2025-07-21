using System.Runtime.InteropServices;

using AudioEngine.Audio;
using AudioEngine.Utility;

using ManagedBass;

namespace AudioEngine.Processing;

public struct EffectContext {
    public int SampleRate;
    public int Channels;
}

public class EffectDSP(AudioStream stream) : StreamReliantDSP(stream) {
    private readonly List<Effect> _effects = new();
    private readonly Lock _effectsLock = new();

    protected EffectContext GetContext() => new() { Channels = Stream.Channels, SampleRate = Stream.SampleRate };

    public IReadOnlyList<Effect> Effects {
        get { lock (_effectsLock) { return _effects.AsReadOnly(); } }
    }

    public void AddEffect(Effect effect) {
        ArgumentNullException.ThrowIfNull(effect);
        lock (_effectsLock) {
            _effects.Add(effect);
            effect.Init(GetContext());
        }
    }

    public void InsertEffect(int index, Effect effect) {
        ArgumentNullException.ThrowIfNull(effect);
        lock (_effectsLock) {
            _effects.Insert(index, effect);
            effect.Init(GetContext());
        }
    }

    public void RemoveEffect(Effect effect) {
        ArgumentNullException.ThrowIfNull(effect);
        lock (_effectsLock) {
            _effects.Remove(effect);
        }
    }

    public void MoveEffect(int oldIndex, int newIndex) {
        lock (_effectsLock) {
            if (oldIndex < 0 || oldIndex >= _effects.Count || newIndex < 0 || newIndex >= _effects.Count)
                throw new ArgumentOutOfRangeException();
            var effect = _effects[oldIndex];
            _effects.RemoveAt(oldIndex);
            _effects.Insert(newIndex, effect);
        }
    }

    public void ClearEffects() {
        lock (_effectsLock) {
            _effects.Clear();
        }
    }

    public override unsafe void Procedure(int handle, int channel, IntPtr buffer, int length, IntPtr user) {
        Span<float> samples = Utils.BufferSpan(buffer, length);
        lock (_effectsLock) {
            for (int i = 0; i < samples.Length; i++) {
                foreach (var effect in _effects) {
                    samples[i] = effect.Process(samples[i], channel);
                }
            }
        }
    }
}
