using SFML.Graphics;
using SFML.Window;
using SFML.System;
using System;
using System.Diagnostics;

namespace VN;

#nullable disable

public static partial class VisualNovel {
    public static RenderWindow Window { get; private set; }

    public static Dictionary<Element, int> Elements { get; private set; } = new Dictionary<Element, int>();
    
    public static void AddElement(Element element, int index = -1) {
        Elements.Add(element, index);
        Elements = Elements.OrderBy((pair) => pair.Value).ToDictionary((pair) => pair.Key, (pair) => pair.Value);
        VisualNovelEvents.AddElement(element);
    }

    public static void RemoveElement(Element element) {
        Elements.Remove(element);
        VisualNovelEvents.RemoveElement(element);
    }
    
    public static void Init() {
        Window = new RenderWindow(new VideoMode(1280, 720), "Visual Novel", Styles.Default);
        Window.Closed += (sender, e) => { Window.Close(); };
        Window.Resized += (sender, e) => { Window.SetView(new View(new FloatRect(0, 0, e.Width, e.Height))); };
    }

    public static void Run() {
        while (Window.IsOpen) {
            Window.DispatchEvents();
            Window.Clear(Color.Black);

            foreach (var element in Elements.Keys) {
                if (element.IsVisible) {
                    element.Render();
                }
            }

            Window.Display();
        }
    }
}
