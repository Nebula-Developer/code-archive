namespace AudioEngine.Processing;

public abstract class Effect {
    private float _wet = 1f;
    private float _dry = 0f;
    private bool _enabled = true;

    public bool Enabled {
        get => _enabled;
        set => _enabled = value;
    }

    public float Wet {
        get => _wet;
        set => _wet = Math.Clamp(value, 0.0f, 1.0f);
    }

    public float Dry {
        get => _dry;
        set => _dry = Math.Clamp(value, 0.0f, 1.0f);
    }

    public float Mix {
        get => Wet;
        set {
            value = Math.Clamp(value, 0.0f, 1.0f);
            Wet = value;
            Dry = 1 - value;
        }
    }

    public float Process(float sample, int channel) {
        if (!Enabled)
            return sample;
        float processedSample = OnProcess(sample, channel);
        float mixedSample = MixSample(processedSample, sample);
        return Math.Clamp(mixedSample, -1.0f, 1.0f);
    }

    public void Init(EffectContext context) => OnInit(context);

    protected virtual void OnInit(EffectContext context) { }
    public abstract float OnProcess(float sample, int channel);
    public virtual float MixSample(float processedSample, float originalSample) => (processedSample * Wet) + (originalSample * Dry);
}
