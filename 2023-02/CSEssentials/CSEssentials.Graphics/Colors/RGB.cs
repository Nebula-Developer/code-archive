using System;
using CSEssentials.Mathematics.General;

namespace CSEssentials.Graphics;


/// <summary>
/// A class representing an RGB color model, with values ranging from 0 to 255.
/// </summary>
public class RGB {
    /// <summary> The red value of the color. </summary>
    public int R { get; set; }
    /// <summary> The green value of the color. </summary>
    public int G { get; set; }
    /// <summary> The blue value of the color. </summary>
    public int B { get; set; }

    /// <summary>
    /// Creates a new RGB color with the specified values.
    /// </summary>
    /// <param name="r">The red value of the color.</param>
    /// <param name="g">The green value of the color.</param>
    /// <param name="b">The blue value of the color.</param>
    public RGB(int r, int g, int b) {
        R = r;
        G = g;
        B = b;
    }

    #region Operators
    /// <summary>
    /// Adds two RGB colors together.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The sum of the two colors.</returns>
    public static RGB operator +(RGB a, RGB b) => new RGB(a.R + b.R, a.G + b.G, a.B + b.B);

    /// <summary>
    /// Subtracts one RGB color from another.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The difference of the two colors.</returns>
    public static RGB operator -(RGB a, RGB b) => new RGB(a.R - b.R, a.G - b.G, a.B - b.B);

    /// <summary>
    /// Multiplies two RGB colors together.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The product of the two colors.</returns>
    public static RGB operator *(RGB a, RGB b) => new RGB(a.R * b.R, a.G * b.G, a.B * b.B);

    /// <summary>
    /// Divides one RGB color by another.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The quotient of the two colors.</returns>
    public static RGB operator /(RGB a, RGB b) => new RGB(a.R / b.R, a.G / b.G, a.B / b.B);

    /// <summary>
    /// Multiplies an RGB color by a scalar.
    /// </summary>
    /// <param name="a">The color.</param>
    /// <param name="b">The scalar.</param>
    /// <returns>The product of the color and scalar.</returns>
    public static RGB operator *(RGB a, int b) => new RGB(a.R * b, a.G * b, a.B * b);

    /// <summary>
    /// Divides an RGB color by a scalar.
    /// </summary>
    /// <param name="a">The color.</param>
    /// <param name="b">The scalar.</param>
    /// <returns>The quotient of the color and scalar.</returns>
    public static RGB operator /(RGB a, int b) => new RGB(a.R / b, a.G / b, a.B / b);

    /// <summary>
    /// Checks if two RGB colors are equal.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>True if the colors are equal, false otherwise.</returns>
    public static bool operator ==(RGB a, RGB b) => a.R == b.R && a.G == b.G && a.B == b.B;

    /// <summary>
    /// Checks if two RGB colors are not equal.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>True if the colors are not equal, false otherwise.</returns>
    public static bool operator !=(RGB a, RGB b) => !(a == b);

    /// <summary>
    /// Checks if an RGB color is equal to another object.
    /// </summary>
    /// <param name="obj">The object to compare to.</param>
    /// <returns>True if the object is an RGB color and is equal to this color, false otherwise.</returns>
    public override bool Equals(object? obj) => obj is RGB rgb && this == rgb;

    /// <summary>
    /// Gets the hash code of this RGB color.
    /// </summary>
    /// <returns>The hash code.</returns>
    public override int GetHashCode() => HashCode.Combine(R, G, B);
    #endregion

    #region Functions
    /// <summary>
    /// Converts the RGB color to a hexadecimal string.
    /// </summary>
    /// <returns>The hexadecimal string.</returns>
    public string ToHexStr() => $"#{R:X2}{G:X2}{B:X2}";

    /// <summary>
    /// Converts the RGB color to <see cref="System.Drawing.Color"/>.
    /// </summary>
    /// <returns>The <see cref="System.Drawing.Color"/>.</returns>
    public System.Drawing.Color ToColor() => System.Drawing.Color.FromArgb(R, G, B);

    /// <summary>
    /// Converts the RGB color to a 'true-color' foreground escape sequence.
    /// </summary>
    /// <returns>The escape sequence.</returns>
    public string ToFGEsc() => $"\x1b[38;2;{R};{G};{B}m";

    /// <summary>
    /// Converts the RGB color to a 'true-color' background escape sequence.
    /// </summary>
    /// <returns>The escape sequence.</returns>
    public string ToBGEsc() => $"\x1b[48;2;{R};{G};{B}m";

    /// <summary>
    /// Linearly interpolates between two RGB colors.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The interpolated color.</returns>
    public static RGB Lerp(RGB a, RGB b, float t) => new RGB(
        (int)EMath.Lerp(a.R, b.R, t),
        (int)EMath.Lerp(a.G, b.G, t),
        (int)EMath.Lerp(a.B, b.B, t)
    );

    /// <summary>
    /// Fade this RGB color to another, by a specified amount.
    /// </summary>
    /// <param name="to">The color to fade to.</param>
    /// <param name="amount">The amount to fade by.</param>
    /// <returns>The faded color.</returns>
    public RGB Fade(RGB to, float amount) => Lerp(this, to, amount);
    #endregion

    public override string ToString() => $"({R}, {G}, {B})";
}

/// <summary>
/// A class representing an RGBA color model, with values ranging from 0 to 255.
/// </summary>
public class RGBA {
    /// <summary> The red value of the color. </summary>
    public int R { get; set; }
    /// <summary> The green value of the color. </summary>
    public int G { get; set; }
    /// <summary> The blue value of the color. </summary>
    public int B { get; set; }
    /// <summary> The alpha value of the color. </summary>
    public int A { get; set; }

    /// <summary>
    /// Creates a new RGBA color with the specified values.
    /// </summary>
    /// <param name="r">The red value of the color.</param>
    /// <param name="g">The green value of the color.</param>
    /// <param name="b">The blue value of the color.</param>
    /// <param name="a">The alpha value of the color.</param>
    public RGBA(int r, int g, int b, int a) {
        R = r;
        G = g;
        B = b;
        A = a;
    }

    #region Operators
    /// <summary>
    /// Adds two RGBA colors together.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The sum of the two colors.</returns>
    public static RGBA operator +(RGBA a, RGBA b) => new RGBA(a.R + b.R, a.G + b.G, a.B + b.B, a.A + b.A);

    /// <summary>
    /// Subtracts one RGBA color from another.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The difference of the two colors.</returns>
    public static RGBA operator -(RGBA a, RGBA b) => new RGBA(a.R - b.R, a.G - b.G, a.B - b.B, a.A - b.A);

    /// <summary>
    /// Multiplies two RGBA colors together.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The product of the two colors.</returns>
    public static RGBA operator *(RGBA a, RGBA b) => new RGBA(a.R * b.R, a.G * b.G, a.B * b.B, a.A * b.A);

    /// <summary>
    /// Divides one RGBA color by another.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>The quotient of the two colors.</returns>
    public static RGBA operator /(RGBA a, RGBA b) => new RGBA(a.R / b.R, a.G / b.G, a.B / b.B, a.A / b.A);

    /// <summary>
    /// Multiplies an RGBA color by a scalar.
    /// </summary>
    /// <param name="a">The color.</param>
    /// <param name="b">The scalar.</param>
    /// <returns>The product of the color and scalar.</returns>
    public static RGBA operator *(RGBA a, int b) => new RGBA(a.R * b, a.G * b, a.B * b, a.A * b);

    /// <summary>
    /// Divides an RGBA color by a scalar.
    /// </summary>
    /// <param name="a">The color.</param>
    /// <param name="b">The scalar.</param>
    /// <returns>The quotient of the color and scalar.</returns>
    public static RGBA operator /(RGBA a, int b) => new RGBA(a.R / b, a.G / b, a.B / b, a.A / b);

    /// <summary>
    /// Checks if two RGBA colors are equal.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>True if the colors are equal, false otherwise.</returns>
    public static bool operator ==(RGBA a, RGBA b) => a.R == b.R && a.G == b.G && a.B == b.B && a.A == b.A;

    /// <summary>
    /// Checks if two RGBA colors are not equal.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <returns>True if the colors are not equal, false otherwise.</returns>
    public static bool operator !=(RGBA a, RGBA b) => !(a == b);

    /// <summary>
    /// Checks if an RGBA color is equal to another object.
    /// </summary>
    /// <param name="obj">The object to compare to.</param>
    /// <returns>True if the object is an RGB color and is equal to this color, false otherwise.</returns>
    public override bool Equals(object? obj) => obj is RGBA rgb && this == rgb;

    /// <summary>
    /// Gets the hash code of this RGBA color.
    /// </summary>
    /// <returns>The hash code.</returns>
    public override int GetHashCode() => HashCode.Combine(R, G, B);
    #endregion

    #region Functions
    /// <summary>
    /// Converts the RGBA color to a hexadecimal string.
    /// </summary>
    /// <returns>The hexadecimal string.</returns>
    public string ToHexStr() => $"#{R:X2}{G:X2}{B:X2}";

    /// <summary>
    /// Converts the RGBA color to <see cref="System.Drawing.Color"/>.
    /// </summary>
    /// <returns>The <see cref="System.Drawing.Color"/>.</returns>
    public System.Drawing.Color ToColor() => System.Drawing.Color.FromArgb(A, R, G, B);

    /// <summary>
    /// Converts the (casted) RGB color to a 'true-color' foreground escape sequence.
    /// </summary>
    /// <returns>The escape sequence.</returns>
    public string ToFGEsc() => $"\x1b[38;2;{R};{G};{B}m";

    /// <summary>
    /// Converts the (casted) RGB color to a 'true-color' background escape sequence.
    /// </summary>
    /// <returns>The escape sequence.</returns>
    public string ToBGEsc() => $"\x1b[48;2;{R};{G};{B}m";

    /// <summary>
    /// Linearly interpolates between two RGBA colors.
    /// </summary>
    /// <param name="a">The first color.</param>
    /// <param name="b">The second color.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The interpolated color.</returns>
    public static RGBA Lerp(RGBA a, RGBA b, float t) => new RGBA(
        (int)EMath.Lerp(a.R, b.R, t),
        (int)EMath.Lerp(a.G, b.G, t),
        (int)EMath.Lerp(a.B, b.B, t),
        (int)EMath.Lerp(a.A, b.A, t)
    );

    /// <summary>
    /// Fade this RGBA color to another, by a specified amount.
    /// </summary>
    /// <param name="to">The color to fade to.</param>
    /// <param name="amount">The amount to fade by.</param>
    /// <returns>The faded color.</returns>
    public RGBA Fade(RGBA to, float amount) => Lerp(this, to, amount);
    #endregion

    public override string ToString() => $"({R}, {G}, {B}, {A})";
}
