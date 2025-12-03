namespace NexusPort.Graphics;

public class BoxElement : Element {
    public Pixel BG { get; set; }
    public Pixel Outline { get; set; }

    public int Width { get; set; }
    public int Height { get; set; }

    public BoxElement(int x, int y, int width, int height, Pixel bg, Pixel outline) : base(x, y) {
        BG = bg;
        Outline = outline;
        Width = width;
        Height = height;
    }

    public override void Apply(ref PixelMap map) {
        map.ModifyRange(X, Y, X + Width, Y + Height, BG);
        map.ModifyRingRange(X, Y, X + Width - 1, Y + Height - 1, Outline);
    }
}
