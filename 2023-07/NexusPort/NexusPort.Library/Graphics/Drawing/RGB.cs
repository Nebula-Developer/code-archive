namespace NexusPort.Graphics;

public class RGB {
    public int R { get; set; }
    public int G { get; set; }
    public int B { get; set; }

    public RGB(int r, int g, int b) {
        R = r;
        G = g;
        B = b;
    }

    public RGB() {
        R = 0;
        G = 0;
        B = 0;
    }

    public static RGB operator +(RGB a, RGB b) => new RGB(a.R + b.R, a.G + b.G, a.B + b.B);
    public static RGB operator -(RGB a, RGB b) => new RGB(a.R - b.R, a.G - b.G, a.B - b.B);
    public static RGB operator *(RGB a, RGB b) => new RGB(a.R * b.R, a.G * b.G, a.B * b.B);
    public static RGB operator /(RGB a, RGB b) => new RGB(a.R / b.R, a.G / b.G, a.B / b.B);
    public static RGB operator %(RGB a, RGB b) => new RGB(a.R % b.R, a.G % b.G, a.B % b.B);

    public static RGB operator +(RGB a, int b) => new RGB(a.R + b, a.G + b, a.B + b);
    public static RGB operator -(RGB a, int b) => new RGB(a.R - b, a.G - b, a.B - b);
    public static RGB operator *(RGB a, int b) => new RGB(a.R * b, a.G * b, a.B * b);
    public static RGB operator /(RGB a, int b) => new RGB(a.R / b, a.G / b, a.B / b);
    public static RGB operator %(RGB a, int b) => new RGB(a.R % b, a.G % b, a.B % b);

    public static RGB operator +(int a, RGB b) => b + a;
    public static RGB operator -(int a, RGB b) => b - a;
    public static RGB operator *(int a, RGB b) => b * a;
    public static RGB operator /(int a, RGB b) => b / a;
    public static RGB operator %(int a, RGB b) => b % a;

    public string ToBGEsc() => $"\x1b[48;2;{R};{G};{B}m";
    public string ToFGEsc() => $"\x1b[38;2;{R};{G};{B}m";

    public override bool Equals(object? obj) {
        if (obj is RGB rgb) {
            return R == rgb.R && G == rgb.G && B == rgb.B;
        }
        return false;
    }

    public override int GetHashCode() {
        return HashCode.Combine(R, G, B);
    }
}
