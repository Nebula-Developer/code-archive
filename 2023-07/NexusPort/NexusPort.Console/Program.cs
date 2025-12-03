using System;
using NexusPort.System;
using NexusPort.Graphics;

public static class Program {
    public static void Main() {
        Nexus.Init();
        RootConfig.Initializer.Value = 0; // Will call initializer as the class is being used

        int width = Console.WindowWidth;
        int height = Console.WindowHeight;

        Window testWindow = new Window(width, height);

        // PointElement point = new PointElement(width / 2, height / 2, new Pixel('x', new RGB(255, 0, 0), new RGB()));
        // testWindow.Elements.Add(point);

        InvertFilter invert = new InvertFilter();
        GrayscaleFilter grayscale = new GrayscaleFilter();

        BoxElement b = new BoxElement(0, 0, width, height, new Pixel(new RGB(100, 100, 100)), new Pixel(new RGB(255, 150, 100)));
        testWindow.Elements.Add(b);

        testWindow.Draw();
        Console.ReadKey(true);
        testWindow.Filters.Add(grayscale);
        testWindow.Draw();
    }
}

