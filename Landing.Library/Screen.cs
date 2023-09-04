namespace Landing.Library.Graphics;

public class Screen {
    public List<Element> Elements { get; set; }

    public Screen() {
        Elements = new List<Element>();
    }

    public void AddElements(params Element[] elements) {
        Elements.AddRange(elements);
    }

    public void Draw() {
        PixelMap Map = new PixelMap(Console.WindowWidth, Console.WindowHeight);
        Map.ClearPixels();
        foreach (Element element in Elements) {
            element.Draw(ref Map);
        }
        
        Console.SetCursorPosition(0, 0);
        for (int y = 0; y < Map.Pixels.GetLength(1); y++) {
            for (int x = 0; x < Map.Pixels.GetLength(0); x++)
                Console.Write(Map.Pixels[x, y].ToString());
    
            if (y < Map.Pixels.GetLength(1) - 1)
                Console.WriteLine();
        }
    }
}
