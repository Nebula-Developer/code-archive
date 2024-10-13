
using System.Diagnostics;
using System.Numerics;

using engine.Framework.Graphics.Containers;

using engine.Framework.Graphics.Renderers;

using OpenTK.Graphics.OpenGL;

using SkiaSharp;

namespace engine.Framework.Graphics;


public abstract partial class Application {
    public IRenderer Renderer {
        get {
            if (_renderer == null)
                throw new InvalidOperationException("Application renderer is null.");
            return _renderer;
        }
        private set => SetRenderer(value);
    }
    private IRenderer? _renderer = new EmptyRenderer();


    public SKCanvas Canvas {
        get {
            if (Renderer.Surface == null)
                throw new InvalidOperationException("Renderer surface is null.");
            return Renderer.Surface.Canvas;
        }
    }

    public IBackendLoader BackendLoader { get; set; } = new MultithreadedBackendLoader(Math.Max(Environment.ProcessorCount - 1, 4));
    // public IBackendLoader BackendLoader { get; set; } = new BackendLoader();


    public void SetRenderer(IRenderer renderer) => (_renderer = renderer).Load();
    public void Flush() => Renderer.Flush();

    public RootElement Root { get; }

    public Application() {
        // // add 100 random rects
        // CachedContainer cache = new() { Size = new(300) };
        // Root = new RootElement(this);
        // Root.Add(cache);
        // for (int i = 0; i < 1000; i++) {
        //     cache.Add(new RectElement {
        //         Size = new Vector2(new Random().Next(0, 600), new Random().Next(0, 400)),
        //         Position = new Vector2(new Random().Next(0, 600), new Random().Next(0, 400)),
        //         Color = new SKColor(
        //             (byte)new Random().Next(0, 255),
        //             (byte)new Random().Next(0, 255),
        //             (byte)new Random().Next(0, 255),
        //             (byte)50
        //         ),
        //         Rotation = new Random().Next(0, 360)
        //     });
        // }

        // Root.Add(new RectElement {
        //     Size = new Vector2(100, 100),
        //     Position = new Vector2(100, 100),
        //     Color = SKColors.Blue
        // });

        // Root.Add(new CircularProgressElement {
        //     Size = new Vector2(100, 100),
        //     Position = new Vector2(200, 200),
        //     Progress = 0.25f
        // });

        // calc the size of 1920x1080 skimage filled white
            Stopwatch sw = Stopwatch.StartNew();
            List<SKCanvas> canvases = new();
        for (int i = 0; i < 100; i++) {
            SKImageInfo info = new(1920, 1080);
            SKSurface surface = SKSurface.Create(info);
            SKCanvas canvas = surface.Canvas;
            canvas.Clear(SKCoors.White);
            canvas.to
            canvases.Add(canvas);
        }
            Console.WriteLine($"Took {sw.ElapsedMilliseconds}ms to create a 1920x1080 white image.");
    }

    public Matrix Matrix = new();
    public Matrix ChildMatrix = new();

    public void Render() {
        Canvas.SetMatrix(Matrix);
        Canvas.Clear();
        Canvas.DrawRect(0, 0, 100, 100, new SKPaint { Color = SKColors.Blue });
        Canvas.SetMatrix(ChildMatrix);
        Canvas.DrawRect(0, 0, 50, 50, new SKPaint { Color = SKColors.Red });
        // Root.Render(Canvas);
        // Canvas.ResetMatrix();

        pRot += .05f;
        cRot += .05f;

        Matrix.Reset();
        ChildMatrix.Reset();

        Matrix.Rotate(pRot, 0, 0);
        Matrix.Translate(100, 100);

        SKPoint basePoint = Matrix.MapPoint(new SKPoint(100, 100));
        
        ChildMatrix.Rotate(-pRot, 0, 0);
        ChildMatrix.Rotate(cRot, 25, 25);
        ChildMatrix.Translate(basePoint.X, basePoint.Y);
    }

    float pRot = 0;
    float cRot = 0;

    public event EventHandler? OnResize;
    public void Resize(int width, int height) {
        Renderer.Resize(width, height);
        _size = new(width, height);
        OnResize?.Invoke(this, EventArgs.Empty);
    }

    public Vector2 Size {
        get => _size;
        set => Resize((int)value.X, (int)value.Y);
    }
    private Vector2 _size = new(600, 400);
}

public class RootElement : CompositeElement { // The root element of the application
    public override void Render(SKCanvas canvas) {
        canvas.Clear(SKColors.Transparent);
        canvas.DrawRect(new SKRect(15, 15, Size.X - 15, Size.Y - 15), new SKPaint {
            Style = SKPaintStyle.Stroke,
            StrokeWidth = 5,
            IsAntialias = true,
            FilterQuality = SKFilterQuality.High,
            Shader = SKShader.CreateLinearGradient(
                new SKPoint(0, 0),
                new SKPoint(Size.X, Size.Y),
                new[] { SKColors.Red, SKColors.Blue },
                new float[] { 0, 1 },
                SKShaderTileMode.Clamp
            )
        });

        base.Render(canvas);
    }

    public override Application? Application => _app;
    private readonly Application? _app;

    public RootElement(Application app) {
        _app = app;
        app.OnResize += (sender, args) => {
            Size = app.Size;
            foreach (Element element in Children)
                element.Invalidate(Invalidation.Size | Invalidation.Size, InvalidationSource.Self);
        };
        Size = app.Size;
    }
}

public class RectElement : Element { // A rectangle element
    public Vector2 Size { get; set; } = new();
    public SKColor Color { get; set; } = SKColors.Black;

    public override void Render(SKCanvas canvas) {
        canvas.SetMatrix(Transform);
        canvas.DrawRect(new SKRect(0, 0, Size.X, Size.Y), new SKPaint {
            Color = Color,
            Style = SKPaintStyle.Fill,
            StrokeWidth = 5,
            IsAntialias = true,
            FilterQuality = SKFilterQuality.High
        });
        canvas.ResetMatrix();
    }
}

// a circular progress bar that can fill up with a solid radial fill of white
public class CircularProgressElement : Element {
    public Vector2 Size { get; set; } = new();
    public float Progress { get; set; } = 0;

    public override void Render(SKCanvas canvas) {
        canvas.SetMatrix(Transform);
        canvas.DrawArc(new SKRect(0, 0, Size.X, Size.Y), 0, Progress * 360, true, new SKPaint {
            Color = SKColors.White,
            Style = SKPaintStyle.Fill,
            FilterQuality = SKFilterQuality.High,
            IsAntialias = true
        });
        canvas.ResetMatrix();
        Progress = MathF.Min(DateTime.Now.Millisecond / 1000f, 1);
    }
}