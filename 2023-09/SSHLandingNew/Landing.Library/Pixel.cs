namespace Landing.Library.Graphics;

public class Pixel {
    public char Character { get; set; }
    public RGB BG { get; set; }
    public RGB FG { get; set; }

    public Pixel() {
        Character = ' ';
        BG = new RGB(0, 0, 0);
        FG = new RGB(0, 0, 0);
    }

    public Pixel(char character, RGB? bg = null, RGB? fg = null) {
        Character = character;
        BG = bg ?? new RGB(0, 0, 0);
        FG = fg ?? new RGB(0, 0, 0);
    }

    public override string ToString() => $"{BG.ToBGString()}{FG.ToFGString()}{Character}\x1b[0m";
    public string ToNoCancelString() => $"{BG.ToBGString()}{FG.ToFGString()}{Character}";
}
