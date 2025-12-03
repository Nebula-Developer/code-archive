using System;

namespace CSEssentials.Mathematics.General;

public partial class EMath
{
    /// <summary>
    /// Linearly interpolates between two values.
    /// </summary>
    /// <param name="a">The first value.</param>
    /// <param name="b">The second value.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The interpolated value.</returns>
    public static float Lerp(float a, float b, float t) => a + (b - a) * t;

    /// <summary>
    /// Linearly interpolates between two values.
    /// </summary>
    /// <param name="a">The first value.</param>
    /// <param name="b">The second value.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The interpolated value.</returns>
    public static double Lerp(double a, double b, double t) => a + (b - a) * t;
}