using System.Collections.Generic;
using System.Linq;
using System;

namespace NSH.Shell {
    public class NShell {
        public int CursorY = 0;
        public List<Tuple<int, int, char>> TermChars = new List<Tuple<int, int, char>>();
        public Printer Print;

        public void SetChar(int x, int y, char c) {
            TermChars.RemoveAll(t => t.Item1 == x && t.Item2 == y);
            TermChars.Add(new Tuple<int, int, char>(x, y, c));
        }

        public void ClearCharacters() {
            TermChars.Clear();
        }

        public char GetChar(int x, int y) {
            return TermChars.Find(t => t.Item1 == x && t.Item2 == y)?.Item3 ?? ' ';
        }

        public void Init() {
            Console.Clear();
            ClearCharacters();
            for (int i = 0; i <= 20; i++) {
                this.Print.PrintLine(i.ToString() + " - " + Math.Pow(2, i).ToString());
                System.Threading.Thread.Sleep(10);
            }
        }

        public NShell() {
            this.Print = new Printer(this);
        }
    }
}