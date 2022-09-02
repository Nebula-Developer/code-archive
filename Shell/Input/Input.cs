using System.Collections.Generic;
using System;
using System.Text.RegularExpressions;

namespace NSH.Shell {
    public class Input {
        public Printer printer;
        public NShell hostShell;
        public static List<String> history = new List<String>();

        public Input(Printer printer, NShell hostShell) {
            this.printer = printer;
            this.hostShell = hostShell;
        }

        public static bool IsChar(char c) {
            return c >= ' ' && c <= '~';
        }

        public string ShortenDirectory(String dir) {
            // Convert a directory like: /this/is/my/folder
            // To: /t/i/m/folder

            String homePath = Environment.GetEnvironmentVariable("HOME") ?? "";

            string[] parts = dir.Replace(homePath, "~").Split('/');
            string result = "";
            for (int i = 0; i < parts.Length - 1; i++) {
                if (parts[i].Length > 0) {
                    result += parts[i][0];
                    if (i < parts.Length - 1) {
                        result += "/";
                    }
                }
            }

            result += parts[parts.Length - 1];
            if (result.Length == 0) result = "/";
            return result;
        }

        public static string ColorDirectory(String dir) {
            String[] parts = dir.Split('/');
            string result = GREY;
            for (int i = 0; i < parts.Length - 1; i++) {
                if (parts[i].Length > 0) {
                    result += parts[i];
                    if (i < parts.Length - 1) {
                        result += "/";
                    }
                }
            }

            result += GREEN + parts[parts.Length - 1];
            if (parts[0].Length == 0) result = RED + "/";
            result += RESET;
            return result;
        }

        public virtual string Prefix() {
            return ShortenDirectory(Directory.GetCurrentDirectory()) + "> ";
        }

        public virtual string ColorPrefix() {
            return GREENALT + ColorDirectory(ShortenDirectory(Directory.GetCurrentDirectory())) + RESET + "> ";
        }

        public static string GREY = "\x1b[38;5;242m";
        public static string RESET = "\x1b[0m";
        public static string RED = "\x1b[31m";
        public static string GREEN = "\x1b[32m";
        public static string YELLOW = "\x1b[33m";
        public static string BLUE = "\x1b[34m";
        public static string MAGENTA = "\x1b[35m";
        public static string CYAN = "\x1b[36m";
        public static string WHITE = "\x1b[37m";
        public static string BOLD = "\x1b[1m";
        public static string UNDERLINE = "\x1b[4m";
        public static string BLINK = "\x1b[5m";
        public static string GREENALT = "\x1b[38;5;46m";

        private string InputLoop() {
            string input = "";
            int y = Console.CursorTop;
            int x = 0;

            String oldStr = "";
            printer.Print(ColorPrefix(), 0, y);

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
                        } else {
                            String? complete = Autocomplete.SearchAutocomplete(input, x);
                            if (complete == null) break;
                            String[] split = input.Split(" ");
                            String end = split[split.Length - 1];
                            input = input.Substring(0, input.Length - end.Length);
                            input += complete;
                            x = input.Length;
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

                    case ConsoleKey.Tab:
                        
                        break;
                }

                if (key.Key == ConsoleKey.Enter) {
                    break;
                } else if (IsChar(key.KeyChar)) {
                    input = input.Insert(x, key.KeyChar.ToString());
                    x++;
                }

                String autocomplete = Autocomplete.SearchAutocomplete(input, x) ?? "";
                int splitVal = autocomplete.Split(" ").Length;
                Console.WriteLine("\n" + splitVal);
                String inputEndSplit = input.Split(" ")[input.Split(" ").Length - 1];
                if (inputEndSplit.Length < autocomplete.Length) {
                    if (autocomplete.Split(" ").Length > 1) {
                        // hello w|hello world
                        // =>
                        // hello w|orld
                        autocomplete = autocomplete.Substring(input.Length);
                    } else {
                        autocomplete = autocomplete.Substring(inputEndSplit.Length);
                    }
                } else {
                    autocomplete = "";
                }

                String mainStr = input + GREY + autocomplete + RESET;
                int diff = oldStr.Length - mainStr.Length;
                String spaces = new String(' ', diff < 0 ? 0 : diff);

                printer.Print(ColorPrefix() + mainStr + spaces, 0, y);
                oldStr = mainStr;
                Console.SetCursorPosition(x + Prefix().Length, y);
            }

            int diffEnd = oldStr.Length - input.Length;
            String spacesEnd = new String(' ', diffEnd < 0 ? 0 : diffEnd);

            printer.Print(ColorPrefix() + input + spacesEnd, 0, y);
            Console.SetCursorPosition(x + Prefix().Length, y);
            Console.WriteLine();
            history.Add(input);
            return input;
        }

        public string FetchInput() {
            string input = InputLoop();
            return input;
        }
    }
}