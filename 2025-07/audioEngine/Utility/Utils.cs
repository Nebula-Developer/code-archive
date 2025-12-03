using ManagedBass;

namespace AudioEngine.Utility;

public static class Utils {
    public static unsafe Span<float> BufferSpan(IntPtr buffer, int length) => new Span<float>(buffer.ToPointer(), length / sizeof(float));

    public static void BassFailed(string toDo, params Errors[] ignore) {
        var error = Bass.LastError;

        if (ignore.Length > 0 && ignore.Contains(error))
            return;

        if (error != ManagedBass.Errors.OK)
            throw new InvalidOperationException($"Failed to {toDo}: {error}");

        throw new InvalidOperationException($"Failed to {toDo} with no error reported.");
    }
}