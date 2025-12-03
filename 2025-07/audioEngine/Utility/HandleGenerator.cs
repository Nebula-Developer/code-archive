
namespace AudioEngine.Utility;

public static class HandleGenerator {
    private static int _nextHandle = 0;

    public static int Next() => ++_nextHandle;
}
