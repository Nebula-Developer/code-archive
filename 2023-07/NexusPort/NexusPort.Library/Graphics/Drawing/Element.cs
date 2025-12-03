namespace NexusPort.Graphics;

public class Element {
    public int X { get; set; }
    public int Y { get; set; }

    public Element(int x, int y) {
        X = x;
        Y = y;
    }

    public virtual void Apply(ref PixelMap map) { }
}
