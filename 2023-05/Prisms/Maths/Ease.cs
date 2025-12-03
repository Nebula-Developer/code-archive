
namespace Prisms;

public enum EaseType {
    Linear, Smooth, Smoother, Smoothest,
    InQuad, OutQuad, InOutQuad,
    InCubic, OutCubic, InOutCubic,
    InQuart, OutQuart, InOutQuart,
    InQuint, OutQuint, InOutQuint,
    InSine, OutSine, InOutSine,
    InExpo, OutExpo, InOutExpo,
    InCirc, OutCirc, InOutCirc,
    InBack, OutBack, InOutBack,
    InElastic, OutElastic, InOutElastic,
    InBounce, OutBounce, InOutBounce,
    OutPow, InPow, InOutPow,
    OutSinu, InSinu, InOutSinu,
    OutExpo2, InExpo2, InOutExpo2
}

public static class Ease {
    public static float Linear(float t) => t;
    public static float Smooth(float t) => t * t * (3 - 2 * t);
    public static float Smoother(float t) => t * t * t * (t * (t * 6 - 15) + 10);
    public static float Smoothest(float t) => t * t * t * t * (t * (t * (t * -20 + 70) - 84) + 35);
    public static float InQuad(float t) => t * t;
    public static float OutQuad(float t) => t * (2 - t);
    public static float InOutQuad(float t) => t < 0.5 ? 2 * t * t : t * (4 - 2 * t) - 1;
    public static float InCubic(float t) => t * t * t;
    public static float OutCubic(float t) => (--t) * t * t + 1;
    public static float InOutCubic(float t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    public static float InQuart(float t) => t * t * t * t;
    public static float OutQuart(float t) => 1 - (--t) * t * t * t;
    public static float InOutQuart(float t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    public static float InQuint(float t) => t * t * t * t * t;
    public static float OutQuint(float t) => 1 + (--t) * t * t * t * t;
    public static float InOutQuint(float t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    public static float InSine(float t) => 1 - MathF.Cos(t * MathF.PI / 2);
    public static float OutSine(float t) => MathF.Sin(t * MathF.PI / 2);
    public static float InOutSine(float t) => -(MathF.Cos(MathF.PI * t) - 1) / 2;
    public static float InExpo(float t) => t == 0 ? 0 : MathF.Pow(2, 10 * (t - 1));
    public static float OutExpo(float t) => t == 1 ? 1 : 1 - MathF.Pow(2, -10 * t);
    public static float InOutExpo(float t) => t == 0 ? 0 : t == 1 ? 1 : t < 0.5 ? MathF.Pow(2, 20 * t - 10) / 2 : (2 - MathF.Pow(2, -20 * t + 10)) / 2;
    public static float InCirc(float t) => 1 - MathF.Sqrt(1 - t * t);
    public static float OutCirc(float t) => MathF.Sqrt(1 - (--t) * t);
    public static float InOutCirc(float t) => t < 0.5 ? (1 - MathF.Sqrt(1 - 4 * t * t)) / 2 : (MathF.Sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
    public static float InBack(float t) => t * t * (2.70158f * t - 1.70158f);
    public static float OutBack(float t) => 1 + (--t) * t * (2.70158f * t + 1.70158f);
    public static float InOutBack(float t) => t < 0.5 ? t * t * (7 * t - 2.5f) * 2 : 1 + (--t) * t * 2 * (7 * t + 2.5f);
    public static float InElastic(float t) => t == 0 ? 0 : t == 1 ? 1 : -MathF.Pow(2, 10 * t - 10) * MathF.Sin((t * 10 - 10.75f) * (2 * MathF.PI) / 3);
    public static float OutElastic(float t) => t == 0 ? 0 : t == 1 ? 1 : MathF.Pow(2, -10 * t) * MathF.Sin((t * 10 - 0.75f) * (2 * MathF.PI) / 3) + 1;
    public static float InOutElastic(float t) => t == 0 ? 0 : t == 1 ? 1 : t < 0.5 ? -(MathF.Pow(2, 20 * t - 10) * MathF.Sin((20 * t - 11.125f) * (2 * MathF.PI) / 4.5f)) / 2 : (MathF.Pow(2, -20 * t + 10) * MathF.Sin((20 * t - 11.125f) * (2 * MathF.PI) / 4.5f)) / 2 + 1;
    public static float InBounce(float t) => 1 - OutBounce(1 - t);
    public static float OutBounce(float t) => t < 1 / 2.75f ? 7.5625f * t * t : t < 2 / 2.75f ? 7.5625f * (t -= 1.5f / 2.75f) * t + 0.75f : t < 2.5 / 2.75 ? 7.5625f * (t -= 2.25f / 2.75f) * t + 0.9375f : 7.5625f * (t -= 2.625f / 2.75f) * t + 0.984375f;
    public static float InOutBounce(float t) => t < 0.5 ? InBounce(t * 2) / 2 : OutBounce(t * 2 - 1) / 2 + 0.5f;
    public static float InPow(float t, float exp) => MathF.Pow(t, exp);
    public static float OutPow(float t, float exp) => 1 - MathF.Pow(1 - t, exp);
    public static float InOutPow(float t, float exp) => t < 0.5 ? MathF.Pow(t * 2, exp) / 2 : 1 - MathF.Abs(MathF.Pow(t * 2 - 2, exp)) / 2;
    public static float InSinu(float t) => 1 - MathF.Cos(t * MathF.PI / 2);
    public static float OutSinu(float t) => MathF.Sin(t * MathF.PI / 2);
    public static float InOutSinu(float t) => -(MathF.Cos(MathF.PI * t) - 1) / 2;
    public static float InExpo2(float t) => t == 0 ? 0 : MathF.Pow(2, 10 * (t - 1));
    public static float OutExpo2(float t) => t == 1 ? 1 : 1 - MathF.Pow(2, -10 * t);
    public static float InOutExpo2(float t) => t == 0 ? 0 : t == 1 ? 1 : t < 0.5 ? MathF.Pow(2, 20 * t - 10) / 2 : (2 - MathF.Pow(2, -20 * t + 10)) / 2;


    public static float From(EaseType type, float t) => type switch {
        EaseType.Linear => Linear(t),
        EaseType.Smooth => Smooth(t),
        EaseType.Smoother => Smoother(t),
        EaseType.Smoothest => Smoothest(t),
        EaseType.InQuad => InQuad(t),
        EaseType.OutQuad => OutQuad(t),
        EaseType.InOutQuad => InOutQuad(t),
        EaseType.InCubic => InCubic(t),
        EaseType.OutCubic => OutCubic(t),
        EaseType.InOutCubic => InOutCubic(t),
        EaseType.InQuart => InQuart(t),
        EaseType.OutQuart => OutQuart(t),
        EaseType.InOutQuart => InOutQuart(t),
        EaseType.InQuint => InQuint(t),
        EaseType.OutQuint => OutQuint(t),
        EaseType.InOutQuint => InOutQuint(t),
        EaseType.InSine => InSine(t),
        EaseType.OutSine => OutSine(t),
        EaseType.InOutSine => InOutSine(t),
        EaseType.InExpo => InExpo(t),
        EaseType.OutExpo => OutExpo(t),
        EaseType.InOutExpo => InOutExpo(t),
        EaseType.InCirc => InCirc(t),
        EaseType.OutCirc => OutCirc(t),
        EaseType.InOutCirc => InOutCirc(t),
        EaseType.InBack => InBack(t),
        EaseType.OutBack => OutBack(t),
        EaseType.InOutBack => InOutBack(t),
        EaseType.InElastic => InElastic(t),
        EaseType.OutElastic => OutElastic(t),
        EaseType.InOutElastic => InOutElastic(t),
        EaseType.InBounce => InBounce(t),
        EaseType.OutBounce => OutBounce(t),
        EaseType.InOutBounce => InOutBounce(t),
        EaseType.InPow => InPow(t, 2),
        EaseType.OutPow => OutPow(t, 2),
        EaseType.InOutPow => InOutPow(t, 2),
        EaseType.InSinu => InSinu(t),
        EaseType.OutSinu => OutSinu(t),
        EaseType.InOutSinu => InOutSinu(t),
        EaseType.InExpo2 => InExpo2(t),
        EaseType.OutExpo2 => OutExpo2(t),
        EaseType.InOutExpo2 => InOutExpo2(t),
        _ => throw new ArgumentException("Invalid ease type")
    };
}
