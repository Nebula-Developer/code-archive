public partial class Noise {
    public FastNoiseLite.CellularDistanceFunction CellularDistanceFunction { get => _cellularDistanceFunction; set => SetProperty(ref _cellularDistanceFunction, value, noise.SetCellularDistanceFunction); }
    private FastNoiseLite.CellularDistanceFunction _cellularDistanceFunction;

    public FastNoiseLite.CellularReturnType CellularReturnType { get => _cellularReturnType; set => SetProperty(ref _cellularReturnType, value, noise.SetCellularReturnType); }
    private FastNoiseLite.CellularReturnType _cellularReturnType;

    public float CellularJitter { get => _cellularJitter; set => SetProperty(ref _cellularJitter, value, noise.SetCellularJitter); }
    private float _cellularJitter;

    public float FractalWeightedStrength { get => _fractalWeightedStrength; set => SetProperty(ref _fractalWeightedStrength, value, noise.SetFractalWeightedStrength); }
    private float _fractalWeightedStrength;

    public FastNoiseLite.FractalType FractalType { get => _fractalType; set => SetProperty(ref _fractalType, value, noise.SetFractalType); }
    private FastNoiseLite.FractalType _fractalType;

    public float Lacunarity { get => _lacunarity; set => SetProperty(ref _lacunarity, value, noise.SetFractalLacunarity); }
    private float _lacunarity;

    public int Octaves { get => _octaves; set => SetProperty(ref _octaves, value, noise.SetFractalOctaves); }
    private int _octaves;

    public float Frequency { get => _frequency; set => SetProperty(ref _frequency, value, noise.SetFrequency); }
    private float _frequency;

    public float Gain { get => _gain; set => SetProperty(ref _gain, value, noise.SetFractalGain); }
    private float _gain;

    public FastNoiseLite.NoiseType NoiseType { get => _noiseType; set => SetProperty(ref _noiseType, value, noise.SetNoiseType); }
    private FastNoiseLite.NoiseType _noiseType;

    public int Seed { get => _seed; set => SetProperty(ref _seed, value, noise.SetSeed); }
    private int _seed;

    public FastNoiseLite.NoiseType Type { get => _type; set => SetProperty(ref _type, value, noise.SetNoiseType); }
    private FastNoiseLite.NoiseType _type;
}
