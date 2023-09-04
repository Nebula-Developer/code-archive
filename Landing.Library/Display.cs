namespace Landing.Library.Graphics;

public static class Display {
    public static Screen? CurrentScreen { get; set; }

    public static void Draw() {
        CurrentScreen?.Draw();
    }
}
