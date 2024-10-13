
using System.Diagnostics.CodeAnalysis;
using System.Numerics;

using SkiaSharp;

namespace engine.Framework.Graphics;

[Flags]
public enum Invalidation {
    None = 1,       // Nothing needs to be redrawn
    Rotation, Position, Scale, Size, // The world values need to be recalculated
    Transform = Rotation | Position | Scale | Size,
    Render,     // The element needs to be redrawn - will be invalid if world transforms are invalid
    Children    // The children of the element changed
}

public enum InvalidationSource {
    Parent,
    Self,
    Child
}

[Flags]
public enum PropagationDirection {
    None = 0,
    Up = 1,
    Down = 2,
    Both = Up | Down
}

public class InvalidationHandler { // handles invalidation state for an elements parent, self, and children
    public Invalidation Parent { get; private set; } = Invalidation.None;
    public Invalidation Self { get; private set; } = Invalidation.None;
    public Invalidation Children { get; private set; } = Invalidation.None;

    // all bools return if anything changed
    public bool InvalidateParent(Invalidation invalidation) {
        if (Parent.HasFlag(invalidation)) return false;
        Parent |= invalidation;
        return true;
    }

    public bool InvalidateSelf(Invalidation invalidation) {
        if (Self.HasFlag(invalidation)) return false;
        Self |= invalidation;
        return true;
    }

    public bool InvalidateChildren(Invalidation invalidation) {
        if (Children.HasFlag(invalidation)) return false;
        Children |= invalidation;
        return true;
    }

    public bool ValidateParent(Invalidation invalidation) {
        if (!Parent.HasFlag(invalidation)) return false;
        Parent &= ~invalidation;
        return true;
    }

    public bool ValidateSelf(Invalidation invalidation) {
        if (!Self.HasFlag(invalidation)) return false;
        Self &= ~invalidation;
        return true;
    }

    public bool ValidateChildren(Invalidation invalidation) {
        if (!Children.HasFlag(invalidation)) return false;
        Children &= ~invalidation;
        return true;
    }
}

public enum Axis {
    X = 1,
    Y = 2,
    Both = X | Y
}

public abstract partial class Element {
    public InvalidationHandler InvalidationHandler { get; } = new InvalidationHandler();

    public virtual bool Invalidate(Invalidation invalidation, InvalidationSource source, PropagationDirection propagate = PropagationDirection.Both) {
        switch (source) {
            case InvalidationSource.Parent:
                bool res = InvalidationHandler.InvalidateParent(invalidation);
                return res;
            case InvalidationSource.Self:
                res = InvalidationHandler.InvalidateSelf(invalidation);
                if (propagate.HasFlag(PropagationDirection.Up) && Parent != null)
                    Parent.Invalidate(invalidation, InvalidationSource.Child, PropagationDirection.Up);
                return res;
            case InvalidationSource.Child:
                res = InvalidationHandler.InvalidateChildren(invalidation);
                if (propagate.HasFlag(PropagationDirection.Up) && Parent != null)
                    Parent.Invalidate(invalidation, InvalidationSource.Child, PropagationDirection.Up);
                return res;
            default:
                throw new ArgumentOutOfRangeException(nameof(source));    
        }
    }
    

    public float WorldRotation {
        get {
            if (InvalidationHandler.ValidateSelf(Invalidation.Rotation) || InvalidationHandler.ValidateParent(Invalidation.Rotation)) {
                _worldRotation = Rotation + (Parent?.WorldRotation ?? 0);
            }
            return _worldRotation;
        }
        set {
            if (Rotation == value) return;
            Rotation = Parent == null ? value : value - Parent.WorldRotation;
            InvalidationHandler.ValidateSelf(Invalidation.Rotation);
            Invalidate(Invalidation.Render, InvalidationSource.Self);
        }
    }
    private float _worldRotation = 0;

    public float Rotation {
        get => _rotation;
        set {
            if (_rotation == value) return;
            _rotation = value;
            Invalidate(Invalidation.Rotation | Invalidation.Render, InvalidationSource.Self);
        }
    }
    private float _rotation = 0;

    public Vector2 WorldPosition {
        get {
            if (InvalidationHandler.ValidateSelf(Invalidation.Position)) {
                _worldPosition = Position + (Parent?.WorldPosition ?? Vector2.Zero);
            }
            return _worldPosition;
        }
        set {
            if (Position == value) return;
            Position = Parent == null ? value : value - Parent.WorldPosition;
            Invalidate(Invalidation.Render, InvalidationSource.Self);
        }
    }
    private Vector2 _worldPosition = Vector2.Zero;

    public Vector2 Position {
        get => _position;
        set {
            if (_position == value) return;
            _position = value;
            Invalidate(Invalidation.Position | Invalidation.Render, InvalidationSource.Self);
        }
    }
    private Vector2 _position = Vector2.Zero;

    public Vector2 WorldScale {
        get {
            if (InvalidationHandler.ValidateSelf(Invalidation.Scale)) {
                _worldScale = Scale * (Parent?.WorldScale ?? Vector2.One);
            }
            return _worldScale;
        }
        set {
            if (Scale == value) return;
            Scale = Parent == null ? value : value / Parent.WorldScale;
            Invalidate(Invalidation.Render, InvalidationSource.Self);
        }
    }
    private Vector2 _worldScale = Vector2.One;

    public Vector2 Scale {
        get => _scale;
        set {
            if (_scale == value) return;
            _scale = value;
            Invalidate(Invalidation.Scale | Invalidation.Render, InvalidationSource.Self, PropagationDirection.None);
        }
    }
    private Vector2 _scale = Vector2.One;

    public Vector2 Size {
        get => _size;
        set {
            if (_size == value) return;
            _size = value;
            Invalidate(Invalidation.Size | Invalidation.Render, InvalidationSource.Self);
        }
    }
    private Vector2 _size = Vector2.Zero;

    public void InvalidateTransform() => Invalidate(Invalidation.Transform, InvalidationSource.Self, PropagationDirection.Down);

    public SKMatrix Transform {
        get {
            if (InvalidationHandler.ValidateSelf(Invalidation.Transform | Invalidation.Render) || _transform == null) {
                Console.WriteLine($"Recalculating transform {WorldRotation}");
                _transform = SKMatrix.CreateIdentity();
                _transform = SKMatrix.Concat(_transform.Value, SKMatrix.CreateRotationDegrees(WorldRotation));
                _transform = SKMatrix.Concat(_transform.Value, SKMatrix.CreateTranslation(WorldPosition.X, WorldPosition.Y));
                _transform = SKMatrix.Concat(_transform.Value, SKMatrix.CreateScale(WorldScale.X, WorldScale.Y));
            }
            return _transform.Value;
        }
    }
    private SKMatrix? _transform = null;
}
