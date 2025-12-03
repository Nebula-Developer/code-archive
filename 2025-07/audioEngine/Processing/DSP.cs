
using AudioEngine.Utility;

namespace AudioEngine.Processing;

public abstract class DSP {
    public abstract unsafe void Procedure(int handle, int channel, IntPtr buffer, int length, IntPtr user);

    public int Handle { get; set; }

    public DSP() {
        Handle = HandleGenerator.Next();
    }
}