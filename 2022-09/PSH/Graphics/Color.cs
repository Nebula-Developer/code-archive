using System;

namespace PSH.Graphics {
    public class RGB {
        public int R, G, B;

        public RGB(int r, int g, int b) {
            this.R = r;
            this.G = g;
            this.B = b;
        }

        public string ToEscape() {
            return $"\x1b[38;2;{this.R};{this.G};{this.B}m";
        }

        public static string CreateEsc(int r, int g, int b) {
            return $"\x1b[38;2;{r};{g};{b}m";
        } 

        public string ToHexStr() {
            return $"#{this.R:X2}{this.G:X2}{this.B:X2}";
        }
    }

    public class Hex {
        public string HexStr;

        public Hex(string hex) {
            this.HexStr = hex;
        }

        public RGB ToRGB() {
            return new RGB(
                Convert.ToInt32(this.HexStr.Substring(1, 2), 16),
                Convert.ToInt32(this.HexStr.Substring(3, 2), 16),
                Convert.ToInt32(this.HexStr.Substring(5, 2), 16)
            );
        }
    }
}