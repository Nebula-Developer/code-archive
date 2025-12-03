public partial class Noise {
    public FastNoiseLite noise { get; private set; }

    public float GetNoise(float x) => noise.GetNoise(x, 0);
    public float GetNoise(float x, float y) => noise.GetNoise(x, y);
    
    public float[] GetNoiseRange(float x1, float x2) {
        int width = (int)Math.Abs(x2 - x1);
        float[] list = new float[width];
        for (int i = 0; i < width; i++) {
            list[i] = GetNoise(x1 + i);
        }
        return list;
    }

    public float[,] GetNoiseRange(float x1, float x2, float y1, float y2) {
        int width = (int)Math.Abs(x2 - x1);
        int height = (int)Math.Abs(y2 - y1);
        float[,] list = new float[width, height];
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                list[x, y] = GetNoise(x1 + x, y1 + y);
            }
        }
        return list;
    }

    public Noise(int seed = 1000) {
        noise = new FastNoiseLite();
        Seed = seed;
    }

    private void SetProperty<T>(ref T field, T value, Action<T> setter) {
        field = value;
        setter(value);
    }
}
