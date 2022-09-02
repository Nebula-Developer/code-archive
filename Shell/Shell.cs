using System.Collections.Generic;
using System.Linq;
using System;
using System.IO;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using NSH.Shell;

namespace NSH.Shell {
    public class NShell {
        public List<Tuple<int, int, char>> TermChars = new List<Tuple<int, int, char>>();
        public Printer Print;

        public enum Platform {
            osx,
            windows,
            linux,
            unknown
        }

        public Platform __Platform = Platform.unknown;

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

        public void SetPlatform() {
            // Linux / windows / osx
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux)) {
                __Platform = Platform.linux;
            } else if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) {
                __Platform = Platform.windows;
            } else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX)) {
                __Platform = Platform.osx;
            }
        }

        public string GetPlatformStr() {
            switch (__Platform) {
                case Platform.osx:
                    return "OSX";
                case Platform.linux:
                    return "LINUX";
                case Platform.windows:
                    return "WINDOWS";
                default:
                    return "UNKNOWN";
            }
        }

        public void Init() {
            SetPlatform();
            ClearCharacters();
            
            while (true) {
                Input input = new Input(Print, this);
                string line = input.FetchInput();
                line = line.Replace("$PWD", Environment.CurrentDirectory);
                string[] lineSplit = line.Split(" ");

                if (lineSplit[0] == "exit") break;
                if ((lineSplit[0] == "sudo" && lineSplit.Contains("-i")) || lineSplit[0] == "su") {
                    // Restart shell with sudo
                    Console.WriteLine("Restarting shell with sudo...");
                    Process rootProcess = new Process();
                    rootProcess.StartInfo.FileName = "/bin/bash";
                    // Run sudo + (path to nsh)
                    String? appPath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName;
                    if (appPath == null) {
                        // Instead use general name
                        appPath = Path.Combine(AppContext.BaseDirectory, System.Reflection.Assembly.GetEntryAssembly()?.GetName().Name ?? "nsh");
                    }

                    rootProcess.StartInfo.Arguments = "-c \"sudo " + appPath + "\"";
                    rootProcess.StartInfo.UseShellExecute = true;
                    rootProcess.StartInfo.RedirectStandardInput = false;

                    rootProcess.Start();
                    rootProcess.WaitForExit();
                    break;
                }

                if (lineSplit[0] == "cd" && lineSplit.Length > 1) {
                    string subStr = line.Substring(3);
                    int count = Regex.Matches(subStr, "\\ ").Count;

                    for (int i = 0; i < count; i++) subStr = subStr.Replace("\\ ", " ");
                    subStr.Replace(" ", "\\ ");

                    if (subStr.StartsWith("~")) {
                        subStr = subStr.Substring(1);
                        subStr = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + subStr;
                    }

                    if (subStr.StartsWith("$")) {
                        String? env = Environment.GetEnvironmentVariable(subStr.Substring(1));

                        if (env != null) {
                            subStr = env;
                        }
                    }

                    if (Directory.Exists(subStr)) {
                        Directory.SetCurrentDirectory(subStr);
                    }
                    continue;
                } else if (lineSplit[0] == "path") {
                    foreach(String f in Autocomplete.FunctionList) {
                        Console.WriteLine(f);
                        System.Threading.Thread.Sleep(1);
                    }
                    continue;
                }

                // Execute while capturing output and error
                Process process = new Process();
                process.StartInfo.FileName = "/bin/bash";
                process.StartInfo.Arguments = "-c \"" + line + "\"";
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = false;
                process.StartInfo.RedirectStandardError = false;
                process.StartInfo.RedirectStandardInput = false;
                process.Start();

                ConsoleCancelEventHandler procKill = (object? sender, ConsoleCancelEventArgs e) => {
                    process.Kill();
                };

                Console.CancelKeyPress += procKill;
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
                

                process.OutputDataReceived += (sender, e) => PrintOutput(e.Data ?? "");
                process.ErrorDataReceived += (sender, e) => PrintError(e.Data ?? "");

                /*while (!process.HasExited) {
                    if (Console.KeyAvailable) {
                        ConsoleKeyInfo key = Console.ReadKey(true);
                        Char c = key.KeyChar;

                        try {
                            if (c == '\x03' || c == '\x1a') {
                                process.Kill();
                                process.WaitForExit();
                                process.Close();
                                process.Dispose();
                                break;
                            }

                            else if (key.Key == ConsoleKey.Enter) {
                                process.StandardInput.WriteLineAsync();
                            }

                            else if (key.Key == ConsoleKey.Backspace) {
                                process.StandardInput.WriteAsync('\b');
                            }
                            
                            else {
                                process.StandardInput.WriteAsync(c);
                            }
                        } catch {
                            process.Kill();
                            process.Dispose();
                            break;
                        }
                    }

                    System.Threading.Thread.Sleep(1);
                }*/

                process.WaitForExit();
                process.Close();
                process.Dispose();
                Console.CancelKeyPress -= procKill;
            }

            Console.Write("\n");
        }

        public NShell() {
            this.Print = new Printer(this);
        }
    }
}