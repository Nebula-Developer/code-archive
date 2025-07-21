using AudioEngine.Utility;

using ManagedBass;

namespace AudioEngine.Audio;

public partial class AudioStream {
    public int Handle { get; protected set; }
    public int SampleRate { get; protected set; }
    public int Channels { get; protected set; }

    public AudioStream(int handle) {
        Handle = handle;
        bool getInfo = Bass.ChannelGetInfo(handle, out var info);

        if (!getInfo)
            Utils.BassFailed("get channel info");

        Console.WriteLine("Flags: " + info.Flags);

        if (!info.Flags.HasFlag(BassFlags.Float))
            throw new InvalidOperationException("Audio stream must be created with BassFlags.Float");

        SampleRate = info.Frequency;
        Channels = info.Channels;

        EffectsDSP = new(this);
        AddDSP(EffectsDSP);
    }

    public static AudioStream FromFile(string filePath, BassFlags flags = BassFlags.Float, long offset = 0, long length = 0) {
        int handle = Bass.CreateStream(filePath, offset, length, flags);
        if (handle == 0)
            Utils.BassFailed($"create stream from file '{filePath}'");

        return new AudioStream(handle);
    }

    public virtual void Play(bool restart = false) {
        if (!Bass.ChannelPlay(Handle, restart))
            Utils.BassFailed("play audio stream");
    }

    public virtual void Stop() {
        if (!Bass.ChannelStop(Handle))
            Utils.BassFailed("stop audio stream");
    }

    public virtual void Pause() {
        if (!Bass.ChannelPause(Handle))
            Utils.BassFailed("pause audio stream", Errors.NotPlaying);
    }

    public void Seek(double seconds) => SeekBytes(Bass.ChannelSeconds2Bytes(Handle, seconds));

    public virtual void SeekBytes(long bytes) {
        if (!Bass.ChannelSetPosition(Handle, bytes))
            Utils.BassFailed($"seek audio stream to byte position {bytes}");
    }

    public virtual void Restart() => SeekBytes(0);
}