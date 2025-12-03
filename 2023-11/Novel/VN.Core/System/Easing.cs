namespace VN;

public static class Easing {
    public static float ExpIn(float t) => MathF.Pow(2f, 10f * (t - 1f));
    public static float ExpOut(float t) => 1f - MathF.Pow(2f, -10f * t);
    public static float ExpInOut(float t) => t < 0.5f ? 0.5f * MathF.Pow(2f, 20f * t - 10f) : -0.5f * MathF.Pow(2f, 10f - 20f * t) + 1f;

    public static float CircIn(float t) => 1f - MathF.Sqrt(1f - MathF.Pow(t, 2f));
    public static float CircOut(float t) => MathF.Sqrt(1f - MathF.Pow(t - 1f, 2f));
    public static float CircInOut(float t) => t < 0.5f ? 0.5f * (1f - MathF.Sqrt(1f - MathF.Pow(2f * t, 2f))) : 0.5f * (MathF.Sqrt(1f - MathF.Pow(-2f * t + 2f, 2f)) + 1f);

    public static float QuadIn(float t) => MathF.Pow(t, 2f);
    public static float QuadOut(float t) => 1f - MathF.Pow(1f - t, 2f);
    public static float QuadInOut(float t) => t < 0.5f ? 2f * MathF.Pow(t, 2f) : 1f - MathF.Pow(-2f * t + 2f, 2f) / 2f;

    public static float BounceIn(float t) => 1f - BounceOut(1f - t);
    public static float BounceOut(float t) {
        if (t < 1f / 2.75f) {
            return 7.5625f * t * t;
        } else if (t < 2f / 2.75f) {
            return 7.5625f * (t -= 1.5f / 2.75f) * t + 0.75f;
        } else if (t < 2.5f / 2.75f) {
            return 7.5625f * (t -= 2.25f / 2.75f) * t + 0.9375f;
        } else {
            return 7.5625f * (t -= 2.625f / 2.75f) * t + 0.984375f;
        }
    }
    public static float BounceInOut(float t) => t < 0.5f ? BounceIn(t * 2f) / 2f : BounceOut(t * 2f - 1f) / 2f + 0.5f;

    public static float BackIn(float t) => t * t * (2.70158f * t - 1.70158f);
    public static float BackOut(float t) => 1f - BackIn(1f - t);
    public static float BackInOut(float t) => t < 0.5f ? BackIn(t * 2f) / 2f : BackOut(t * 2f - 1f) / 2f + 0.5f;

    public static float ElasticIn(float t) => MathF.Sin(13f * MathF.PI / 2f * t) * MathF.Pow(2f, 10f * (t - 1f));
    public static float ElasticOut(float t) => 1f - ElasticIn(1f - t);
    public static float ElasticInOut(float t) => t < 0.5f ? ElasticIn(t * 2f) / 2f : ElasticOut(t * 2f - 1f) / 2f + 0.5f;

    public static float SineIn(float t) => 1f - MathF.Cos(t * MathF.PI / 2f);
    public static float SineOut(float t) => MathF.Sin(t * MathF.PI / 2f);
    public static float SineInOut(float t) => -0.5f * (MathF.Cos(MathF.PI * t) - 1f);

    public static float CubicIn(float t) => MathF.Pow(t, 3f);
    public static float CubicOut(float t) => 1f - MathF.Pow(1f - t, 3f);
    public static float CubicInOut(float t) => t < 0.5f ? 4f * MathF.Pow(t, 3f) : 1f - MathF.Pow(-2f * t + 2f, 3f) / 2f;

    public static float QuartIn(float t) => MathF.Pow(t, 4f);
    public static float QuartOut(float t) => 1f - MathF.Pow(1f - t, 4f);
    public static float QuartInOut(float t) => t < 0.5f ? 8f * MathF.Pow(t, 4f) : 1f - MathF.Pow(-2f * t + 2f, 4f) / 2f;

    public static float QuintIn(float t) => MathF.Pow(t, 5f);
    public static float QuintOut(float t) => 1f - MathF.Pow(1f - t, 5f);
    public static float QuintInOut(float t) => t < 0.5f ? 16f * MathF.Pow(t, 5f) : 1f - MathF.Pow(-2f * t + 2f, 5f) / 2f;

    public static float Linear(float t) => t;

    public static float SmoothStep(float t) => t * t * (3f - 2f * t);
    public static float SmootherStep(float t) => t * t * t * (t * (t * 6f - 15f) + 10f);
}
