using OpenTK.Mathematics;
using SkiaSharp;

namespace VN;

public class Element {
    public bool Visible = true;
    public int ZIndex;

    public Vector2 Position = Vector2.Zero;
    public Vector2 Scale = Vector2.One;
    public float Rotation = 0;

    public Vector2 Origin = Vector2.Zero;

    public virtual void Render(Novel novel) { }
    public virtual bool ContainsPoint(float x, float y) => false;

    public Element() { }
}

public class ElementList {
    public Element this[int index] {
        get => _elements[index];
        set {
            _elements[index] = value;
            Sort();
        }
    }
    private List<Element> _elements = new List<Element>();

    public void Render(Novel novel) {
        foreach (Element element in _elements)
            element.Render(novel);
    }

    public void Add(Element element) {
        _elements.Add(element);
        Sort();
    }

    public void Remove(Element element) => _elements.Remove(element);
    public void Sort() => _elements.Sort((a, b) => a.ZIndex.CompareTo(b.ZIndex));
}

public class Colorable : Element {
    public SKColor Color {
        get => _paint.Color;
        set => _paint.Color = value;
    }
    internal SKPaint _paint = new SKPaint() {
        IsAntialias = true,
        Style = SKPaintStyle.Fill,
        Color = SKColors.White
    };
    public float Transparency {
        get => _paint.Color.Alpha / 255f;
        set => _paint.Color = new SKColor(_paint.Color.Red, _paint.Color.Green, _paint.Color.Blue, (byte)(value * 255));
    }
}

public class RectangleElement : Colorable {
    public Vector2 Size;

    public override void Render(Novel novel) {
        base.Render(novel);

        if (!Visible)
            return;

        SKMatrix matrix = SKMatrix.CreateIdentity();
        matrix = SKMatrix.Concat(matrix, SKMatrix.CreateRotationDegrees(Rotation, Position.X + (Size.X * Origin.X), Position.Y + (Size.Y * Origin.Y)));

        int m = novel.Canvas.Save();
        novel.Canvas.SetMatrix(matrix);

        novel.Canvas.DrawRect(Position.X - (Size.X * Origin.X), Position.Y - (Size.Y * Origin.Y), Size.X, Size.Y, _paint);

        novel.Canvas.RestoreToCount(m);
    }
}

public class ImageElement : Colorable {
    public SKImage Image;
    public Vector2 Size;

    public override void Render(Novel novel) {
        base.Render(novel);

        if (!Visible)
            return;

        SKMatrix matrix = SKMatrix.CreateIdentity();
        matrix = SKMatrix.Concat(matrix, SKMatrix.CreateRotationDegrees(Rotation, Position.X, Position.Y));
        matrix = SKMatrix.Concat(matrix, SKMatrix.CreateScale(Scale.X, Scale.Y, Position.X, Position.Y));

        int m = novel.Canvas.Save();
        novel.Canvas.SetMatrix(matrix);
        
        novel.Canvas.DrawImage(Image, new SKRect(Position.X - (Size.X * Origin.X), Position.Y - (Size.Y * Origin.Y), Position.X + (Size.X * (1 - Origin.X)), Position.Y + (Size.Y * (1 - Origin.Y))), _paint);

        novel.Canvas.RestoreToCount(m);
    }

    public ImageElement(string filename) {
        Image = SKImage.FromEncodedData(filename);
        Size = new Vector2(Image.Width, Image.Height);
    }
}