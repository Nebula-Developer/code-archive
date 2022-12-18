using System;
using TGUI.Graphics;

namespace TGUI;

public static class ProgramTest {
    public static void Main(string[] args) {
        int height = Console.WindowHeight;
        int width = Console.WindowWidth;

        List<RGB> layers = new List<RGB>();
        layers = new RGB[] {
            new RGB(255, 0, 0),
            new RGB(0, 255, 0),
            new RGB(0, 0, 255),
            new RGB(255, 0, 0),
            new RGB(0, 255, 0),
            new RGB(0, 0, 255)
        }.ToList();
        
        Passthrough passthrough = new Passthrough(
            layers.ToArray()
        );

        passthrough.width = Console.WindowWidth;
        passthrough.height = Console.WindowHeight;

        string str = passthrough.Generate() + Colors.RESET;

        for (int i = 0; i < layers.Count(); i++) {
            str = str.Replace(layers[i].ToESC(), "R");
        }

        Text.WriteAtPos(str, new Vector2i(0, 0), false);
    }
}
