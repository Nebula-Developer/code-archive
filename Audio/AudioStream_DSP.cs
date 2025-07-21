using AudioEngine.Processing;
using AudioEngine.Utility;

using ManagedBass;

namespace AudioEngine.Audio;

public partial class AudioStream {
    protected Dictionary<int, int> DspEffects { get; } = new();

    public void AddDSP(DSP dsp, int priority = 0) {
        int dspHandle = Bass.ChannelSetDSP(Handle, dsp.Procedure, default, priority);
        if (dspHandle == 0)
            Utils.BassFailed("add DSP effect");

        DspEffects[dspHandle] = dsp.Handle;
    }

    public void RemoveDSP(DSP dsp) {
        if (DspEffects.TryGetValue(dsp.Handle, out int dspHandle)) {
            if (!Bass.ChannelRemoveDSP(Handle, dspHandle))
                Utils.BassFailed("remove DSP effect");

            DspEffects.Remove(dsp.Handle);
        } else {
            throw new InvalidOperationException($"DSP with handle {dsp.Handle} not found.");
        }
    }

    public void RemoveDSP(int bassDspHandle) {
        if (DspEffects.ContainsKey(bassDspHandle)) {
            if (!Bass.ChannelRemoveDSP(Handle, bassDspHandle))
                Utils.BassFailed("remove DSP effect");

            DspEffects.Remove(bassDspHandle);
        } else {
            throw new InvalidOperationException($"DSP with handle {bassDspHandle} not found.");
        }
    }
}