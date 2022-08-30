using System.Collections.Generic;
using System;
using NSH.Shell;

namespace NSH.Shell {
    public class Printer {
        public NShell shell;

        public void AppendLine() {
            shell.CursorY++;
            if (shell.CursorY >= Console.BufferHeight) {
                shell.CursorY = Console.BufferHeight;
            }
        }

        public void FixNewLine() {
            if (shell.CursorY >= Console.BufferHeight) {
                int oldX = Console.CursorLeft;
                int oldY = Console.CursorTop;
                Console.SetCursorPosition(0, shell.CursorY);
                Console.Write('\n');
                Console.SetCursorPosition(oldX, oldY - 1);
            }
        }

        public void Print(string line, int x = 0, int y = -1) {
            if (x < 0) {
                x = 0;
            }

            if (y == -1) {
                y = shell.CursorY;
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