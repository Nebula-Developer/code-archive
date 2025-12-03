
using engine.Framework.Graphics.Containers;

using SkiaSharp;

namespace engine.Framework.Graphics;

public abstract partial class Element : IDisposable {
    public virtual void Render(SKCanvas canvas) {}
    public virtual void Update() {}

    private string? _name = null;
    public string Name {
        get => _name ?? GetType().Name;
        set => _name = value;
    }

    public CompositeElement? Parent {
        get => _parent;
        set {
            if (_parent != null)
                _parent.Remove(this);
            _parent = value;
        }
    }

    public virtual Application? Application => Parent?.Application;

    private CompositeElement? _parent = null;

    public void Dispose() => OnDispose();
    protected virtual void OnDispose() {}
}
