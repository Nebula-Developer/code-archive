namespace Landing.Library.Graphics;

public class PixelMap {
    public Pixel[,] Pixels { get; private set; }

    public void SetPixel(int x, int y, Pixel? p = null) {
        if (x >= 0 && x < Width && y >= 0 && y < Height) {
            Pixels[x, y] = p ?? new Pixel();
        }
    }

    public int Width { get; set; }
    public int Height { get; set; }
    
    public PixelMap(int width, int height) {
        Width = width;
        Height = height;
        Pixels = new Pixel[width, height];
        this.ClearPixels();
    }

    public void ClearPixels() {
        Pixels = new Pixel[Width, Height];
        for (int x = 0; x < Width; x++) {
            for (int y = 0; y < Height; y++) {
                Pixels[x, y] = new Pixel();
            }
        }
    }
}