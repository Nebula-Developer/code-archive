namespace Landing.Library.Graphics;

public class LineElement : Element {
    public DependentInt x2 { get; set; }
    public DependentInt y2 { get; set; }
    public Pixel Pixel { get; set; }
    public LineElement(DependentInt x, DependentInt y, DependentInt x2, DependentInt y2, Pixel? p = null) : base(x, y) {
        this.x2 = x2;
        this.y2 = y2;
        Pixel = p ?? new Pixel();
    }

    public override void Draw(ref PixelMap map) {
        int dx = x2.Value - X.Value;
        int dy = y2.Value - Y.Value;
        int steps = Math.Max(Math.Abs(dx), Math.Abs(dy));
        float xInc = dx / (float)steps;
        float yInc = dy / (float)steps;
        float x = X.Value;
        float y = Y.Value;
        for (int i = 0; i <= steps; i++) {
            map.SetPixel((int)Math.Round(x), (int)Math.Round(y), Pixel);
            x += xInc;
            y += yInc;
        }
    }
}
