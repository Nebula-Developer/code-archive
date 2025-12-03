using SFML.System;

namespace SFMLE;

public class TextAnchored : Anchored {
    public TextElement element { get; set; }
    public new Vector2f Size {
        get {
            Console.WriteLine(element.Text.GetLocalBounds().Width + " " + element.Text.GetLocalBounds().Height);
            return new Vector2f(element.Text.GetLocalBounds().Width, element.Text.GetLocalBounds().Height);
        }
    }

    public TextAnchored(TextElement element) : base() {
        this.element = element;
    }
}
