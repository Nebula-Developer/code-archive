namespace Landing.Library.Graphics;

public class RGB {
    public byte Red { get; set; }
    public byte Green { get; set; }
    public byte Blue { get; set; }

    public RGB(byte red, byte green, byte blue) {
        Red = red;
        Green = green;
        Blue = blue;
    }

    public string ToBGString() => $"\x1b[48;2;{Red};{Green};{Blue}m";
    public string ToFGString() => $"\x1b[38;2;{Red};{Green};{Blue}m";
}
