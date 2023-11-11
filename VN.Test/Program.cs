// See https://aka.ms/new-console-template for more information
using VN;
using SkiaSharp;
using OpenTK.Mathematics;

public static class Program {
    public static void Main(string[] args) {
        Console.WriteLine("Hello, World!");

        Novel novel = new Novel();

        ImageElement rect = new ImageElement("RTS_Crate.png") {
            Size = new Vector2(1000, 100),
            Color = SKColors.Red,
            ZIndex = 1,
            // Rotation = 45f,
            Position = new Vector2(800, 200),
            Origin = new Vector2(0.5f, 0.5f)
        };


        novel.Animations.Animate("boxspin", new Animation(1f, (t) => {
            rect.Rotation = t * 360f;
        }, Easing.ExpInOut, AnimationLoopMode.Loop));

        novel.Elements.Add(rect);

        novel.Run();
    }
}
