using SFML.Graphics;
using SFML.System;

namespace SFMLE;

public class TextElement : TextTransformableElement {
    public Text Text { get; set; }

    public TextElement() : base(null) {
        Text = new Text("", new Font("/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf"), 16) {
            FillColor = Color.White
        };

        this.element = this;
    }
    
    public new void Update() {
        base.Update();
        Text.Position = WorldPosition;
        Text.Origin = new Vector2f(0, 0);

        Text.LetterSpacing = 1;
        int letterCount = Text.DisplayedString.Length;

        float width = Text.GetLocalBounds().Width;
        float height = Text.GetLocalBounds().Height;

        Vector2f targetSize = Size;

        float scaleX = targetSize.X / width;
        float scaleY = targetSize.Y / height;

        float scale = Math.Min(scaleX, scaleY);
        Text.Scale = new Vector2f(scale, scale);
    }

    public void Draw(RenderTarget target, RenderStates states) {
        target.Draw(Text, states);
    }
}
