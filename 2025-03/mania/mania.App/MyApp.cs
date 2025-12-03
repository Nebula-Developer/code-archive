using Natsu.Graphics;
using Natsu.Core;
using Natsu.Mathematics;

namespace Mania;

public class MyApp : Application {
    protected override void OnLoad() {
        int gameCount = 1;

        for (int i = 0; i < gameCount; i++) {
            var game = new ProceduralGame() {
                RelativeSizeAxes = Axes.Both,
                Size = new(1f / (float)gameCount, 1f),
                AnchorPosition = new(i * (1f / (float)gameCount), 0),
            };
            Add(game);
        }

        Platform.VSync = false;
        Platform.UpdateFrequency = 100;
    }

    protected override void OnRender() {
        Canvas.DrawText("FPS: " + Time.TPS.ToString("0.00"), new(10, 10), ResourceLoader.DefaultFont, new() {
            Color = Colors.White,
            TextSize = 20
        });
    }
}
