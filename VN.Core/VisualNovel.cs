using SFML.Graphics;
using SFML.Window;
using SFML.System;
using System;

namespace VN;

public static class Paths {
    public static string GetAssetPath(string path) => Path.Join(AppContext.BaseDirectory, path);
}


public partial class VisualNovel {
    public RenderWindow Window;
    public Vector2u BaseSize = new Vector2u(800, 600);

    public ImgElement TextBox = new ImgElement("Assets/GUI/TextBox.png");

    public void Resize(object? sender = null, SizeEventArgs? e = null) {
        Window.SetView(new View(new FloatRect(0, 0, e?.Width ?? BaseSize.X, e?.Height ?? BaseSize.Y)));
        OnResize?.Invoke();
    }

    public Action? OnResize;

    public void Render() {
        Window = new RenderWindow(new VideoMode(BaseSize.X, BaseSize.Y), "Visual Novel");


        Resize();
        Window.Resized += Resize;

        Clock deltaClock = new Clock();
        float deltaTime = 0f;

        while (Window.IsOpen) {
            deltaTime = deltaClock.Restart().AsSeconds();

            Window.DispatchEvents();
            Window.Clear();

            TextBox.Draw(Window);
            
            if (Window.HasFocus()) {
                if (Keyboard.IsKeyPressed(Keyboard.Key.Right)) TextBox.Position += new Vector2f(100f * deltaTime, 0f);
                if (Keyboard.IsKeyPressed(Keyboard.Key.Left)) TextBox.Position -= new Vector2f(100f * deltaTime, 0f);
                if (Keyboard.IsKeyPressed(Keyboard.Key.Up)) TextBox.Position -= new Vector2f(0f, 100f * deltaTime);
                if (Keyboard.IsKeyPressed(Keyboard.Key.Down)) TextBox.Position += new Vector2f(0f, 100f * deltaTime);
            }

            Window.Display();
        }
    }
}
