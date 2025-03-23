using Natsu.Input;

namespace Mania;

public struct Map {
    public List<Lane> Lanes = new();

    public static Dictionary<int, Key[]> DefaultKeyMap = new() {
        { 1, new[] { Key.Space } },
        { 2, new[] { Key.F, Key.J } },
        { 3, new[] { Key.F, Key.Space, Key.J } },
        { 4, new[] { Key.D, Key.F, Key.J, Key.K } },
        { 5, new[] { Key.D, Key.F, Key.Space, Key.J, Key.K } },
        { 6, new[] { Key.S, Key.D, Key.F, Key.J, Key.K, Key.L } },
        { 7, new[] { Key.S, Key.D, Key.F, Key.Space, Key.J, Key.K, Key.L } },
        { 8, new[] { Key.A, Key.S, Key.D, Key.F, Key.J, Key.K, Key.L, Key.Semicolon } },
    };

    public Map(int laneCount = 4) {
        for (int i = 0; i < laneCount; i++) Lanes.Add(new Lane(i, Key.Unknown));
        AssignDefaultKeymap();
    }

    public void AssignDefaultKeymap() {
        for (int i = 0; i < Lanes.Count; i++) {
            if (i >= DefaultKeyMap.Count) break;
            Lanes[i].Key = DefaultKeyMap[Lanes.Count][i];
        }
    }
}
