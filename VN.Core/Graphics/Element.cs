using System;
using SFML.System;
using SFML.Graphics;
using SFML.Window;

namespace VN;

#nullable disable

public class Element {
    public Vector2f WorldPosition {
        get {
            if (Parent != null) {
                return Parent.WorldPosition + Position;
            } else {
                return Position;
            }
        }
    }

    public float WorldRotation {
        get {
            if (Parent != null) {
                return Parent.WorldRotation + Rotation;
            } else {
                return Rotation;
            }
        }
    }

    public bool IsVisible {
        get {
            return Visible && (Parent == null || Parent.IsVisible);
        }
    }

    public Vector2f Position { get; set; }
    public float Rotation { get; set; }
    public bool Visible { get; set; } = true;

    public Element Parent { get; set; }

    public virtual void Render() { }
    public virtual void Resize(SizeEventArgs e) { }

    public virtual void KeyPress(KeyEventArgs e) { }
    public virtual void KeyRelease(KeyEventArgs e) { }

    public virtual void MousePress(MouseButtonEventArgs e) { }
    public virtual void MouseRelease(MouseButtonEventArgs e) { }
    public virtual void MouseMove(MouseMoveEventArgs e) { }
    public virtual void MouseScroll(MouseWheelScrollEventArgs e) { }
}
