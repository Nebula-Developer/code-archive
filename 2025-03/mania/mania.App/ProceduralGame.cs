using Natsu.Core;
using Natsu.Mathematics;

namespace Mania;

public class ProceduralGame : Element {
    public Map Map { get; private set; } = default;
    public Game Game { get; private set; } = null!;

    protected override void OnLoad() {
        Map = new Map(4);
        Game = new(Map) {
            RelativeSizeAxes = Axes.Both
        };
        Game.NoteScale = 900f;

        Add(Game);
    }

    protected override void OnUpdate(double deltaTime) {
        for (int lane = 0; lane < Map.Lanes.Count; lane++) {
            float endTime = (Map.Lanes[lane].Hitpoints.LastOrDefault()?.Time + Map.Lanes[lane].Hitpoints.LastOrDefault()?.Length) ?? Game.Time + 1f;
            if (Map.Lanes[lane].Hitpoints.Count < 30) {
                Map.Lanes[lane].Hitpoints.AddRange(MakeRandomHitpoints(30 - Map.Lanes[lane].Hitpoints.Count, endTime));
            }
        }
    }
    public List<Hitpoint> MakeRandomHitpoints(int count, float time = 0) {
        List<Hitpoint> hitpoints = new List<Hitpoint>();

        for (int i = 0; i < count; i++) {
            float length = (float)Random.Shared.NextDouble();
            if (length < 0.75f) {
                length = 0;
            } else {
                length = ((float)Random.Shared.NextDouble() * 2) + 0.1f;
            }

            time += (float)Random.Shared.NextDouble() * 2 + 0.1f;
            hitpoints.Add(new Hitpoint(time, length));
            time += length;
        }

        hitpoints.Sort((a, b) => a.Time.CompareTo(b.Time));
        return hitpoints;
    }
}
