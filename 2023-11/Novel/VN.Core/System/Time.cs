
namespace VN;

public class Time {
    public float DeltaTime {
        get => RawDeltaTime * TimeScale;
        set => RawDeltaTime = value;
    }

    public float TimeScale { get; set; } = 1;
    public float RawDeltaTime { get; set; }
}
