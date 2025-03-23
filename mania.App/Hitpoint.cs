namespace Mania;

public class Hitpoint {
    public float Time; // The time where the hitpoint is
    public float Length; // 0 is a hit, anything else is a hold
    public bool IsHit => Length == 0; // Is this a hit or a hold?

    public Score Score = Score.Miss;
    public bool HasHit;

    public Hitpoint(float time, float length) {
        Time = time;
        Length = length;
    }

    public override int GetHashCode() => Time.GetHashCode() ^ Length.GetHashCode();
    public override bool Equals(object? obj) {
        if (obj is Hitpoint other) {
            return Time == other.Time && Length == other.Length;
        }
        return false;
    }
}
