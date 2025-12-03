using SkiaSharp;

namespace engine.Framework.Graphics;

public interface IRenderer : IDisposable {
    public SKSurface Surface { get; }

    public void Resize(int width, int height);

    public void Flush();

    public void Load();
}
