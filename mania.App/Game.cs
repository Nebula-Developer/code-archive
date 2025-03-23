using Natsu.Core;
using Natsu.Core.Elements;
using Natsu.Mathematics;

namespace Mania;

public class Game : Element {
    public Map Map { get; }
    public List<LaneElement> LaneElements { get; } = new List<LaneElement>();

    /// <summary>
    /// The current progress in the map.
    /// </summary>
    public float Time { get; set; } = 0f;

    /// <summary>
    /// The scale that time progresses.
    /// </summary>
    public float TimeScale { get; set; } = 1f;

    /// <summary>
    /// The scale of notes.
    /// </summary>
    public float NoteScale { get; set; } = 500f;

    public ScalePreserveContainer LaneContainer { get; } = new(new(1, 700)) {
        Pivot = new(0.5f)
    };

    public Game(Map map) {
        Map = map;

        Add(LaneContainer);
        LaneContainer.ContentWrapper.ChildRelativeSizeAxes = Axes.X;

        for (int i = 0; i < Map.Lanes.Count; i++) {
            var lane = new LaneElement(this, i);
            LaneElements.Add(lane);
            LaneContainer.AddContent(lane);
        }
    }

    protected override void OnUpdate(double deltaTime) => Time += (float)(deltaTime * TimeScale);
}
