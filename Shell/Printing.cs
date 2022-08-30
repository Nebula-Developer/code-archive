using System.Collections.Generic;
using System;
using NSH.Shell;

namespace NSH.Shell {
    public class Printer {
        public NShell shell;

        public void AppendLine() {

        }

        public void FixNewLine() {
            if (Console.CursorTop >= Console.BufferHeight) {
                Console.Write('\n');
            }
        }

        public void Print(string line, int x = 0, int y = -1) {
            if (x < 0) {
                x = 0;
            }

            if (y == -1) {
                y = Console.CursorTop;
            }

            FixNewLine();
            Console.SetCursorPosition(x, y);
            Console.Write(line);

            for (int i = 0; i < line.Length; i++) {
                shell.SetChar(x + i, y, line[i]);
            }
        }

        public void PrintLine(string line, int x = -1, int y = -1) {
            Print(line, x, y);
            AppendLine();
        }

        public Printer(NShell shell) {
            this.shell = shell;
        }
    }
}