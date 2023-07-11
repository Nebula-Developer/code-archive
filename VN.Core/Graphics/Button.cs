using SFML.Graphics;
using SFML.System;
using SFML.Window;

namespace VN;

public enum PressState {
    Normal,
    Hover,
    Pressed
}

public class Button : Element {
    public FloatRect Bounds { get; set; }
    private FloatRect WorldBounds {
        get {
            if (Parent != null) {
                FloatRect pos = new FloatRect(Parent.WorldPosition.X + Bounds.Left, Parent.WorldPosition.Y + Bounds.Top, Bounds.Width, Bounds.Height);
                return pos;
            } else {
                return Bounds;
            }
        }
    }

    public Button(FloatRect bounds) {
        Bounds = bounds;
    }

    public Action? OnHover { get; set; }
    public Action? OnPress { get; set; }
    public Action? OnRelease { get; set; }
    public Action? OnLeave { get; set; }

    public PressState Current { get; set; } = PressState.Normal;

    public bool MouseIntersects(int mouseX, int mouseY) {
        return WorldBounds.Contains(mouseX, mouseY);
    }

    public override void MouseMove(MouseMoveEventArgs e) {
        if (IsVisible) {
            if (Current == PressState.Pressed)
                return;
            
            if (MouseIntersects(e.X, e.Y) && Mouse.IsEligibleForMouseHandle(this)) {
                if (Current == PressState.Normal)
                    OnHover?.Invoke();

                Current = PressState.Hover;
            } else {
                Mouse.Leave(this);

                if (Current == PressState.Hover)
                    OnLeave?.Invoke();
                
                Current = PressState.Normal;
            }
        }
    }

    public override void MousePress(MouseButtonEventArgs e) {
        if (IsVisible) {
            if (MouseIntersects(e.X, e.Y) && Mouse.IsEligibleForMouseHandle(this)) {
                if (Current == PressState.Hover)
                    OnPress?.Invoke();
                
                Current = PressState.Pressed;
            } else if (Current == PressState.Pressed) {
                Current = PressState.Hover;
            } else {
                Mouse.Leave(this);

                Current = PressState.Normal;
            }
        }
    }

    public override void MouseRelease(MouseButtonEventArgs e) {
        if (IsVisible) {
            if (MouseIntersects(e.X, e.Y) && Mouse.IsEligibleForMouseHandle(this)) {
                Current = PressState.Hover;
                OnRelease?.Invoke();
            } else {
                Mouse.Leave(this);
                
                Current = PressState.Normal;
                OnLeave?.Invoke();
            }
        }
    }
}