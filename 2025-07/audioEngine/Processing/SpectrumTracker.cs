using NWaves.Transforms;

namespace AudioEngine.Processing;

public class SpectrumTracker : Effect {
    public int SampleSize {
        get => _sampleSize;
        set {
            if (_sampleSize == value) return;
            _sampleSize = value;

            Array.Resize(ref _samples, _sampleSize);
            _ftt = new RealFft(_sampleSize);

            if (_samplePosition >= _sampleSize)
                _samplePosition = 0;
        }
    }

    private const int _baseSampleSize = 1024;
    private int _sampleSize;
    private int _spectrumSize => (_sampleSize / 2) + 1;
    public float[] _samples;
    private RealFft _ftt;
    private int _samplePosition;
    public float[] Spectrum { get; private set; }

    public SpectrumTracker(int sampleSize = _baseSampleSize) {
        SampleSize = sampleSize;
        _samples = new float[_sampleSize];
        _ftt = new RealFft(_sampleSize);
        Spectrum = new float[_spectrumSize];
    }

    public override float OnProcess(float sample, int channel) {
        _samples[_samplePosition] = sample;
        _samplePosition++;

        if (_samplePosition >= _sampleSize) {
            _samplePosition = 0;

            if (Spectrum.Length != _spectrumSize)
                Spectrum = new float[_spectrumSize];

            _ftt.PowerSpectrum(_samples, Spectrum);
        }

        return sample;
    }
}
