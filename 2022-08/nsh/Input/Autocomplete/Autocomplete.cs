using System;
using System.IO;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace NSH.Shell {
    public class Autocomplete {
        public static List<string> FunctionList = new List<string>();

        public static List<string> PathFunctions = new List<string>();

        public static List<Tuple<String, List<String>>> AutocompleteFunctions = new List<Tuple<String, List<String>>>() {
            new Tuple<String, List<String>>("apt", new List<String>() {
                "install",
                "remove",
                "update",
                "upgrade",
                "autoremove",
                "clean",
                "search",
                "show",
                "list",
                "edit-sources",
                "source",
                "build-dep",
                "dist-upgrade"
            })
        };

        public static void GetEnvPath() {
            FunctionList = new List<string>();
            string path = Environment.GetEnvironmentVariable("PATH") ?? "";
            string splitter = Environment.OSVersion.Platform == PlatformID.Win32NT ? ";" : ":";
            string[] paths = path.Split(':');

            foreach (string p in paths) {
                if (Directory.Exists(p)) {
                    DirectoryInfo dir = new DirectoryInfo(p);
                    FileInfo[] files = dir.GetFiles();

                    foreach (FileInfo file in files) {
                        PathFunctions.Add(file.Name);
                    }
                }
            }

            FunctionList.Clear();
            FunctionList.AddRange(PathFunctions);
            FunctionList.AddRange(new List<String>() {
                "help",
                "exit",
                "clear",

                // Bash functions:
                "for", "while", "if",
                "then", "else", "elif",
                "fi", "do", "done",
                "in", "case", "esac",
                "function", "return",
                "export", "unset",
                "pushd", "popd",
                "dirs", "cd", "pwd",
                "source", "type", "alias",
                "unalias", "set", "shopt"
            });
        }

        public static string? SearchAutocomplete(String key, int pos) {
            String result = key;

            String[] parts = key.Replace("\\ ", "{SPACE}").Split(' ');
            String endPart = parts[parts.Length - 1].Replace("{SPACE}", "\\ ");

            bool isAtEnd = pos == key.Length;
            if (!isAtEnd) return null;

            bool isCheckingFunction = parts.Length == 1;

            foreach (string func in FunctionList) {
                if (func.StartsWith(endPart)) {
                    String newRes = key.Substring(0, key.Length - endPart.Length) + func;
                    if ((newRes.Length < result.Length) || result == key) result = newRes;
                }
            }

            if (endPart.Length > 1) {
                String file = endPart;
                file = file.Replace("~", Environment.GetEnvironmentVariable("HOME") ?? "/home");
                String dir = file.Contains('/') ? file.Substring(0, file.LastIndexOf('/') + 1) : "./";
                String fileName = endPart.Contains('/') ? endPart.Substring(endPart.LastIndexOf('/') + 1) : endPart;

                if (Directory.Exists(dir)) {
                    List<String> files = new List<String>();
                    files.AddRange(Directory.GetFiles(dir));
                    files.AddRange(Directory.GetDirectories(dir));

                    foreach (string f in files) {
                        String newF = f.Replace(Environment.GetEnvironmentVariable("HOME") ?? "/home", "~").Replace(" ", "\\ ");

                        if (newF.StartsWith(endPart)) {
                            String newFileName = newF.Substring(newF.LastIndexOf('/') + 1);
                            String newRes = key.Substring(0, key.Length - fileName.Length) + newFileName;
                            if ((newRes.Length < result.Length) || result == key) result = newRes;
                        }
                    }
                }
            }

            return result;
        }

        public static void SortAutocomplete() {
            FunctionList.Sort((a, b) => a.Length.CompareTo(b.Length));
        }

        public static bool IsValid(String key) {
            return true;
        }
    }
}