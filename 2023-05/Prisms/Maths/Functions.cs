
namespace Prisms;

public static class Maths {
    public static float Lerp(float a, float b, float t) => a + (b - a) * t;
    public static float Clamp(float value, float min, float max) => value < min ? min : value > max ? max : value;
    public static float Clamp01(float value) => Clamp(value, 0, 1);
    public static float Clamp11(float value) => Clamp(value, -1, 1);
}
