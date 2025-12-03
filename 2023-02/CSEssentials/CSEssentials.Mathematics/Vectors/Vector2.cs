using System;
using CSEssentials.Mathematics.General;

namespace CSEssentials.Mathematics.Vectors;

/// <summary>
/// A 2D vector made up of 2 floats (x, y).
/// </summary>
public class Vector2 {
    /// <summary> The x component of the vector. </summary>
    public float x { get; set; }
    /// <summary> The y component of the vector. </summary>
    public float y { get; set; }

    /// <summary>
    /// Creates a new vector with the given x, y, and z components.
    /// </summary>
    /// <param name="X">The x component of the vector.</param>
    /// <param name="Y">The y component of the vector.</param>
    public Vector2(float X, float Y) {
        this.x = X;
        this.y = Y;
    }

    #region Operators
    /// <summary>
    /// Adds two vectors together.
    /// </summary>
    /// <param name="a">The first vector to add.</param>
    /// <param name="b">The second vector to add.</param>
    /// <returns>The sum of the two vectors.</returns>
    public static Vector2 operator +(Vector2 a, Vector2 b) => new Vector2(a.x + b.x, a.y + b.y);

    /// <summary>
    /// Subtracts two vectors.
    /// </summary>
    /// <param name="a">The vector to subtract from.</param>
    /// <param name="b">The vector to subtract.</param>
    /// <returns>The difference of the two vectors.</returns>
    public static Vector2 operator -(Vector2 a, Vector2 b) => new Vector2(a.x - b.x, a.y - b.y);

    /// <summary>
    /// Multiplies two vectors together.
    /// </summary>
    /// <param name="a">The first vector to multiply.</param>
    /// <param name="b">The second vector to multiply.</param>
    /// <returns>The product of the two vectors.</returns>
    public static Vector2 operator *(Vector2 a, Vector2 b) => new Vector2(a.x * b.x, a.y * b.y);

    /// <summary>
    /// Divides two vectors.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The vector to divide by.</param>
    /// <returns>The quotient of the two vectors.</returns>
    public static Vector2 operator /(Vector2 a, Vector2 b) => new Vector2(a.x / b.x, a.y / b.y);

    /// <summary>
    /// Multiplies a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to multiply.</param>
    /// <param name="b">The scalar to multiply by.</param>
    /// <returns>The product of the vector and the scalar.</returns>
    public static Vector2 operator *(Vector2 a, float b) => new Vector2(a.x * b, a.y * b);

    /// <summary>
    /// Divides a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The scalar to divide by.</param>
    /// <returns>The quotient of the vector and the scalar.</returns>
    public static Vector2 operator /(Vector2 a, float b) => new Vector2(a.x / b, a.y / b);

    /// <summary>
    /// Checks if two vectors are equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are equal, false otherwise.</returns>
    public static bool operator ==(Vector2 a, Vector2 b) => a.x == b.x && a.y == b.y;

    /// <summary>
    /// Checks if two vectors are not equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are not equal, false otherwise.</returns>
    public static bool operator !=(Vector2 a, Vector2 b) => a.x != b.x || a.y != b.y;

    /// <summary>
    /// Checks if this vector is equal to another object.
    /// </summary>
    /// <param name="obj">The object to check.</param>
    /// <returns>True if the object is a vector and is equal to this vector, false otherwise.</returns>
    public override bool Equals(object? obj) => obj is Vector2 vector && this == vector;

    /// <summary>
    /// Gets the hash code for this vector.
    /// </summary>
    /// <returns>The hash code for this vector.</returns>
    public override int GetHashCode() => HashCode.Combine(this.x, this.y);
    #endregion

    #region Methods
    /// <summary>
    /// Gets the magnitude of the vector.
    /// </summary>
    /// <returns>The magnitude of the vector.</returns>
    public float Magnitude() => (float)Math.Sqrt(this.x * this.x + this.y * this.y);

    /// <summary>
    /// Gets the squared magnitude of the vector.
    /// </summary>
    /// <returns>The squared magnitude of the vector.</returns>
    public float SqrMagnitude() => this.x * this.x + this.y * this.y;

    /// <summary>
    /// Normalizes the vector.
    /// </summary>
    /// <returns>The normalized vector.</returns>
    public Vector2 Normalize() {
        float magnitude = this.Magnitude();
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    /// <summary>
    /// Gets the distance between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The distance between the two vectors.</returns>
    public static float Distance(Vector2 a, Vector2 b) => (a - b).Magnitude();

    /// <summary>
    /// Gets the dot product of two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The dot product of the two vectors.</returns>
    public static float Dot(Vector2 a, Vector2 b) => a.x * b.x + a.y * b.y;

    /// <summary>
    /// Gets the angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float Angle(Vector2 a, Vector2 b) => (float)Math.Acos(Dot(a, b) / (a.Magnitude() * b.Magnitude()));

    /// <summary>
    /// Gets the signed angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float SignedAngle(Vector2 a, Vector2 b) => (float)Math.Atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);

    /// <summary>
    /// Gets the linear interpolation between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The linear interpolation between the two vectors.</returns>
    public static Vector2 Lerp(Vector2 a, Vector2 b, float t) => a + (b - a) * t;

    /// <summary>
    /// Gets the bezier curve between multiple vectors.
    /// </summary>
    /// <param name="points">The points to interpolate between.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The bezier curve between the vectors.</returns>
    public static Vector2 Bezier(Vector2[] points, float t) {
        Vector2[] newPoints = new Vector2[points.Length - 1];
        for (int i = 0; i < newPoints.Length; i++) {
            newPoints[i] = Lerp(points[i], points[i + 1], t);
        }
        if (newPoints.Length == 1) {
            return newPoints[0];
        }
        return Bezier(newPoints, t);
    }
    #endregion

    public override string ToString() => $"({this.x}, {this.y})";
}

/// <summary>
/// A 2D vector made up of 2 integers (x, y).
/// </summary>
public class Vector2i {
    /// <summary> The x component of the vector. </summary>
    public int x { get; set; }
    /// <summary> The y component of the vector. </summary>
    public int y { get; set; }

    /// <summary>
    /// Creates a new vector with the given x, y, and z components.
    /// </summary>
    /// <param name="X">The x component of the vector.</param>
    /// <param name="Y">The y component of the vector.</param>
    /// <param name="Z">The z component of the vector.</param>
    public Vector2i(int X, int Y) {
        this.x = X;
        this.y = Y;
    }

    #region Operators
    /// <summary>
    /// Adds two vectors together.
    /// </summary>
    /// <param name="a">The first vector to add.</param>
    /// <param name="b">The second vector to add.</param>
    /// <returns>The sum of the two vectors.</returns>
    public static Vector2i operator +(Vector2i a, Vector2i b) => new Vector2i(a.x + b.x, a.y + b.y);

    /// <summary>
    /// Subtracts two vectors.
    /// </summary>
    /// <param name="a">The vector to subtract from.</param>
    /// <param name="b">The vector to subtract.</param>
    /// <returns>The difference of the two vectors.</returns>
    public static Vector2i operator -(Vector2i a, Vector2i b) => new Vector2i(a.x - b.x, a.y - b.y);

    /// <summary>
    /// Multiplies two vectors together.
    /// </summary>
    /// <param name="a">The first vector to multiply.</param>
    /// <param name="b">The second vector to multiply.</param>
    /// <returns>The product of the two vectors.</returns>
    public static Vector2i operator *(Vector2i a, Vector2i b) => new Vector2i(a.x * b.x, a.y * b.y);

    /// <summary>
    /// Divides two vectors.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The vector to divide by.</param>
    /// <returns>The quotient of the two vectors.</returns>
    public static Vector2i operator /(Vector2i a, Vector2i b) => new Vector2i(a.x / b.x, a.y / b.y);

    /// <summary>
    /// Multiplies a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to multiply.</param>
    /// <param name="b">The scalar to multiply by.</param>
    /// <returns>The product of the vector and the scalar.</returns>
    public static Vector2i operator *(Vector2i a, float b) => new Vector2i((int)(a.x * b), (int)(a.y * b));

    /// <summary>
    /// Divides a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The scalar to divide by.</param>
    /// <returns>The quotient of the vector and the scalar.</returns>
    public static Vector2i operator /(Vector2i a, float b) => new Vector2i((int)(a.x / b), (int)(a.y / b));

    /// <summary>
    /// Checks if two vectors are equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are equal, false otherwise.</returns>
    public static bool operator ==(Vector2i a, Vector2i b) => a.x == b.x && a.y == b.y;

    /// <summary>
    /// Checks if two vectors are not equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are not equal, false otherwise.</returns>
    public static bool operator !=(Vector2i a, Vector2i b) => a.x != b.x || a.y != b.y;

    /// <summary>
    /// Checks if this vector is equal to another object.
    /// </summary>
    /// <param name="obj">The object to check.</param>
    /// <returns>True if the object is a vector and is equal to this vector, false otherwise.</returns>
    public override bool Equals(object? obj) => obj is Vector2i vector && this == vector;

    /// <summary>
    /// Gets the hash code for this vector.
    /// </summary>
    /// <returns>The hash code for this vector.</returns>
    public override int GetHashCode() => HashCode.Combine(this.x, this.y);
    #endregion

    #region Methods
    /// <summary>
    /// Gets the magnitude of the vector.
    /// </summary>
    /// <returns>The magnitude of the vector.</returns>
    public float Magnitude() => (float)Math.Sqrt(this.x * this.x + this.y * this.y);

    /// <summary>
    /// Gets the squared magnitude of the vector.
    /// </summary>
    /// <returns>The squared magnitude of the vector.</returns>
    public float SqrMagnitude() => this.x * this.x + this.y * this.y;

    /// <summary>
    /// Normalizes the vector.
    /// </summary>
    /// <returns>The normalized vector.</returns>
    public Vector2i Normalize() {
        float magnitude = this.Magnitude();
        return new Vector2i((int)(this.x / magnitude), (int)(this.y / magnitude));
    }

    /// <summary>
    /// Gets the distance between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The distance between the two vectors.</returns>
    public static float Distance(Vector2i a, Vector2i b) => (a - b).Magnitude();

    /// <summary>
    /// Gets the dot product of two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The dot product of the two vectors.</returns>
    public static float Dot(Vector2i a, Vector2i b) => a.x * b.x + a.y * b.y;

    /// <summary>
    /// Gets the angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float Angle(Vector2i a, Vector2i b) => (float)Math.Acos(Dot(a, b) / (a.Magnitude() * b.Magnitude()));

    /// <summary>
    /// Gets the signed angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float SignedAngle(Vector2i a, Vector2i b) => (float)Math.Atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);

    /// <summary>
    /// Gets the linear interpolation between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The linear interpolation between the two vectors.</returns>
    public static Vector2i Lerp(Vector2i a, Vector2i b, float t) => a + (b - a) * t;

    /// <summary>
    /// Gets the bezier curve between multiple vectors.
    /// </summary>
    /// <param name="points">The points to interpolate between.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The bezier curve between the vectors.</returns>
    public static Vector2i Bezier(Vector2i[] points, float t) {
        Vector2i[] newPoints = new Vector2i[points.Length - 1];
        for (int i = 0; i < newPoints.Length; i++) {
            newPoints[i] = Lerp(points[i], points[i + 1], t);
        }
        if (newPoints.Length == 1) {
            return newPoints[0];
        }
        return Bezier(newPoints, t);
    }
    #endregion

    public override string ToString() => $"({this.x}, {this.y})";
}