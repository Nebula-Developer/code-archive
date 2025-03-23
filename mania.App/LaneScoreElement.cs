using Natsu.Graphics;
using Natsu.Core.Elements;
using Natsu.Mathematics;
using Natsu.Extensions;

namespace Mania;

public class LaneScoreElement : TextElement {
    public LaneScoreElement(Score score) {
        this.Text = score.ToString();

        Color = score switch {
            Score.Perfect => Colors.Green,
            Score.Great => Colors.Yellow,
            Score.Meh => Colors.Orange,
            Score.Miss => Colors.Red,
            _ => Colors.White
        };

        TextSize = 30;
        Pivot = new(0.5f, 1f);
        Position = new(0, -10);

        Opacity = 0;
        Scale = 0.75f;

        this.Begin("animate")
            .OpacityTo(1f, 0.1f)
                .ScaleTo(1f, 0.2f, Easing.ExpoOut)
                .MoveTo(new(0, -50), 0.24, Easing.ExpoOut)
            .Then()
                .OpacityTo(0f, 0.1f)
                .ScaleTo(0.75f, 0.2f, Easing.ExpoIn)
            .Then()
                .Do(() => {
                    this.Parent = null;
                });
    }
}
