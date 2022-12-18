
namespace TGUI.Graphics;

public class RGB {
    public int R, G, B;

    public RGB(int r, int g, int b) {
        this.R = r;
        this.G = g;
        this.B = b;
    }

    public string ToESC() {
        return $"\x1b[38;2;{R};{G};{B}m";
    }

    public string ToBGEsc() {
        return $"\x1b[48;2;{R};{G};{B}m";
    }

    public static string ToESC(int r, int g, int b) {
        return $"\x1b[38;2;{r};{g};{b}m";
    }

    public static string ToBGEsc(int r, int g, int b) {
        return $"\x1b[48;2;{r};{g};{b}m";
    }

    public static RGB Fade(RGB from, RGB to, double t) {
        return new RGB(
            (int) Math.Lerp(from.R, to.R, t),
            (int) Math.Lerp(from.G, to.G, t),
            (int) Math.Lerp(from.B, to.B, t)
        );
    }
}

public class Colors {
    public static string RESET = "\x1b[0m";
}

public class Passthrough {
    public RGB[] Layers;
    public int height = 10;
    public int width = 10;

    public Passthrough(params RGB[] layers) {
        this.Layers = layers;
    }

    public string Generate() {
        // Fade through to gen 2 axis gradient spectrum
        // 4 axis = each corner solid
        // 8 = ever side solid

        string str = "";

        if (Layers.Length == 4) {
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (x == 0 && y == 0) {
                        str += Layers[0].ToBGEsc() + " " + Colors.RESET;
                        continue;
                    }
                    if (x == width - 1 && y == 0) {
                        str += Layers[1].ToBGEsc() + " " + Colors.RESET;
                        continue;
                    }
                    if (x == 0 && y == height - 1) {
                        str += Layers[2].ToBGEsc() + " " + Colors.RESET;
                        continue;
                    }
                    if (x == width - 1 && y == height - 1) {
                        str += Layers[3].ToBGEsc() + " " + Colors.RESET;
                        continue;
                    }

                    RGB output = RGB.Fade(
                        RGB.Fade(Layers[0], Layers[1], (double) y / height),
                        RGB.Fade(Layers[2], Layers[3], (double) y / height),
                        (double) x / width
                    );

                    str += output.ToBGEsc() + " " + Colors.RESET;
                }

                str += "\n";
            }
        } else if (Layers.Length == 8) {
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    RGB output = RGB.Fade(
                        RGB.Fade(
                            RGB.Fade(Layers[0], Layers[1], (double) y / height),
                            RGB.Fade(Layers[2], Layers[3], (double) y / height),
                            (double) x / width
                        ),
                        RGB.Fade(
                            RGB.Fade(Layers[4], Layers[5], (double) y / height),
                            RGB.Fade(Layers[6], Layers[7], (double) y / height),
                            (double) x / width
                        ),
                        (double) y / height
                    );

                    str += output.ToBGEsc() + " " + Colors.RESET;
                }

                str += "\n";
            }
        } else {
            // Linear gradient
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    for (int i = 0; i < Layers.Length; i++) {
                        // point around 6 off (int)
                        int layerindex = (int) Math.Lerp(0, Layers.Length - 1, (double) x / width);
                        RGB output = RGB.Fade(Layers[layerindex], Layers[layerindex + 1], (double) x / width);

                        str += output.ToBGEsc() + " " + Colors.RESET;

                        break;

                    }
                }

                str += "\n";
            }
        }


        return str;
    }
}