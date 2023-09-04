namespace Landing.Library.Graphics;

public class BoxElement : Element {
    public DependentInt x2 { get; set; }
    public DependentInt y2 { get; set; }
    public Pixel? Fill { get; set; }
    public Pixel? Outline { get; set; }
    public bool DoubleSideBorder { get; set; }

    public BoxElement(DependentInt x, DependentInt y, DependentInt x2, DependentInt y2, Pixel? fill = null, Pixel? outline = null, bool doubleSideBorder = false) : base(x, y) {
        this.x2 = x2;
        this.y2 = y2;
        Fill = fill;
        Outline = outline;
        DoubleSideBorder = doubleSideBorder;
    }

    public override void Draw(ref PixelMap map) {
        if (Fill != null) {
            for (int x = X.Value; x <= x2.Value; x++) {
                for (int y = Y.Value; y <= y2.Value; y++) {
                    map.SetPixel(x, y, Fill);
                }
            }
        }
        if (Outline != null) {
            for (int x = X.Value; x <= x2.Value; x++) {
                map.SetPixel(x, Y.Value, Outline);
                map.SetPixel(x, y2.Value, Outline);
            }
            for (int y = Y.Value; y <= y2.Value; y++) {
                map.SetPixel(X.Value, y, Outline);
                map.SetPixel(x2.Value, y, Outline);
                if (DoubleSideBorder) {
                    map.SetPixel(X.Value + 1, y, Outline);
                    map.SetPixel(x2.Value - 1, y, Outline);
                }
            }
        }
    }
}
