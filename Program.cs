


using AudioEngine.Audio;
using AudioEngine.Processing;
using AudioEngine.Utility;

using ManagedBass;
using ManagedBass.Mix;

namespace AudioEngine;

public class AudioMixer(int handle) : AudioStream(handle) {
    private readonly List<AudioStream> _streams = new();
    private readonly Lock _streamsLock = new();

    public IReadOnlyList<AudioStream> Streams {
        get { lock (_streamsLock) { return _streams.AsReadOnly(); } }
    }

    public static AudioMixer Create(int sampleRate, int channels, BassFlags flags = BassFlags.Float | BassFlags.MixerNonStop) {
        int handle = BassMix.CreateMixerStream(sampleRate, channels, flags);
        return new(handle);
    }

    public void AddStream(AudioStream stream) {
        ArgumentNullException.ThrowIfNull(stream);
        lock (_streamsLock) {
            if (!BassMix.MixerAddChannel(Handle, stream.Handle, BassFlags.Float))
                Utils.BassFailed($"add stream {stream.Handle} to mixer {Handle}");
            _streams.Add(stream);
        }
    }

    public void RemoveStream(AudioStream stream) {
        ArgumentNullException.ThrowIfNull(stream);
        lock (_streamsLock) {
            if (!BassMix.MixerRemoveChannel(stream.Handle))
                Utils.BassFailed($"remove stream {stream.Handle} from mixer {Handle}");
            _streams.Remove(stream);
        }
    }

    public void ClearStreams() {
        lock (_streamsLock) {
            foreach (var stream in _streams)
                BassMix.MixerRemoveChannel(stream.Handle);
            _streams.Clear();
        }
    }
}


public static class Program {
    public static void PrintSpectrum(float[] spectrum) {
        Console.Clear();

        int count = spectrum.Length;
        int width = Console.WindowWidth - 1;
        int height = Console.WindowHeight - 1;
        // int max = (int)spectrum.Max();

        for (int i = 0; i < count; i++) {
            int y = (int)(spectrum[i] * (height - 1));
            int x = (int)(i / (float)count * width);

            y = Math.Min(Math.Max(y, 0), height - 1);
            for (int l = 0; l < y; l++) {
                Console.SetCursorPosition(x, height - l - 1);
                Console.Write('█');
            }
        }
    }

    public static void Main(string[] args) {
        bool init = Bass.Init();

        if (!init) {
            Console.WriteLine("Bass initialization failed: " + Bass.LastError);
            return;
        }

        int updatePeriod = 5;
        int updateThreads = 2;
        int bufferLength = updatePeriod + 5;

        Bass.UpdatePeriod = updatePeriod;
        Bass.UpdateThreads = 0;
        Bass.DeviceBufferLength = bufferLength;
        Bass.PlaybackBufferLength = bufferLength;
        BassMix.MixerBufferLength = 1;

        AudioMixer mixer = AudioMixer.Create(44100, 2);
        SpectrumTracker tracker = new();
        mixer.AddEffect(tracker);

        mixer.Volume = 1;
        mixer.Play();

        AudioStream hitSample = AudioStream.FromFile("what.mp3", BassFlags.Float | BassFlags.Decode);
        mixer.AddStream(hitSample);

        while (true) {
            if (Console.KeyAvailable) {
                Console.ReadKey(true);
                hitSample.Position = 20;
            }

            Thread.Sleep(5);
            Bass.Update(200);
        }
    }
}
