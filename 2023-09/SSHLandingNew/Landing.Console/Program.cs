using Landing.Library;

using Landing.Library.Graphics;

public static class Program {
    public static void Main(string[] args)
    {
        Console.CursorVisible = false;

        Console.CancelKeyPress += (sender, eventArgs) =>
        {
            Console.Clear();
            Console.CursorVisible = true;
            Environment.Exit(0);
        };
        
        Thread renderThread = new Thread(RenderOnResizeThread);
        renderThread.Start();

        LineElement line = new LineElement(
                            new(2), new(1),
                            new(() => Console.WindowWidth - 3), new(() => Console.WindowHeight - 2),
                            new Pixel(' ', new RGB(255, 0, 0), new RGB(0, 0, 255)));

        LineElement line2 = new LineElement(
                            new(2), new(() => Console.WindowHeight - 2),
                            new(() => Console.WindowWidth - 3), new(1),
                            new Pixel(' ', new RGB(255, 0, 0), new RGB(0, 0, 255)));

        BoxElement box = new BoxElement(new(0), new(0),
                            new(() => Console.WindowWidth - 1), new(() => Console.WindowHeight - 1),
                            outline: new Pixel(' ', new RGB(0, 255, 0), new RGB(255, 0, 0)), doubleSideBorder: true);

        TextElement text = new TextElement(new(0), new(5), "Hello! This is a test", new RGB(255, 100, 255), new RGB(0, 0, 0), TextAlignment.Right, new(() => Console.WindowWidth - 2));
        TextElement text2 = new TextElement(new(2), new(5), "Hello! This is a test", new RGB(100, 255, 255), new RGB(0, 0, 0), TextAlignment.Left, new(() => Console.WindowWidth - 2));
        TextElement text3 = new TextElement(new(0), new(7), "Hello! This is a test", new RGB(255, 255, 100), new RGB(0, 0, 0), TextAlignment.Center, DependentInt.WindowWidth);

        Screen screen = new Screen();

        LineElement centerLine = new LineElement(
            new(() => Console.WindowWidth / 2), new(0),
            new(() => Console.WindowWidth / 2), new(() => Console.WindowHeight - 1),
            new Pixel('|', new RGB(255, 255, 255), new RGB(0, 0, 0))
        );

        screen.AddElements(centerLine, line, line2, box, text, text2, text3);
        
        int boxCount = 4;
        int boxWidth = 6;
        int boxHeight = (int)(boxWidth / 2.4f);
        int boxY = 3;

        List<BoxElement> boxes = new List<BoxElement>();

        for (int i = 0; i < boxCount; i++) {
            DependentIntVariable var = new DependentIntVariable(0)  { Variable = i };
            var.Type = DependentInt.DependentType.Dependent;
            var.DependentValue = () => Grid.GetPositions(Console.WindowWidth / 2, -(boxWidth / 2), boxCount)[var.Variable] + Console.WindowWidth / 4;
            
            DependentIntVariable varB = new DependentIntVariable(0)  { Variable = i };
            varB.Type = DependentInt.DependentType.Dependent;
            varB.DependentValue = () => Grid.GetPositions(Console.WindowWidth / 2, -(boxWidth / 2), boxCount)[var.Variable] + boxWidth + Console.WindowWidth / 4;
            BoxElement boxElement = new BoxElement(
                var, new(boxY),
                varB, new(boxY + boxHeight),
                outline: new Pixel('A', new RGB(100, 50, 130), new RGB(255, 200, 100)), doubleSideBorder: true
            );
            
            boxes.Add(boxElement);

            screen.AddElements(boxElement);
        }

        Display.CurrentScreen = screen;
        while (true)  {
            Display.Draw();
            ConsoleKeyInfo k = Console.ReadKey(true);
            if (int.TryParse(k.KeyChar.ToString(), out int a)) {
                if (a < boxes.Count)
                {
                    foreach (var b in boxes)
                    {
                        b.Fill = null;
                    }
                    boxes[a].Fill = new Pixel('A', new RGB(255, 200, 130), new RGB(255, 255, 255));
                }
            }
        }
    }

    public static void RenderOnResizeThread() {
        int lastWidth = Console.WindowWidth;
        int lastHeight = Console.WindowHeight;

        while (true) {
            if (lastWidth != Console.WindowWidth || lastHeight != Console.WindowHeight) {
                lastWidth = Console.WindowWidth;
                lastHeight = Console.WindowHeight;
                Display.Draw();
            }
            Thread.Sleep(250);
        }
    }
}
