
using SkiaSharp;

namespace engine.Framework.Graphics.Renderers;

public class EmptyRenderer : IRenderer {
    public SKCanvas Canvas => Surface.Canvas;
    public SKSurface Surface { get; protected set; } = null!;

    public void Resize(int width, int height) {
        Surface?.Dispose();
        Surface = SKSurface.Create(new SKImageInfo(width, height));
    }

    public void Flush() {
        Canvas?.Flush();
    }

    public void Load() {
        Resize(600, 400);
    }

    public void WriteToImage(string path) {
        if (Surface == null)
            throw new InvalidOperationException("Surface is null.");
    
        using var image = Surface.Snapshot();
        using var data = image.Encode();
        using var stream = File.OpenWrite(path);
        data.SaveTo(stream);
    }

    public void Dispose() {
        Surface?.Dispose();
    }
}
