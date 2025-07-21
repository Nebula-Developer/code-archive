

using AudioEngine.Audio;

namespace AudioEngine.Processing;

public abstract class StreamReliantDSP(AudioStream stream) : DSP {
    public AudioStream Stream { get; } = stream;
}