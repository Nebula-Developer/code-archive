using Natsu.Core;
using Natsu.Platforms.Desktop;

namespace Mania;

public static class Program {
    public static void Main() {
        Application app = new MyApp();

        DesktopWindowSettings settings = new() { Title = "mania" };

        DesktopWindow window = new(app, settings);
        window.Run();
    }
}
