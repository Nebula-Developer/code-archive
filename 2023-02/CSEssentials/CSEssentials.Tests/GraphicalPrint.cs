using CSEssentials.Mathematics.General;
using CSEssentials.Graphics;

namespace CSEssentials.Tests;

public class GraphicalPrint
{
    [Fact] public void PrintElastic() { while (true) {
        Console.Clear();
        float t = 0.0f;
        int width = Console.WindowWidth;
        float step = 1.0f / width;

        for (t = 0.0f; t < 1.0; t += step / 8) {
            float val = EMath.Easing.Ease(0, 1, t, EMath.EaseType.InOutExpo);
            int xPos = (int)(val * width);
            xPos = xPos > width ? width - xPos : xPos;
            xPos = xPos < 0 ? 0 : xPos;
            RGB color = new RGB(0, 0, 0).Fade(new RGB(255, 255, 255), t);
            Console.SetCursorPosition(xPos, 0);
            Console.Write(color.ToFGEsc() + "█" + Colors.ResetEsc);
            Thread.Sleep(1);
        }

        for (t = 1f; t > 0.0; t -= step / 8) {
            float val = EMath.Easing.Ease(0, 1, t, EMath.EaseType.InOutExpo);
            int xPos = (int)(val * width);
            xPos = xPos > width ? width - xPos : xPos;
            xPos = xPos < 0 ? 0 : xPos;
            RGB color = new RGB(0, 0, 0).Fade(new RGB(255, 255, 255), t);
            Console.SetCursorPosition(xPos, 0);
            Console.Write(color.ToFGEsc() + "█" + Colors.ResetEsc);
            Thread.Sleep(1);
        }

        Console.ReadKey();
    }}
}
