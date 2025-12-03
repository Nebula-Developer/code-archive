namespace NexusPort.Graphics;

public class Window {
    public List<Element> Elements { get; set; } = new List<Element>();
    public List<Filter> Filters { get; set; } = new List<Filter>();
    public Renderer Renderer { get; set; } = new Renderer();
    public PixelMap Map;

    public Window(int width, int height) {
        Map = new PixelMap(width, height);
        Map.Clear();
        Renderer.Maps.Add(Map);
    }

    public void Draw() {
        ApplyElements();
        ApplyFilters();
        Renderer.Draw();
    }

    public void ApplyFilters() {
        for (int i = 0; i < Filters.Count; i++)
            for (int x = 0; x < Map.Width; x++)
                for (int y = 0; y < Map.Height; y++)
                    Filters[i].Handle(ref Map.Pixels[x, y], x, y);
    }

    public void ApplyElements() {
        for (int i = 0; i < Elements.Count; i++) {
            Map.ApplyXOffset = Elements[i].X;
            Map.ApplyYOffset = Elements[i].Y;
            Elements[i].Apply(ref Map);
        }

        Map.ApplyXOffset = 0;
        Map.ApplyYOffset = 0;
    }
}