using System;
using SFML.System;
using SFML.Graphics;
using SFML.Window;

namespace VN;

public class RectangleElement : Element {
    public RectangleShape Rectangle { get; set; }

    public RectangleElement(Vector2f size) {
        Rectangle = new RectangleShape(size);
    }

    public override void Render() {
        if (IsVisible) {
            Rectangle.Position = WorldPosition;
            Rectangle.Rotation = WorldRotation;
            VisualNovel.Window.Draw(Rectangle);
        }
    }
}
