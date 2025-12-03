using System;

namespace CSEssentials.Mathematics.Vectors;

/// <summary>
/// A 3D vector made up of 3 floats (x, y, z).
/// </summary>
public class Vector3 {
    /// <summary> The x component of the vector. </summary>
    public float x { get; set; }
    /// <summary> The y component of the vector. </summary>
    public float y { get; set; }
    /// <summary> The z component of the vector. </summary>
    public float z { get; set; }

    /// <summary>
    /// Creates a new vector with the given x, y, and z components.
    /// </summary>
    /// <param name="X">The x component of the vector.</param>
    /// <param name="Y">The y component of the vector.</param>
    /// <param name="Z">The z component of the vector.</param>
    public Vector3(float X, float Y, float Z) {
        this.x = X;
        this.y = Y;
        this.z = Z;
    }

    #region Operators
    /// <summary>
    /// Adds two vectors together.
    /// </summary>
    /// <param name="a">The first vector to add.</param>
    /// <param name="b">The second vector to add.</param>
    /// <returns>The sum of the two vectors.</returns>
    public static Vector3 operator +(Vector3 a, Vector3 b) => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);

    /// <summary>
    /// Subtracts two vectors.
    /// </summary>
    /// <param name="a">The vector to subtract from.</param>
    /// <param name="b">The vector to subtract.</param>
    /// <returns>The difference of the two vectors.</returns>
    public static Vector3 operator -(Vector3 a, Vector3 b) => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);

    /// <summary>
    /// Multiplies two vectors together.
    /// </summary>
    /// <param name="a">The first vector to multiply.</param>
    /// <param name="b">The second vector to multiply.</param>
    /// <returns>The product of the two vectors.</returns>
    public static Vector3 operator *(Vector3 a, Vector3 b) => new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);

    /// <summary>
    /// Divides two vectors.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The vector to divide by.</param>
    /// <returns>The quotient of the two vectors.</returns>
    public static Vector3 operator /(Vector3 a, Vector3 b) => new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);

    /// <summary>
    /// Multiplies a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to multiply.</param>
    /// <param name="b">The scalar to multiply by.</param>
    /// <returns>The product of the vector and the scalar.</returns>
    public static Vector3 operator *(Vector3 a, float b) => new Vector3(a.x * b, a.y * b, a.z * b);

    /// <summary>
    /// Divides a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The scalar to divide by.</param>
    /// <returns>The quotient of the vector and the scalar.</returns>
    public static Vector3 operator /(Vector3 a, float b) => new Vector3(a.x / b, a.y / b, a.z / b);

    /// <summary>
    /// Checks if two vectors are equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are equal, false otherwise.</returns>
    public static bool operator ==(Vector3 a, Vector3 b) => a.x == b.x && a.y == b.y && a.z == b.z;

    /// <summary>
    /// Checks if two vectors are not equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are not equal, false otherwise.</returns>
    public static bool operator !=(Vector3 a, Vector3 b) => a.x != b.x || a.y != b.y || a.z != b.z;

    /// <summary>
    /// Checks if this vector is equal to another object.
    /// </summary>
    /// <param name="obj">The object to check.</param>
    /// <returns>True if the object is a vector and is equal to this vector, false otherwise.</returns>
    public override bool Equals(object? obj) => obj is Vector3 vector && this == vector;

    /// <summary>
    /// Gets the hash code for this vector.
    /// </summary>
    /// <returns>The hash code for this vector.</returns>
    public override int GetHashCode() => HashCode.Combine(this.x, this.y, this.z);
    #endregion

    #region Methods
    /// <summary>
    /// Gets the magnitude of the vector.
    /// </summary>
    /// <returns>The magnitude of the vector.</returns>
    public float Magnitude() => (float)Math.Sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    /// <summary>
    /// Gets the squared magnitude of the vector.
    /// </summary>
    /// <returns>The squared magnitude of the vector.</returns>
    public float SqrMagnitude() => this.x * this.x + this.y * this.y + this.z * this.z;

    /// <summary>
    /// Normalizes the vector.
    /// </summary>
    /// <returns>The normalized vector.</returns>
    public Vector3 Normalize() {
        float magnitude = this.Magnitude();
        return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }

    /// <summary>
    /// Gets the distance between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The distance between the two vectors.</returns>
    public static float Distance(Vector3 a, Vector3 b) => (a - b).Magnitude();

    /// <summary>
    /// Gets the dot product of two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The dot product of the two vectors.</returns>
    public static float Dot(Vector3 a, Vector3 b) => a.x * b.x + a.y * b.y + a.z * b.z;

    /// <summary>
    /// Gets the angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float Angle(Vector3 a, Vector3 b) => (float)Math.Acos(Dot(a, b) / (a.Magnitude() * b.Magnitude()));

    /// <summary>
    /// Gets the signed angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float SignedAngle(Vector3 a, Vector3 b) => (float)Math.Atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);

    /// <summary>
    /// Gets the linear interpolation between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The linear interpolation between the two vectors.</returns>
    public static Vector3 Lerp(Vector3 a, Vector3 b, float t) => a + (b - a) * t;

    /// <summary>
    /// Gets the bezier curve between multiple vectors.
    /// </summary>
    /// <param name="points">The points to interpolate between.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The bezier curve between the vectors.</returns>
    public static Vector3 Bezier(Vector3[] points, float t) {
        Vector3[] newPoints = new Vector3[points.Length - 1];
        for (int i = 0; i < newPoints.Length; i++) {
            newPoints[i] = Lerp(points[i], points[i + 1], t);
        }
        if (newPoints.Length == 1) {
            return newPoints[0];
        }
        return Bezier(newPoints, t);
    }
    #endregion

    public override string ToString() => $"({this.x}, {this.y}, {this.z})";
}

/// <summary>
/// A 3D vector made up of 3 integers (x, y, z).
/// </summary>
public class Vector3i {
    /// <summary> The x component of the vector. </summary>
    public int x { get; set; }
    /// <summary> The y component of the vector. </summary>
    public int y { get; set; }
    /// <summary> The z component of the vector. </summary>
    public int z { get; set; }

    /// <summary>
    /// Creates a new vector with the given x, y, and z components.
    /// </summary>
    /// <param name="X">The x component of the vector.</param>
    /// <param name="Y">The y component of the vector.</param>
    /// <param name="Z">The z component of the vector.</param>
    public Vector3i(int X, int Y, int Z) {
        this.x = X;
        this.y = Y;
        this.z = Z;
    }

    #region Operators
    /// <summary>
    /// Adds two vectors together.
    /// </summary>
    /// <param name="a">The first vector to add.</param>
    /// <param name="b">The second vector to add.</param>
    /// <returns>The sum of the two vectors.</returns>
    public static Vector3i operator +(Vector3i a, Vector3i b) => new Vector3i(a.x + b.x, a.y + b.y, a.z + b.z);

    /// <summary>
    /// Subtracts two vectors.
    /// </summary>
    /// <param name="a">The vector to subtract from.</param>
    /// <param name="b">The vector to subtract.</param>
    /// <returns>The difference of the two vectors.</returns>
    public static Vector3i operator -(Vector3i a, Vector3i b) => new Vector3i(a.x - b.x, a.y - b.y, a.z - b.z);

    /// <summary>
    /// Multiplies two vectors together.
    /// </summary>
    /// <param name="a">The first vector to multiply.</param>
    /// <param name="b">The second vector to multiply.</param>
    /// <returns>The product of the two vectors.</returns>
    public static Vector3i operator *(Vector3i a, Vector3i b) => new Vector3i(a.x * b.x, a.y * b.y, a.z * b.z);

    /// <summary>
    /// Divides two vectors.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The vector to divide by.</param>
    /// <returns>The quotient of the two vectors.</returns>
    public static Vector3i operator /(Vector3i a, Vector3i b) => new Vector3i(a.x / b.x, a.y / b.y, a.z / b.z);

    /// <summary>
    /// Multiplies a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to multiply.</param>
    /// <param name="b">The scalar to multiply by.</param>
    /// <returns>The product of the vector and the scalar.</returns>
    public static Vector3i operator *(Vector3i a, float b) => new Vector3i((int)(a.x * b), (int)(a.y * b), (int)(a.z * b));

    /// <summary>
    /// Divides a vector by a scalar.
    /// </summary>
    /// <param name="a">The vector to divide.</param>
    /// <param name="b">The scalar to divide by.</param>
    /// <returns>The quotient of the vector and the scalar.</returns>
    public static Vector3i operator /(Vector3i a, float b) => new Vector3i((int)(a.x / b), (int)(a.y / b), (int)(a.z / b));

    /// <summary>
    /// Checks if two vectors are equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are equal, false otherwise.</returns>
    public static bool operator ==(Vector3i a, Vector3i b) => a.x == b.x && a.y == b.y && a.z == b.z;

    /// <summary>
    /// Checks if two vectors are not equal.
    /// </summary>
    /// <param name="a">The first vector to check.</param>
    /// <param name="b">The second vector to check.</param>
    /// <returns>True if the vectors are not equal, false otherwise.</returns>
    public static bool operator !=(Vector3i a, Vector3i b) => a.x != b.x || a.y != b.y || a.z != b.z;

    /// <summary>
    /// Checks if this vector is equal to another object.
    /// </summary>
    /// <param name="obj">The object to check.</param>
    /// <returns>True if the object is a vector and is equal to this vector, false otherwise.</returns>
    public override bool Equals(object? obj) => obj is Vector3i vector && this == vector;

    /// <summary>
    /// Gets the hash code for this vector.
    /// </summary>
    /// <returns>The hash code for this vector.</returns>
    public override int GetHashCode() => HashCode.Combine(this.x, this.y, this.z);
    #endregion

    #region Methods
    /// <summary>
    /// Gets the magnitude of the vector.
    /// </summary>
    /// <returns>The magnitude of the vector.</returns>
    public float Magnitude() => (float)Math.Sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    /// <summary>
    /// Gets the squared magnitude of the vector.
    /// </summary>
    /// <returns>The squared magnitude of the vector.</returns>
    public float SqrMagnitude() => this.x * this.x + this.y * this.y + this.z * this.z;

    /// <summary>
    /// Normalizes the vector.
    /// </summary>
    /// <returns>The normalized vector.</returns>
    public Vector3i Normalize() {
        float magnitude = this.Magnitude();
        return new Vector3i((int)(this.x / magnitude), (int)(this.y / magnitude), (int)(this.z / magnitude));
    }

    /// <summary>
    /// Gets the distance between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The distance between the two vectors.</returns>
    public static float Distance(Vector3i a, Vector3i b) => (a - b).Magnitude();

    /// <summary>
    /// Gets the dot product of two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The dot product of the two vectors.</returns>
    public static float Dot(Vector3i a, Vector3i b) => a.x * b.x + a.y * b.y + a.z * b.z;

    /// <summary>
    /// Gets the angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float Angle(Vector3i a, Vector3i b) => (float)Math.Acos(Dot(a, b) / (a.Magnitude() * b.Magnitude()));

    /// <summary>
    /// Gets the signed angle between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <returns>The angle between the two vectors.</returns>
    public static float SignedAngle(Vector3i a, Vector3i b) => (float)Math.Atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);

    /// <summary>
    /// Gets the linear interpolation between two vectors.
    /// </summary>
    /// <param name="a">The first vector.</param>
    /// <param name="b">The second vector.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The linear interpolation between the two vectors.</returns>
    public static Vector3i Lerp(Vector3i a, Vector3i b, float t) => a + (b - a) * t;

    /// <summary>
    /// Gets the bezier curve between multiple vectors.
    /// </summary>
    /// <param name="points">The points to interpolate between.</param>
    /// <param name="t">The interpolation value.</param>
    /// <returns>The bezier curve between the vectors.</returns>
    public static Vector3i Bezier(Vector3i[] points, float t) {
        Vector3i[] newPoints = new Vector3i[points.Length - 1];
        for (int i = 0; i < newPoints.Length; i++) {
            newPoints[i] = Lerp(points[i], points[i + 1], t);
        }
        if (newPoints.Length == 1) {
            return newPoints[0];
        }
        return Bezier(newPoints, t);
    }
    #endregion

    public override string ToString() => $"({this.x}, {this.y}, {this.z})";
}