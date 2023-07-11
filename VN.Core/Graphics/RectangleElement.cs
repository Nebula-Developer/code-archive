using System;
using SFML.System;
using SFML.Graphics;
using SFML.Window;

namespace VN;

#nullable disable

public class Binding<Type> {
    public Type Value { get; set; }
    public Action<Type> ValueSet;

    public Binding(Type value, Action<Type> valueSet) {
        Value = value;
        this.ValueSet = valueSet;
    }

    public void Set(Type value) {
        Value = value;
        ValueSet?.Invoke(value);
    }

    public static implicit operator Type(Binding<Type> binding) {
        return binding.Value;
    }
}

public class RectangleElement : Element {
    public RectangleShape Rectangle { get; set; }
    public Binding<Color> FillColor { get; set; }

    public RectangleElement(Vector2f size) {
        Rectangle = new RectangleShape(size);
        Rectangle.Origin = Rectangle.Size / 2;
        FillColor = new Binding<Color>(Color.White, (value) => Rectangle.FillColor = value);
    }

    public override void Render() {
        if (IsVisible) {
            Rectangle.Position = WorldPosition;
            Rectangle.Rotation = WorldRotation;
            VisualNovel.Window.Draw(Rectangle);
        }

        if (Keyboard.IsKeyPressed(Keyboard.Key.Right)) {
            Position += new Vector2f(1, 0);
        } else if (Keyboard.IsKeyPressed(Keyboard.Key.Left)) {
            Position += new Vector2f(-1, 0);
        }
    }

    public override void KeyPress(KeyEventArgs e) {
        if (e.Code == Keyboard.Key.E) {
            FillColor.Set(new Color(255, 255, 255, 100));
        } else if (e.Code == Keyboard.Key.F) {
            FillColor.Set(Color.Blue);
        }
    }

    public override void MousePress(MouseButtonEventArgs e) {
        Vector2f mouseClickPosition = new Vector2f(e.X, e.Y);
        Vector2f currentPos = Position;

        float time = 1500;
        float distance = 0;
        distance += Math.Abs(mouseClickPosition.X - currentPos.X);
        distance += Math.Abs(mouseClickPosition.Y - currentPos.Y);
        // time *= distance / 100;
        
        float Lerp(float a, float b, float t) => a + (b - a) * t;
        Animation.Animate(time, (t) => {
            Position = new Vector2f(Lerp(currentPos.X, mouseClickPosition.X, t), Lerp(currentPos.Y, mouseClickPosition.Y, t));
            
            if (t < 0.5) {
                Rotation = Lerp(0, distance / 10, t * 2);
            } else {
                Rotation = Lerp(distance / 10, 0, (t - 0.5f) * 2);
            }
        }, "BoxRotation", Easing.ElasticOut);
    }
}
