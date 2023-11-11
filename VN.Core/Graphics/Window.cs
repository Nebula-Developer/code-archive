using OpenTK.Windowing.Common;
using OpenTK.Windowing.Desktop;
using OpenTK.Graphics.OpenGL4;
using SkiaSharp;
using OpenTK.Mathematics;

namespace VN;

public class Window : GameWindow {
    GRGlInterface grgInterface;
    GRContext grContext;
    SKSurface surface;
    public SKCanvas Canvas;
    public GRBackendRenderTarget RenderTarget;
    public Time Time;

    private static NativeWindowSettings nws = new NativeWindowSettings {
        Flags = ContextFlags.ForwardCompatible | ContextFlags.Debug,
        Profile = ContextProfile.Core,
        StartFocused = true,
        WindowBorder = WindowBorder.Resizable,
    };

    public Window() : base(GameWindowSettings.Default, nws) {
        VSync = VSyncMode.Off;
        Time = new Time();
    }

    protected override void OnLoad() {
        base.OnLoad();

        grgInterface = GRGlInterface.Create();
        grContext = GRContext.CreateGl(grgInterface);
        RenderTarget = new GRBackendRenderTarget(ClientSize.X, ClientSize.Y, 0, 8, new GRGlFramebufferInfo(0, (uint)SizedInternalFormat.Rgba8));
        surface = SKSurface.Create(grContext, RenderTarget, GRSurfaceOrigin.BottomLeft, SKColorType.Rgba8888);
        Canvas = surface.Canvas;
    }

    public Vector2 RealSize => new Vector2(ClientSize.X * 2, ClientSize.Y * 2);

    protected override void OnResize(ResizeEventArgs e) {
        base.OnResize(e);

        RenderTarget?.Dispose();
        surface?.Dispose();

        RenderTarget = new GRBackendRenderTarget(e.Width * 2, e.Height * 2, 0, 8, new GRGlFramebufferInfo(0, (uint)SizedInternalFormat.Rgba8));
        surface = SKSurface.Create(grContext, RenderTarget, GRSurfaceOrigin.BottomLeft, SKColorType.Rgba8888);
        Canvas = surface.Canvas;

        Canvas.Flush();

        ResizeEvent();
    }

    protected override void OnUnload() {
        surface.Dispose();
        RenderTarget.Dispose();
        grContext.Dispose();
        grgInterface.Dispose();
        Canvas.Dispose();
        base.OnUnload();
    }

    double time = 0;
    protected override void OnRenderFrame(FrameEventArgs args) {
        Time.RawDeltaTime = (float)args.Time;

        time += args.Time;
        Canvas.Clear(SKColors.Black);
        
        Render();
        
        Canvas.Flush();
        SwapBuffers();
    }

    public virtual void Render() { }
    public virtual void ResizeEvent() { }
}
