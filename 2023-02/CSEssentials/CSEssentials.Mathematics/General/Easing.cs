using System;

namespace CSEssentials.Mathematics.General;

public partial class EMath {
    /// <summary>
    /// An enum containing all easing types available.
    /// </summary>
    public enum EaseType {
        Linear,
        InQuad, OutQuad, InOutQuad,
        InCubic, OutCubic, InOutCubic,
        InQuart, OutQuart, InOutQuart,
        InQuint, OutQuint, InOutQuint,
        InSine, OutSine, InOutSine,
        InExpo, OutExpo, InOutExpo,
        InCirc, OutCirc, InOutCirc,
        InBack, OutBack, InOutBack,
        InElastic, OutElastic, InOutElastic,
        InBounce, OutBounce, InOutBounce
    }

    /// <summary>
    /// A class containing easing functions.
    /// </summary>
    public static class Easing {
        /// <summary>
        /// Interpolates between two values using a specified easing function.
        /// </summary>
        /// <param name="a">The first value.</param>
        /// <param name="b">The second value.</param>
        /// <param name="t">The interpolation value.</param>
        /// <param name="easeType">The easing function to use.</param>
        /// <returns>The interpolated value.</returns>
        public static float Ease(float a, float b, float t, EaseType easeType = EaseType.InOutSine) => (float)(a + (b - a) * GetEase(t, easeType));

        /// <summary>
        /// Interpolates between two values using a specified easing function.
        /// </summary>
        /// <param name="a">The first value.</param>
        /// <param name="b">The second value.</param>
        /// <param name="t">The interpolation value.</param>
        /// <param name="easeType">The easing function to use.</param>
        /// <returns>The interpolated value.</returns>
        public static double Ease(double a, double b, double t, EaseType easeType = EaseType.InOutSine) => a + (b - a) * GetEase(t, easeType);

        public static double GetEase(double t, EaseType easeType) {
            return easeType switch {
                EaseType.Linear => t,
                EaseType.InQuad => t * t,
                EaseType.OutQuad => t * (2 - t),
                EaseType.InOutQuad => t < 0.5f ? 2 * t * t : -1 + (4 - 2 * t) * t,
                EaseType.InCubic => t * t * t,
                EaseType.OutCubic => (--t) * t * t + 1,
                EaseType.InOutCubic => t < 0.5f ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
                EaseType.InQuart => t * t * t * t,
                EaseType.OutQuart => 1 - (--t) * t * t * t,
                EaseType.InOutQuart => t < 0.5f ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
                EaseType.InQuint => t * t * t * t * t,
                EaseType.OutQuint => 1 + (--t) * t * t * t * t,
                EaseType.InOutQuint => t < 0.5f ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
                EaseType.InSine => 1 - Math.Cos(t * Math.PI / 2),
                EaseType.OutSine => Math.Sin(t * Math.PI / 2),
                EaseType.InOutSine => -Math.Cos(Math.PI * t) / 2 + 0.5f,
                EaseType.InExpo => Math.Pow(2, 10 * (t - 1)),
                EaseType.OutExpo => 1 - Math.Pow(2, -10 * t),
                EaseType.InOutExpo => t < 0.5f ? Math.Pow(2, 20 * t - 10) / 2 : (2 - Math.Pow(2, -20 * t + 10)) / 2,
                EaseType.InCirc => 1 - Math.Sqrt(1 - t * t),
                EaseType.OutCirc => Math.Sqrt(1 - (--t) * t),
                EaseType.InOutCirc => t < 0.5f ? (1 - Math.Sqrt(1 - 4 * t * t)) / 2 : (Math.Sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2,
                EaseType.InBack => 4 * t * t * t - 3 * t * t,
                EaseType.OutBack => 1 + 4 * (--t) * t * t + 3 * t * t,
                EaseType.InOutBack => t < 0.5f ? 4 * t * t * t - 3 * t * t : 1 + 4 * (--t) * t * t + 3 * t * t,
                EaseType.InElastic => Math.Pow(2, 10 * (t - 1)) * Math.Sin((t - 1.1f) * 5 * Math.PI),
                EaseType.OutElastic => 1 - Math.Pow(2, -10 * t) * Math.Cos(t * 5 * Math.PI + 0.5f),
                EaseType.InOutElastic => t < 0.5f ? Math.Pow(2, 20 * t - 10) * Math.Sin((20 * t - 11.125f) * Math.PI / 4) / 2 : (2 - Math.Pow(2, -20 * t + 10) * Math.Sin((20 * t - 11.125f) * Math.PI / 4)) / 2,
                EaseType.InBounce => Bounce(t),
                EaseType.OutBounce => 1 - Bounce(1 - t),
                EaseType.InOutBounce => t < 0.5f ? Bounce(2 * t) / 2 : 1 - Bounce(2 - 2 * t) / 2,
                _ => throw new ArgumentOutOfRangeException(nameof(easeType), easeType, null)
            };
        }

        private static double Bounce(double t) {
            if (t < 4 / 11f) {
                return (121 * t * t) / 16;
            }
            if (t < 8 / 11f) {
                return (363 / 40 * t * t) - (99 / 10 * t) + 17 / 5;
            }
            if (t < 9 / 10f) {
                return (4356 / 361 * t * t) - (35442 / 1805 * t) + 16061 / 1805;
            }
            return (5 / 5 * t * t) - (513 / 25 * t) + 268 / 25;
        }
    }
}
