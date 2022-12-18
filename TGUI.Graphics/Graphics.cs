
namespace TGUI.Graphics;

public static class Graph {

}

public static class Text {
    public static void WriteAtPos(string text, Vector2i position, bool returnToPosition = false) {
        if (returnToPosition) Cursor.SavePosition();
        Cursor.SetPosition(position);
        Console.Write(text);
        if (returnToPosition) Cursor.LoadPosition();
    }
}

public static class Cursor {
    public static void SetPosition(Vector2i position) {
        Console.Write("\u001b[{0};{1}H", position.y, position.x);
    }

    public static void SetPosition(int x, int y) {
        Console.Write("\u001b[{0};{1}H", y, x);
    }

    public static void SavePosition() {
        Console.Write("\u001b[s");
    }

    public static void LoadPosition() {
        Console.Write("\u001b[u");
    }

    public static Vector2i GetPosition() {
        return new Vector2i(Console.CursorLeft, Console.CursorTop);
    }
}

public static class Math {
    public static double Lerp(double from, double to, double t) {
        return from + (to - from) * t;
    }
}
