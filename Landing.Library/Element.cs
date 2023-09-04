namespace Landing.Library.Graphics;

public class Element {
    public DependentInt X { get; set; }
    public DependentInt Y { get; set; }
    
    public Element(DependentInt x, DependentInt y) {
        X = x;
        Y = y;
    }

    public virtual void Draw(ref PixelMap map) { }
}
