

using SkiaSharp;

namespace engine.Framework.Graphics.Containers;

public abstract partial class CompositeElement : Element { // Something that can contain other elements
    public IReadOnlyList<Element> Children {
        get => _children;
        set {
            Clear();
            foreach (Element child in value)
                Add(child);
        }
    }

    private readonly List<Element> _children = new();

    public void Add(Element child) {
        if (child.Parent != null)
            throw new InvalidOperationException($"{child.Name} already has a parent.");
        lock (_children) _children.Add(child);
        Invalidate(Invalidation.Children, InvalidationSource.Self);
        child.Parent = this;
    }

    public void Remove(Element child) {
        if (child.Parent != this)
            throw new InvalidOperationException($"Element is not a child of {Name}");
        lock (_children) _children.Remove(child);
        child.Parent = null;
    }

    public void Clear() {
        lock (_children) {
            foreach (Element child in _children)
                Remove(child);
        }
    }

    public override void Render(SKCanvas canvas) {
        lock (_children) {
            foreach (Element child in _children)
                child.Render(canvas);
        }
    }

    public override bool Invalidate(Invalidation invalidation, InvalidationSource source, PropagationDirection propagate = PropagationDirection.Both) {
        if (source != InvalidationSource.Parent) {
            bool prop = InvalidationHandler.InvalidateParent(invalidation);
            if (propagate.HasFlag(PropagationDirection.Up) && Parent != null)
                Parent.Invalidate(invalidation, InvalidationSource.Child, PropagationDirection.Up);
            else if (propagate.HasFlag(PropagationDirection.Down))
                lock (_children)
                    foreach (Element child in _children)
                        child.Invalidate(invalidation, InvalidationSource.Parent, PropagationDirection.Down);
            return prop;
        }

        return base.Invalidate(invalidation, source, propagate);
    }
}
