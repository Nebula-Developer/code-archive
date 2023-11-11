using OpenTK.Mathematics;

namespace VN;

public class Character : Element {
    public string DisplayName;
    public Dictionary<string, Pose> Poses;
    public string CurrentPose;

    public override void Render(Novel novel) {
        base.Render(novel);

        if (!Visible || Poses == null || !Poses.ContainsKey(CurrentPose))
            return;

        Pose pose = Poses[CurrentPose];   
    }
}

public class Characters : Dictionary<int, Character> {
    private int _idCount = 0;
    public int Add(Character character) {
        int id = _idCount++;
        this.Add(id, character);
        return id;
    }
}
