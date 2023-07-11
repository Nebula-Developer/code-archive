using SFML.System;
using SFML.Graphics;

namespace VN;

public static class Program {
    public static void Main(String[] args) {
        VisualNovel.Init();
        // RectangleElement e = new RectangleElement(new Vector2f(100, 100));
        // e.Rectangle.Texture = new SFML.Graphics.Texture(Paths.GetAssetPath("GUI/TextBox.png"));

        RectangleElement buttonABG = new RectangleElement(new Vector2f(100, 100));
        buttonABG.Position += new Vector2f(100, 100);

        Button buttonA = new Button(buttonABG.Rectangle.GetLocalBounds()) {
            OnHover = () => { buttonABG.Rectangle.FillColor = Color.Red; },
            OnLeave = () => { buttonABG.Rectangle.FillColor = Color.White; }
        };

        buttonA.Parent = buttonABG;

        RectangleElement buttonBBG = new RectangleElement(new Vector2f(60, 60));
        buttonBBG.Position += new Vector2f(120, 120);

        buttonBBG.Rectangle.FillColor = Color.Blue;

        Button buttonB = new Button(buttonBBG.Rectangle.GetLocalBounds()) {
            OnHover = () => { buttonBBG.Rectangle.FillColor = Color.Cyan; },
            OnLeave = () => { buttonBBG.Rectangle.FillColor = Color.Blue; }
        };

        buttonB.Parent = buttonBBG;
        buttonB.zIndex = 10;

        VisualNovel.AddElement(buttonA);
        VisualNovel.AddElement(buttonABG);

        VisualNovel.AddElement(buttonB);
        VisualNovel.AddElement(buttonBBG);

        VisualNovel.Run();
    }
}
