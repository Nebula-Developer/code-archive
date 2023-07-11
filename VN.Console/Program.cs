using SFML.System;

namespace VN;

public static class Program {
    public static void Main(String[] args) {
        VisualNovel.Init();
        RectangleElement e = new RectangleElement(new Vector2f(100, 100));
        VisualNovel.AddElement(e);

        VisualNovel.Run();
    }
}
