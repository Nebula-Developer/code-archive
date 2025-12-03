

using ManagedBass;

namespace AudioEngine.Audio;

public partial class AudioStream {
    public double Position {
        get => Bass.ChannelBytes2Seconds(Handle, Bass.ChannelGetPosition(Handle));
        set => Seek(value);
    }

    public double Frequency {
        get => Bass.ChannelGetAttribute(Handle, ChannelAttribute.Frequency);
        set => Bass.ChannelSetAttribute(Handle, ChannelAttribute.Frequency, value);
    }

    public double Volume {
        get => Bass.ChannelGetAttribute(Handle, ChannelAttribute.Volume);
        set => Bass.ChannelSetAttribute(Handle, ChannelAttribute.Volume, value);
    }

    public double Pan {
        get => Bass.ChannelGetAttribute(Handle, ChannelAttribute.Pan);
        set => Bass.ChannelSetAttribute(Handle, ChannelAttribute.Pan, value);
    }

    public double Length => Bass.ChannelBytes2Seconds(Handle, Bass.ChannelGetLength(Handle));
    public bool Playing => Bass.ChannelIsActive(Handle) == PlaybackState.Playing;
}