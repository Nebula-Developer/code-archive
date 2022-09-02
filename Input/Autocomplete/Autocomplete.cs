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
            String result = "test";
            return result;
        }

        public static void SortAutocomplete() {
            FunctionList.Sort((a, b) => a.Length.CompareTo(b.Length));
        }

        public static bool IsValid(String key) {
            if (FunctionList.Contains(key)) return true;
            String[] fileArgs = key.Replace("\\ ", "{SPACE}").Replace("~", Environment.GetEnvironmentVariable("HOME") ?? "").Split(" ");
            String endFileArg = fileArgs[fileArgs.Length - 1].Replace("{SPACE}", "\\ ");
            if (endFileArg.Length == 0) endFileArg = " ";

            bool searchForFiles = (endFileArg[0] == '.' || endFileArg[0] == '/');
            String dirPath = endFileArg.Substring(0, endFileArg.LastIndexOf('/') + 1);
            String fileName = endFileArg.Substring(endFileArg.LastIndexOf('/') + 1);
            List<String> fileNames = new List<String>();

            if (Directory.Exists(dirPath)) {
                fileNames.AddRange(Directory.GetFiles(dirPath));
                fileNames.AddRange(Directory.GetDirectories(dirPath));
            }

            if (fileNames.Contains(key)) return true;
            if (Directory.Exists(key)) return true;
            return false;
        }
    }
}