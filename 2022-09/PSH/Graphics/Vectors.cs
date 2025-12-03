using System;

namespace PSH.Graphics {
    public class Vector2 {
        public float X, Y;

        public Vector2(float x, float y) {
            this.X = x;
            this.Y = y;
        }

        public static Vector2 operator +(Vector2 a, Vector2 b) {
            return new Vector2(a.X + b.X, a.Y + b.Y);
        }

        public static Vector2 operator -(Vector2 a, Vector2 b) {
            return new Vector2(a.X - b.X, a.Y - b.Y);
        }

        public static Vector2 operator *(Vector2 a, Vector2 b) {
            return new Vector2(a.X * b.X, a.Y * b.Y);
        }

        public static Vector2 operator /(Vector2 a, Vector2 b) {
            return new Vector2(a.X / b.X, a.Y / b.Y);
        }

        public static Vector2 operator +(Vector2 a, float b) {
            return new Vector2(a.X + b, a.Y + b);
        }

        public static Vector2 operator -(Vector2 a, float b) {
            return new Vector2(a.X - b, a.Y - b);
        }

        public static Vector2 operator *(Vector2 a, float b) {
            return new Vector2(a.X * b, a.Y * b);
        }

        public static Vector2 operator /(Vector2 a, float b) {
            return new Vector2(a.X / b, a.Y / b);
        }

        public static Vector2 operator +(float a, Vector2 b) {
            return new Vector2(a + b.X, a + b.Y);
        }

        public static Vector2 operator -(float a, Vector2 b) {
            return new Vector2(a - b.X, a - b.Y);
        }

        public static Vector2 operator *(float a, Vector2 b) {
            return new Vector2(a * b.X, a * b.Y);
        }

        public static Vector2 operator /(float a, Vector2 b) {
            return new Vector2(a / b.X, a / b.Y);
        }
    }

    public class Vector2i {
        public int X, Y;

        public Vector2i(int x, int y) {
            this.X = x;
            this.Y = y;
        }

        public static Vector2i operator +(Vector2i a, Vector2i b) {
            return new Vector2i(a.X + b.X, a.Y + b.Y);
        }

        public static Vector2i operator -(Vector2i a, Vector2i b) {
            return new Vector2i(a.X - b.X, a.Y - b.Y);
        }

        public static Vector2i operator *(Vector2i a, Vector2i b) {
            return new Vector2i(a.X * b.X, a.Y * b.Y);
        }

        public static Vector2i operator /(Vector2i a, Vector2i b) {
            return new Vector2i(a.X / b.X, a.Y / b.Y);
        }

        public static Vector2i operator +(Vector2i a, int b) {
            return new Vector2i(a.X + b, a.Y + b);
        }

        public static Vector2i operator -(Vector2i a, int b) {
            return new Vector2i(a.X - b, a.Y - b);
        }

        public static Vector2i operator *(Vector2i a, int b) {
            return new Vector2i(a.X * b, a.Y * b);
        }

        public static Vector2i operator /(Vector2i a, int b) {
            return new Vector2i(a.X / b, a.Y / b);
        }

        public static Vector2i operator +(int a, Vector2i b) {
            return new Vector2i(a + b.X, a + b.Y);
        }

        public static Vector2i operator -(int a, Vector2i b) {
            return new Vector2i(a - b.X, a - b.Y);
        }

        public static Vector2i operator *(int a, Vector2i b) {
            return new Vector2i(a * b.X, a * b.Y);
        }

        public static Vector2i operator /(int a, Vector2i b) {
            return new Vector2i(a / b.X, a / b.Y);
        }

        public static implicit operator Vector2(Vector2i a) {
            return new Vector2(a.X, a.Y);
        }

        public static implicit operator Vector2i(Vector2 a) {
            return new Vector2i((int)a.X, (int)a.Y);
        }
    }
}