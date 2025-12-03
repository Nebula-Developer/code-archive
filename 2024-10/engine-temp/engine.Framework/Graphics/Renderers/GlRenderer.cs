using System.Diagnostics;

using OpenTK;
using OpenTK.Graphics.OpenGL4;
using OpenTK.Windowing.Common;
using OpenTK.Windowing.Desktop;

using SkiaSharp;

namespace engine.Framework.Graphics.Renderers;

public class GlApplication(Application app) : GameWindow(new GameWindowSettings {
    UpdateFrequency = 500,
}, new NativeWindowSettings {
    ClientSize = new(600, 400),
    Title = "Application"
}) {
    public Application Application { get; } = app;
    public GlRenderer Renderer { get; } = new();

    protected override void OnLoad() {
        base.OnLoad();
        Renderer.GLFWGraphicsContext = Context;
        Context.MakeCurrent();
        Application.SetRenderer(Renderer);
        Renderer.Resize(600, 400);
    }

    protected override void OnFramebufferResize(FramebufferResizeEventArgs e) {
        base.OnFramebufferResize(e);
        Application.Resize(e.Width, e.Height);
    }

    protected override void OnRenderFrame(FrameEventArgs args) {
        base.OnRenderFrame(args);
        Application.Render();
        Application.Flush();
    }
}

public class GlRenderer : IRenderer {
    public SKSurface Surface { get; protected set; } = null!;

    private GRContext _context = null!;
    private GRGlInterface _glInterface = null!;
    private GRBackendRenderTarget _renderTarget = null!;

    public IGLFWGraphicsContext? GLFWGraphicsContext { get; set; }

    public void Resize(int width, int height) {
        Surface?.Dispose();
        _renderTarget?.Dispose();
        _renderTarget = new(width, height, 0, 8, new(0, (uint)SizedInternalFormat.Rgba8));
        GLFWGraphicsContext?.MakeCurrent();
        Surface = SKSurface.Create(_context, _renderTarget, GRSurfaceOrigin.BottomLeft, SKColorType.Rgba8888);
    }

    public void Load() {
        _glInterface = GRGlInterface.Create();
        _context = GRContext.CreateGl(_glInterface);
    }

    public void Flush() {
        Surface.Canvas.Flush();
        _context.Flush();
        GLFWGraphicsContext?.SwapBuffers();
    }

    public void Dispose() {
        Surface?.Dispose();

        _context?.Dispose();
        _glInterface?.Dispose();
        _renderTarget?.Dispose();
    }
}
