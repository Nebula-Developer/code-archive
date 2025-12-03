namespace NexusPort.Graphics;

public class PointElement : Element {
    public Pixel Pixel { get; set; }

    public PointElement(int x, int y, Pixel pixel) : base(x, y) {
        Pixel = pixel;
    }

    public override void Apply(ref PixelMap map) {
        map.SetPixel(0, 0, Pixel);
    }
}
