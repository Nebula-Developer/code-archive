using System.Collections.Generic;
using System;

namespace NSH.Shell {
    public class Input {
        public Printer printer;
        public NShell hostShell;

        public Input(Printer printer, NShell hostShell) {
            this.printer = printer;
            this.hostShell = hostShell;
        }

        public static bool IsChar(char c) {
            return c >= ' ' && c <= '~';
        }

        private string InputLoop() {
            string input = "";
            int y = Console.CursorTop;
            int x = 0;

            String prefix = Directory.GetCurrentDirectory() + "$ ";

            printer.Print(prefix, 0, y);
            String oldStr = "";

            while (true) {
                ConsoleKeyInfo key = Console.ReadKey(true);

                switch (key.Key) {
                    case ConsoleKey.LeftArrow:
                        if (x > 0) {
                            x--;
                            Console.SetCursorPosition(x, y);
                        }
                        break;

                    case ConsoleKey.RightArrow:
                        if (x < input.Length) {
                            x++;
                            Console.SetCursorPosition(x, y);
                        }
                        break;

                    case ConsoleKey.Backspace:
                        if ((key.Modifiers & ConsoleModifiers.Control) != 0) {
                            if (x > 0) {
                                input = input.Remove(x - 1, 1);
                                x--;
                                Console.SetCursorPosition(x, y);
                                Console.Write(" ");
                                Console.SetCursorPosition(x, y);
                            }
                        } else {
                            if (x > 0) {    
                                input = input.Remove(x - 1, 1);
                                x--;
                            }
                        }
                        break;
                }

                if (key.Key == ConsoleKey.Enter) {
                    break;
                } else if (IsChar(key.KeyChar)) {
                    input = input.Insert(x, key.KeyChar.ToString());
                    x++;
                }

                String prefixStr = prefix + input;
                int diff = oldStr.Length - prefixStr.Length;
                String spaces = new String(' ', diff < 0 ? 0 : diff);

                printer.Print(prefixStr + spaces, 0, y);
                oldStr = prefixStr;
                Console.SetCursorPosition(x + prefix.Length, y);
                prefix = Directory.GetCurrentDirectory() + "$ ";
            }
            printer.AppendLine();
            return input;
        }

        public string FetchInput() {
            string input = InputLoop();
            return input;
        }
    }
}