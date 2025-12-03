using System.Text;

namespace NexusPort.Graphics;

public class Renderer {
    public List<PixelMap> Maps { get; set; } = new List<PixelMap>();

    public void Draw() {
        StringBuilder content = new StringBuilder();

        foreach (PixelMap map in Maps) {
            for (int y = 0; y < map.Height; y++) {
                string line = "";
                for (int x = 0; x < map.Width; x++) {
                    if (x == Console.WindowWidth - 1 && y == Console.WindowHeight - 1)
                        line += "\x1b[0m ";
                    else
                        line += map.Pixels[x, y].ToString(false);
                }
                content.AppendLine(line);
            }
        }

        Console.SetCursorPosition(0, 0);
        Console.Write(content.ToString().TrimEnd());
    }
}