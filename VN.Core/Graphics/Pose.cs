using OpenTK.Mathematics;
using SkiaSharp;

namespace VN;

public class PoseFragment {
    public SKImage Image;
    public Vector2 Offset;

    public PoseFragment(SKImage image, Vector2 offset) {
        Image = image;
        Offset = offset;
    }
}

public class Pose {
    public List<PoseFragment> Fragments;

    public Pose(List<PoseFragment> fragments) => Fragments = fragments;
    public Pose(params string[] paths) {
        Fragments = new List<PoseFragment>();

        foreach (string path in paths)
            Fragments.Add(new PoseFragment(SKImage.FromEncodedData(path), Vector2.Zero));
    }
}
