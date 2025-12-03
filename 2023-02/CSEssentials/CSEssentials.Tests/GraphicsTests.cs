using CSEssentials.Graphics;

namespace CSEssentials.Tests;

public class GraphicsTests
{
    [Fact] public void RGBFade() => Assert.Equal(new RGB(255, 255, 255), new RGB(0, 0, 0).Fade(new RGB(255, 255, 255), 1));
    [Fact] public void RGBHalfLerp() => Assert.Equal(new RGB(127, 127, 127), RGB.Lerp(new RGB(0, 0, 0), new RGB(255, 255, 255), 0.5f));
    [Fact] public void TrueColorTest() => Console.WriteLine(new RGB(127, 127, 127).ToFGEsc() + "Test" + Colors.ResetEsc);
}
