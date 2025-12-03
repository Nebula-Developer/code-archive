using SFML.Graphics;
using SFML.System;

namespace SFMLE;

public class TransformableElement : Anchored, Element {
    public TransformableElement Parent { get; set; }

    public TransformableElement() : base() { }
    
    public void Update() {
        if (Parent == null) CalcWorldPosition(new Vector2f(0, 0), new Vector2f(0, 0));
        else CalcWorldPosition(Parent.WorldPosition, Parent.Size);
    }
}

public class TextTransformableElement : TextAnchored, Element {
    public TransformableElement Parent { get; set; }

    public TextTransformableElement(TextElement element) : base(element) { }
    
    public void Update() {
        if (Parent == null) CalcWorldPosition(new Vector2f(0, 0), new Vector2f(0, 0));
        else CalcWorldPosition(Parent.WorldPosition, Parent.Size);
    }
}
