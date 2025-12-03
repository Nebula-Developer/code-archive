using SFML.Graphics;
using SFML.System;

namespace SFMLE;

public class RectangleElement : TransformableElement {
    public RectangleShape Shape { get; set; }
    public RectangleElement() : base() {
        Shape = new RectangleShape(Size) {
            FillColor = Color.White
        };
    }
    
    public new void Update() {
        base.Update();
        Shape.Position = WorldPosition;
        Shape.Size = Size;
        Shape.Origin = new Vector2f(0, 0);
    }

    public void Draw(RenderTarget target, RenderStates states) {
        target.Draw(Shape, states);
    }
}
