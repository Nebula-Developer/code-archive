

// makes a grid based on zoom, pos, res, and maxIter
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

using Natsu.Graphics;
using Natsu.Graphics.Elements;
using Natsu.Input;
using Natsu.Mathematics;
using Natsu.Platforms.Desktop;
using Natsu.Platforms.Skia;

using SkiaSharp;

public class Vector2d {
    public double X { get; set; }
    public double Y { get; set; }

    public Vector2d(double x, double y) {
        X = x;
        Y = y;
    }

    public static Vector2d operator +(Vector2d a, Vector2d b) => new(a.X + b.X, a.Y + b.Y);
    public static Vector2d operator -(Vector2d a, Vector2d b) => new(a.X - b.X, a.Y - b.Y);
    public static Vector2d operator *(Vector2d a, double b) => new(a.X * b, a.Y * b);
    public static Vector2d operator /(Vector2d a, double b) => new(a.X / b, a.Y / b);
    public static Vector2d operator *(Vector2d a, Vector2d b) => new(a.X * b.X, a.Y * b.Y);
    public static Vector2d operator /(Vector2d a, Vector2d b) => new(a.X / b.X, a.Y / b.Y);
    public static Vector2d operator +(Vector2d a, double b) => new(a.X + b, a.Y + b);
    public static Vector2d operator -(Vector2d a, double b) => new(a.X - b, a.Y - b);
    public static Vector2d operator -(Vector2d a) => new(-a.X, -a.Y);

    public static bool operator ==(Vector2d a, Vector2d b) => a.X == b.X && a.Y == b.Y;
    public static bool operator !=(Vector2d a, Vector2d b) => a.X != b.X || a.Y != b.Y;

    public override bool Equals(object? obj) => obj is Vector2d vec && vec == this;
    public override int GetHashCode() => X.GetHashCode() ^ Y.GetHashCode();
}

public class ValueRect {
    public double Value { get; set; }
    public Vector2d Position { get; set; }
    public Vector2d Size { get; set; }

    public void Render(ICanvas canvas) {
        canvas.DrawRect(new((float)Position.X, (float)Position.Y, (float)Size.X, (float)Size.Y), new Paint() {
            Color = new Color((float)Value * 255, (float)Value * 255, (float)Value * 255),
            IsAntialias = false,
            FilterQuality = FilterQuality.High,
        });

        // canvas.DrawRect(new((float)Position.X, (float)Position.Y, (float)Size.X, (float)Size.Y), new Paint() {
        //     Color = Colors.Red,
        //     IsAntialias = true,
        //     FilterQuality = FilterQuality.High,
        //     IsStroke = true,
        //     StrokeWidth = 0.1f
        // });
    }

    public ValueRect(double value, Vector2d position, Vector2d size) {
        Value = value;
        Position = position;
        Size = size;
    }
}

public static class Mandelbrot {
    public static double[,] Generate(Vector2d center, double zoom, Vector2d resolution, int maxIter, int divide) {
        int width = (int)resolution.X;
        int height = (int)resolution.Y;

        double[,] grid = new double[width, height];

        Parallel.For(0, divide, i => {
            int startRow = height / divide * i;
            int endRow = (i == divide - 1) ? height : startRow + height / divide;
            ComputeSegment(grid, center, zoom, resolution, maxIter, startRow, endRow);
        });

        return grid;
    }

    private static void ComputeSegment(double[,] grid, Vector2d center, double zoom, Vector2d resolution, int maxIter, int startRow, int endRow) {
        int width = (int)resolution.X;

        for (int y = startRow; y < endRow; y++) {
            double scaledY = (y - resolution.Y / 2) / zoom + center.Y;

            for (int x = 0; x < width; x++) {
                double scaledX = (x - resolution.X / 2) / zoom + center.X;

                grid[x, y] = ComputePoint(scaledX, scaledY, maxIter);
            }
        }
    }

    private static double ComputePoint(double cx, double cy, int maxIter) {
        double zx = 0, zy = 0, zx2 = 0, zy2 = 0;

        for (int n = 0; n < maxIter; n++) {
            zx2 = zx * zx;
            zy2 = zy * zy;

            if (zx2 + zy2 > 16) {
                return (double)n / maxIter;
            }

            zy = 2 * zx * zy + cy;
            zx = zx2 - zy2 + cx;
        }

        return 1.0;
    }

    public static List<ValueRect> GenerateRects(double[,] grid, Vector2 resolution, int divide, double epsilon) {
        int width = (int)resolution.X;
        int height = (int)resolution.Y;

        List<ValueRect> rects = new();

        for (int i = 0; i < divide; i++) {
            int startRow = height / divide * i;
            int endRow = (i == divide - 1) ? height : startRow + height / divide;

            for (int y = startRow; y < endRow; y++) {
                int x = 0;

                while (x < width) {
                    double value = grid[x, y];
                    int startX = x;

                    while (x < width && Math.Abs(grid[x, y] - value) < epsilon) {
                        x++;
                    }

                    rects.Add(new ValueRect(value, new Vector2d(startX, y), new Vector2d(x - startX, 1)));
                }
            }
        }

        return rects;
    }
    

}

public class MandelbrotDisplay : Element {
    public Vector2d Center { get; set; } = new(0, 0);
    public float Zoom { get; set; } = 100;
    public int MaxIter { get; set; } = 100;

    private readonly object _lock = new object();
    private CancellationTokenSource? _renderCts;
    private IOffscreenSurface? surface;

    public bool NeedsRerender { get; private set; } = true;

    public float LastComputeTime = 0.2f;

    // Mark for rerender
    public void Invalidate() {
        lock (_lock) {
            NeedsRerender = true;
            _renderPoint++;
        }
    }

    private void StartRendering() {
        lock (_lock) {
            _renderCts?.Cancel();
            _renderCts = new CancellationTokenSource();
            var token = _renderCts.Token;

            Task.Run(() => Rerender(token), token);
        }
    }

    public void Rerender(CancellationToken token) {
        try {
            if (App?.Renderer == null || token.IsCancellationRequested)
                return;

            Stopwatch sw = Stopwatch.StartNew();

            var newGrid = Mandelbrot.Generate(Center, Zoom, new(DrawSize.X, DrawSize.Y), MaxIter, Environment.ProcessorCount);
            var rects = Mandelbrot.GenerateRects(newGrid, DrawSize, Environment.ProcessorCount, 0.01f);
            var nSurface = App.Renderer.CreateOffscreenSurface((int)DrawSize.X, (int)DrawSize.Y);
            var canvas = nSurface.Canvas;

            List<float> values = new();
            
            int chunkSize = rects.Count / Environment.ProcessorCount;
            List<List<ValueRect>> chunks = new();
            List<IOffscreenSurface> surfaces = new();
            for (int i = 0; i < rects.Count; i += chunkSize) {
                chunks.Add(rects.GetRange(i, Math.Min(chunkSize, rects.Count - i)));
                surfaces.Add(App.Renderer.CreateOffscreenSurface((int)DrawSize.X, (int)DrawSize.Y));
            }

            object _renderLock = new();

            foreach (var rect in rects) {
                if (token.IsCancellationRequested) throw new OperationCanceledException();
                rect.Render(canvas);

                values.Add((float)rect.Value);
            }

            nSurface.Flush();

            lock (_lock) {
                surface?.Dispose();
                surface = nSurface;
                NeedsRerender = false;
            }

            StopTransformSequences();

            Scale = Vector2.One;
            Position = Vector2.Zero;

            LastComputeTime = (float)sw.ElapsedMilliseconds / 1000;
        } catch (OperationCanceledException) {
            Console.WriteLine("Task was canceled");
        }
    }

    private int _renderPoint = 0, _currentPoint = 0;

    protected override void OnRender(ICanvas canvas) {
        base.OnRender(canvas);
        
        lock (_lock) {
            if (NeedsRerender && _renderPoint != _currentPoint) {
                StartRendering();
                _currentPoint = _renderPoint;
            }
        }

        if (surface != null) {
            canvas.DrawOffscreenSurface(surface, new(0, 0));
        }
    }
}

public class TestApp : Application {
    public MandelbrotDisplay Display { get; }
    public Element Wrapper { get; }

    public TextElement LastComputeTimeText, FPSText, PrecisionText;

    public TestApp() {
        Display = new MandelbrotDisplay() {
            RelativeSizeAxes = Axes.Both,
            OffsetPosition = new(0.5f),
            AnchorPosition = new(0.5f)
        };

        Wrapper = new() {
            RelativeSizeAxes = Axes.Both,
            ScaleAffectsDrawSize = false,
        };

        LastComputeTimeText = new TextElement() {
            Text = "Last Compute Time: 0ms",
            Position = new(10, 10),
            Paint = new() {
                Color = Colors.Red,
                TextSize = 20,
            }
        };

        FPSText = new TextElement() {
            Text = "FPS: 0",
            Position = new(10, 40),
            Paint = new() {
                Color = Colors.Red,
                TextSize = 20,
            }
        };

        PrecisionText = new TextElement() {
            Text = "Precision: 0",
            Position = new(10, 70),
            Paint = new() {
                Color = Colors.Red,
                TextSize = 20,
            }
        };

        Display.Invalidate();

        Add(Wrapper, LastComputeTimeText, FPSText, PrecisionText);
        Wrapper.Add(Display);


        Add(new RectElement() {
            RoundedCorners = new(5f),
            Size = new(5f),
            AnchorPosition = new(0.5f),
            OffsetPosition = new(0.5f),
            Paint = new() {
                IsAntialias = true,
                Color = Colors.Red,
            },
            Index = 999
        });
    }

    protected override void OnKeyDown(Key key) {
        base.OnKeyDown(key);

        if (Display.NeedsRerender) return;

        double moveAmount = 150 / Display.Zoom;
        float scaleAmount = 2f;

        Vector2d origPos = Display.Center;
        Ease easeType = Ease.CubicOut;

        switch (key) {
            case Key.W:
                Display.Center -= new Vector2d(0, moveAmount);
                break;
            case Key.S:
                Display.Center += new Vector2d(0, moveAmount);
                break;
            case Key.A:
                Display.Center -= new Vector2d(moveAmount, 0);
                break;
            case Key.D:
                Display.Center += new Vector2d(moveAmount, 0);
                break;
            
            case Key.Up:
                Display.Zoom *= scaleAmount;
                Display.StopTransformSequences(nameof(Display.Scale));
                Display.ScaleTo(new Vector2(scaleAmount), Display.LastComputeTime, easeType);
                break;
            case Key.Down:
                Display.Zoom /= scaleAmount;
                Display.StopTransformSequences(nameof(Display.Scale));
                Display.ScaleTo(new Vector2(1 / scaleAmount), Display.LastComputeTime, easeType);
                break;

            case Key.E:
                Display.MaxIter += 10;
                break;
            case Key.Q:
                Display.MaxIter -= 10;
                break;

            case Key.R:
                Wrapper.Scale /= 1.5f;
                break;
            case Key.T:
                Wrapper.Scale *= 1.5f;
                break;
            
            case Key.X:
                Display.Invalidate();
                break;
            default:
                return;
        }

        if (origPos != Display.Center) {
            Display.StopTransformSequences(nameof(Display.Position));

            float posX = origPos.X == Display.Center.X ? 0 : (float)(origPos.X - Display.Center.X);
            float posY = origPos.Y == Display.Center.Y ? 0 : (float)(origPos.Y - Display.Center.Y);

            posX *= Display.Zoom;
            posY *= Display.Zoom;

            Display.MoveTo(new Vector2(posX, posY), Display.LastComputeTime, easeType);
        }

        Display.Invalidate();
    }

    protected override void OnResize(int width, int height) {
        base.OnResize(width, height);
        Display.Invalidate();
    }

    protected override void OnUpdate() {
        base.OnUpdate();

        FPSText.Text = $"FPS: {Math.Round(1 / UpdateTime.DeltaTime)}";
        LastComputeTimeText.Text = $"Last Compute Time: {Math.Round(Display.LastComputeTime * 1000)}ms";
        
        double epsilon = 1 / Display.Zoom;
        double precision = -Math.Log10(epsilon);
        double accuracy = 100 - (precision / 16 * 100);

        double zoomPercent = Display.Zoom / 100;

        PrecisionText.Text = $"Precision: {precision:0.00} ({accuracy:0.00}%), Zoom: {zoomPercent:0.00}, Scale: {Wrapper.Scale.X:0.00}, Max Iter: {Display.MaxIter}";
    }

    private Vector2d _startPos = new(0, 0);

    protected override void OnMouseDown(MouseButton button, Vector2 position) {
        base.OnMouseDown(button, position);
        if (button != MouseButton.Left) return;
        _startPos = new(position.X, position.Y);
    }

    protected override void OnMouseMove(Vector2 position) {
        base.OnMouseMove(position);
        if (!MouseState.TryGetValue(MouseButton.Left, out bool x) || !x) return;

        Display.Center += new Vector2d(_startPos.X - position.X, _startPos.Y - position.Y) / (Display.Zoom * Wrapper.Scale.X);
        Vector2d pos = new(position.X, position.Y);
        Vector2d offset = (_startPos - pos) / Wrapper.Scale.X;
        Display.Position -= new Vector2((float)offset.X, (float)offset.Y);
        _startPos = pos;
    }

    protected override void OnMouseUp(MouseButton button, Vector2 position) {
        base.OnMouseUp(button, position);

        if (button == MouseButton.Right) {
            Display.Center = new Vector2d(0, 0);
            Display.Zoom = 100;
            Display.MaxIter = 100;
            Display.Invalidate();
        }

        if (button != MouseButton.Left) return;
        Display.Invalidate();
    }

    protected override void OnMouseWheel(Vector2 delta) {
        base.OnMouseWheel(delta);

        if (Display.NeedsRerender) return;

        float scaleAmount = 2f;

        if (delta.Y > 0) {
            Display.Zoom *= scaleAmount;
            Display.StopTransformSequences(nameof(Display.Scale));
            Display.ScaleTo(new Vector2(scaleAmount), Display.LastComputeTime, Ease.CubicOut);
        } else {
            Display.Zoom /= scaleAmount;
            Display.StopTransformSequences(nameof(Display.Scale));
            Display.ScaleTo(new Vector2(1 / scaleAmount), Display.LastComputeTime, Ease.CubicOut);
        }

        Display.Invalidate();
    }
}

public static class Program {
    public static void Main() {
        using var app = new TestApp();
        DesktopWindow window = new(app);
        window.Run();
    }
}
