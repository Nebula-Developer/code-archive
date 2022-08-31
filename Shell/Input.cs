using System.Collections.Generic;
using System;
using System.Net;
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

        public virtual string Prefix() {
            String user = Environment.UserName;
            String host = Environment.MachineName;
            return user + "@" + host + " " + Directory.GetCurrentDirectory() + " $ ";
        }

        private string InputLoop() {
            string input = "";
            int y = Console.CursorTop;
            int x = 0;

            String prefix = Prefix();

            printer.Print(prefix, 0, y);
            String oldStr = "";

            while (true) {
                ConsoleKeyInfo key = Console.ReadKey(true);
                prefix = Prefix();

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
                        if (x > 0) {    
                            input = input.Remove(x - 1, 1);
                            x--;
                        }
                        break;

                    case ConsoleKey.Home:
                        x = 0;
                        break;
                    
                    case ConsoleKey.End:
                        x = input.Length;
                        break;
                }

                if ((int)key.KeyChar == 23) {
                    if (x > 0) {
                        if (input[x - 1] == ' ') {
                            input = input.Remove(x - 1, 1);
                            x--;
                        } else {
                            // Keep deleting until we hit a space
                            while (x > 0 && input[x - 1] != ' ') {
                                input = input.Remove(x - 1, 1);
                                x--;
                            }
                        }
                    }
                } else if ((int)key.KeyChar == 21) {
                    if (x > 0) {
                        while (x > 0) {
                            input = input.Remove(x-- - 1, 1);
                        }
                    }
                }

                List<Tuple<String, String>> CharPairs = new List<Tuple<String, String>>() {
                    new Tuple<String, String>("(", ")"),
                    new Tuple<String, String>("[", "]"),
                    new Tuple<String, String>("{", "}"),
                    new Tuple<String, String>("\"", "\""),
                    new Tuple<String, String>("'", "'"),
                    new Tuple<String, String>("`", "`"),
                    new Tuple<String, String>("<", ">")
                };

                if (key.Key == ConsoleKey.Enter) {
                    break;
                } else if (IsChar(key.KeyChar)) {
                    bool IsPair = false;

                    foreach(Tuple<String, String> Pair in CharPairs) {
                        if (key.KeyChar.ToString() == Pair.Item1) {
                            IsPair = true;
                            input = input.Insert(x++, Pair.Item1 + Pair.Item2);
                            break;
                        }
                    }

                    if (!IsPair)
                        input = input.Insert(x++, key.KeyChar.ToString());
                }

                String prefixStr = prefix + input;
                int diff = oldStr.Length - prefixStr.Length;
                String spaces = new String(' ', diff < 0 ? 0 : diff);

                printer.Print(prefixStr + spaces, 0, y);
                oldStr = prefixStr;
                Console.SetCursorPosition(x + prefix.Length, y);
                prefix = Directory.GetCurrentDirectory() + "$ ";
            }

            Console.Write("\n");
            return input;
        }

        public string FetchInput() {
            string input = InputLoop();
            return input;
        }
    }
}