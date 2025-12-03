using SFML.System;

namespace Prisms;

public static class Time {
    public static float DeltaTime { get; private set; }
    private static Clock deltaClock = new();

    public static void Update() => DeltaTime = deltaClock.Restart().AsSeconds();
}