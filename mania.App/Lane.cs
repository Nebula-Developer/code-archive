using Natsu.Input;

namespace Mania;

public class Lane {
    public int Index;
    public Key Key;
    public List<Hitpoint> Hitpoints;

    public Lane(int index, Key key) {
        Index = index;
        Key = key;
        Hitpoints = new List<Hitpoint>();
    }
}
