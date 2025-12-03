namespace NexusPort.Graphics;

public class InvertFilter : Filter {
    public override void Handle(ref Pixel p, int x, int y) {
        p.BG = new RGB(255 - p.BG.R, 255 - p.BG.G, 255 - p.BG.B);
        p.FG = new RGB(255 - p.FG.R, 255 - p.FG.G, 255 - p.FG.B);
    }
}
