

using System.Diagnostics;

using SkiaSharp;

namespace engine.Framework.Graphics.Containers;

public class CachedContainer : CompositeElement { // A composite element that caches its drawing
    private SKImage? _cache = null;
    private Task? _cacheTask = null;
    public bool Valid = false;
    public bool UseAppLoader = true;

    public override void Render(SKCanvas canvas) {
        if (!Valid && (_cacheTask == null || _cacheTask.IsCompleted)) {
            if (!UseAppLoader || Application == null) {
                SKSurface surface = SKSurface.Create(new SKImageInfo((int)Size.X, (int)Size.Y));
                SKCanvas cacheCanvas = surface.Canvas;
                base.Render(cacheCanvas);
                _cache = surface.Snapshot();
                Valid = true;
            } else {
                var loader = Application.BackendLoader;
                _cacheTask = loader.PerformLoadTask(() => {
                    SKSurface surface = SKSurface.Create(new SKImageInfo((int)Size.X, (int)Size.Y));
                    SKCanvas cacheCanvas = surface.Canvas;
                    base.Render(cacheCanvas);
                    lock (_cache ?? new object()) {
                        _cache?.Dispose();
                        _cache = surface.Snapshot();
                    }
                    Valid = true;
                });
            }
        }

        if (_cache != null)
            canvas.DrawImage(_cache, 100, 100);
    }
}
