using System.Collections.Immutable;
using System.Numerics;

using SkiaSharp;

namespace engine.Framework.Graphics;

// extension class to add SKMatrix * SKMatrix operator
public static class MatrixExtensions {
    public static SKMatrix Multiply(this SKMatrix left, SKMatrix right) => left.PostConcat(right);
    public static Matrix Let(this SKMatrix self, Matrix ret) => ret;
}

public class Matrix {
    private SKMatrix _matrix;
    public SKMatrix SKMatrix => _matrix;

    public Matrix(SKMatrix matrix) => _matrix = matrix;
    public Matrix() => _matrix = SKMatrix.CreateIdentity();

    public static implicit operator SKMatrix(Matrix matrix) => matrix._matrix;
    public static implicit operator Matrix(SKMatrix matrix) => new(matrix);

    public static Matrix operator *(Matrix left, Matrix right) => left._matrix.PostConcat(right._matrix).Let(left);
    public static Matrix operator *(Matrix left, SKMatrix right) => left._matrix.PostConcat(right).Let(left);

    public void Reset() => _matrix = SKMatrix.CreateIdentity();

    public Matrix Rotate(float degrees) => (_matrix = _matrix.Multiply(SKMatrix.CreateRotationDegrees(degrees))).Let(this);
    public Matrix Rotate(float degrees, float x, float y) => (_matrix = _matrix.Multiply(SKMatrix.CreateRotationDegrees(degrees, x, y))).Let(this);
    public Matrix Translate(float x, float y) => (_matrix = _matrix.Multiply(SKMatrix.CreateTranslation(x, y))).Let(this);

    public Matrix Scale(float x, float y) => (_matrix = _matrix.Multiply(SKMatrix.CreateScale(x, y))).Let(this);
    public Matrix Scale(float x, float y, float px, float py) => (_matrix = _matrix.Multiply(SKMatrix.CreateScale(x, y, px, py))).Let(this);
    public Matrix Skew(float x, float y) => (_matrix = _matrix.Multiply(SKMatrix.CreateSkew(x, y))).Let(this);

    public Matrix Concat(Matrix matrix) => (_matrix = _matrix.PostConcat(matrix._matrix)).Let(this);
    public Matrix PreConcat(Matrix matrix) => (_matrix = _matrix.PreConcat(matrix._matrix)).Let(this);
    public Matrix Set(Matrix matrix) => (_matrix = matrix._matrix).Let(this);

    public SKPoint MapPoint(SKPoint point) => _matrix.MapPoint(point);
    public SKRect MapRect(SKRect rect) => _matrix.MapRect(rect);
    public SKPoint[] MapPoints(params SKPoint[] points) => _matrix.MapPoints(points);
    
    public Matrix Copy() => new(_matrix);
}


public static class Vector2Extensions {
    public static SKPoint ToSKPoint(this Vector2 vector) => new SKPoint(vector.X, vector.Y);
    public static Vector2 ToVector2(this SKPoint point) => new Vector2(point.X, point.Y);

    public static SKPoint[] ToSKPoints(this Vector2[] vectors) => vectors.Select(v => v.ToSKPoint()).ToArray();
    public static Vector2[] ToVector2s(this SKPoint[] points) => points.Select(p => p.ToVector2()).ToArray();
}
