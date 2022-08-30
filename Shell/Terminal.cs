using System.Collections.Generic;
using System.Linq;
using System;
using System.Diagnostics;

namespace NSH.Shell {
    public class NShell {
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
            ClearCharacters();
            
            while (true) {
                Input input = new Input(Print, this);
                string line = input.FetchInput();

                if (line.Split(" ")[0] == "exit") break;

                // Execute while capturing output and error
                Process process = new Process();
                process.StartInfo.FileName = "/bin/bash";
                process.StartInfo.Arguments = "-c \"" + line + "\"";
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = false;
                process.StartInfo.RedirectStandardError = false;
                process.Start();

                Print.AppendLine();
                Console.WriteLine();

                void PrintOutput(string output) {
                    foreach (string line in output.Split('\n')) {
                        Print.PrintLine(line);
                    }
                }

                void PrintError(string error) {
                    Console.ForegroundColor = ConsoleColor.Red;
                    foreach (string line in error.Split('\n')) {
                        Print.PrintLine(line + " **");
                    }
                    Console.ForegroundColor = ConsoleColor.White;
                }
                
                Console.CancelKeyPress += (sender, e) => {
                    e.Cancel = true;
                    process.Kill();
                    process.Close();
                };

                process.OutputDataReceived += (sender, e) => PrintOutput(e.Data ?? "");
                process.ErrorDataReceived += (sender, e) => PrintError(e.Data ?? "");
                process.WaitForExit();
            }
        }

        public NShell() {
            this.Print = new Printer(this);
        }
    }
}