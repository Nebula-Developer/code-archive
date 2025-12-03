namespace NexusPort.Graphics;

public class GrayscaleFilter : Filter {
    public override void Handle(ref Pixel p, int x, int y) {
        int avgBG = (int)MathF.Round((p.BG.R + p.BG.G + p.BG.B) / 3f);
        int avgFG = (int)MathF.Round((p.BG.R + p.BG.G + p.BG.B) / 3f);

        p.BG = new RGB(avgBG, avgBG, avgBG);
        p.FG = new RGB(avgFG, avgFG, avgFG);
    }
}
