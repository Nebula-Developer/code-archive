namespace Landing.Library.Graphics;

public enum TextAlignment {
    Left,
    Center,
    Right
}

public class TextElement : Element {
    public string Text { get; set; }
    public RGB? BG { get; set; }
    public RGB? FB { get; set; }
    public TextAlignment Alignment { get; set; }
    public DependentInt? Width { get; set; }

    public TextElement(DependentInt x, DependentInt y, string text, RGB? background = null, RGB? foreground = null, TextAlignment alignment = TextAlignment.Left, DependentInt? width = null) : base(x, y) {
        Text = text;
        BG = background;
        FB = foreground;
        Alignment = alignment;
        Width = width;
    }

    public override void Draw(ref PixelMap map) {
        int x = X.Value;
        int y = Y.Value;
        if (Alignment == TextAlignment.Center) {
            if (Width != null) {
                x += (Width.Value / 2) - (Text.Length / 2);
            } else {
                x -= Text.Length / 2;
            }
        } else if (Alignment == TextAlignment.Right) {
            if (Width != null) {
                x += Width.Value - Text.Length;
            } else {
                x -= Text.Length;
            }
        }
        foreach (char c in Text) {
            map.SetPixel(x, y, new Pixel(c, FB, BG));
            x++;
        }
    }
}
