namespace NexusPort.Graphics;

public class PixelMap {
    public Pixel[,] Pixels { get; private set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public int X { get; set; }
    public int Y { get; set; }

    public int ApplyXOffset { get; set; }
    public int ApplyYOffset { get; set; }

    public void SetPixel(int x, int y, Pixel p) {
        int nX = x + ApplyXOffset;
        int nY = y + ApplyYOffset;
        if (nX >= 0 && nX < Width && nY >= 0 && nY < Height)
            Pixels[nX, nY] = p;
    }

    public PixelMap(int width, int height) {
        Width = width;
        Height = height;
        Pixels = new Pixel[Width, Height];
        Clear();
    }

    public PixelMap(int width, int height, int x, int y) {
        Width = width;
        Height = height;
        X = x;
        Y = y;
        Pixels = new Pixel[Width, Height];
        Clear();
    }

    public PixelMap Clone() {
        PixelMap map = new PixelMap(Width, Height, X, Y);
        map.Pixels = (Pixel[,])Pixels.Clone();
        return map;
    }

    public void Clear(Pixel p) {
        for (int x = 0; x < Width; x++)
            for (int y = 0; y < Height; y++)
                Pixels[x, y] = p;
    }

    public void Clear() => Clear(new Pixel(new RGB()));

    public void ModifyRange(int x, int y, int endX, int endY, Pixel p) {
        for (int i = x; i < endX; i++)
            for (int j = y; j < endY; j++)
                SetPixel(x, y, p);
    }

    public void ModifyRange(int x, int y, int endX, int endY, Func<Pixel, int, int, Pixel> modifier) {
        for (int i = x; i < endX; i++)
            for (int j = y; j < endY; j++)
                SetPixel(i, j, modifier(Pixels[i, j], i, j));
    }

    public void ModifyRingRange(int x, int y, int endX, int endY, Pixel p) {
        for (int i = x; i < endX; i++) {
            SetPixel(i, y, p);
            SetPixel(i, endY, p);
        }

        for (int j = y; j < endY; j++) {
            SetPixel(x, j, p);
            SetPixel(endX, j, p);
        }
    }

    public void ModifyRingRange(int x, int y, int endX, int endY, Func<Pixel, int, int, Pixel> modifier) {
        for (int i = x; i < endX; i++) {
            SetPixel(i, y, modifier(Pixels[i, y], i, y));
            SetPixel(i, endY, modifier(Pixels[i, endY], i, endY));
        }

        for (int j = y; j < endY; j++) {
            SetPixel(x, j, modifier(Pixels[x, j], x, j));
            SetPixel(endX, j, modifier(Pixels[endX, j], endX, j));
        }
    }
}
