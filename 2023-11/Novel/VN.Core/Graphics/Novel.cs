using OpenTK.Mathematics;
using SkiaSharp;
using Topten.RichTextKit;

namespace VN;

public class Novel : Window {
    public Characters Characters;
    public ElementList Elements;
    public Animations Animations;

    public void FadeOut(Colorable element, float duration) {
        Animations.Animate("fadeout-" + element.GetHashCode(), new Animation(duration, (t) => {
            element.Transparency = 1f - t;
        }, Easing.Linear));
    }

    public void FadeIn(Colorable element, float duration) {
        Animations.Animate("fadein-" + element.GetHashCode(), new Animation(duration, (t) => {
            element.Transparency = t;
        }, Easing.Linear));
    }

    public ImageElement dialogueBox = new ImageElement("textbox.png") {
        Color = new SKColor(255, 255, 255, 200),
        ZIndex = 101,
        Origin = new Vector2(0.5f, 1f)
    };

    public ImageElement nameBox = new ImageElement("namebox.png") {
        Color = new SKColor(255, 255, 255, 200),
        ZIndex = 102,
        Origin = new Vector2(0f, 1f)
    };

    public Novel() : base() {
        Elements = new ElementList();
        Characters = new Characters();
        Animations = new Animations();

        Elements.Add(dialogueBox);
        Elements.Add(nameBox);
        ResizeEvent();
    }

    public override void ResizeEvent() {
        base.ResizeEvent();

        // change the scale so it always fits

        float scale = (RealSize.X / dialogueBox.Size.X) * 0.75f;
        scale = Math.Min(scale, 2f);
        dialogueBox.Scale = new Vector2(scale, scale);

        dialogueBox.Position = new Vector2(RealSize.X / 2, RealSize.Y - (RealSize.Y / 20));
        Console.WriteLine(Size.Y);

        float scaleX = dialogueBox.Scale.X;
        float scaleY = dialogueBox.Scale.Y;
        float width = dialogueBox.Size.X * scaleX;
        float height = dialogueBox.Size.Y * scaleY;
        float x = dialogueBox.Position.X - (width * dialogueBox.Origin.X);
        float y = dialogueBox.Position.Y - (height * dialogueBox.Origin.Y);

        nameBox.Scale = dialogueBox.Scale;
        nameBox.Position = new Vector2(x + (width / 30), y);
        Console.WriteLine(nameBox.Position);
    }

    public override void Render() {
        Animations.Update(Time);
        Elements.Render(this);

        // just to test, write wrapped text
        string text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl. Donec euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nisl vitae nisl.";
        var textBlock = new TextBlock();
        textBlock.MaxWidth = (dialogueBox.Size.X * dialogueBox.Scale.X) - 40;
        textBlock.MaxHeight = (dialogueBox.Size.Y * dialogueBox.Scale.Y) - 40;

        float scaleX = dialogueBox.Scale.X;
        float scaleY = dialogueBox.Scale.Y;
        float width = dialogueBox.Size.X * scaleX;
        float height = dialogueBox.Size.Y * scaleY;
        float x = dialogueBox.Position.X - (width * dialogueBox.Origin.X);
        float y = dialogueBox.Position.Y - (height * dialogueBox.Origin.Y);

        SKPoint pos = new SKPoint(x + 20, y + 20);
        
        Style style = new Style() {
            FontFamily = "Arial",
            FontSize = 24,
            TextColor = SKColors.White,
            HaloWidth = 7,
            HaloColor = SKColors.Green
        };

        textBlock.AddText(text, style);

        textBlock.Paint(Canvas, pos);
    }
}

