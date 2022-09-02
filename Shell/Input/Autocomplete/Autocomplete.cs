using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace NSH.Shell {
    public class Autocomplete {
        public static List<string> FunctionList = new List<string>();

        public static List<string> PathFunctions = new List<string>();

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
        }

        public static void GetCWDFiles() {

        }

        public static string? SearchAutocomplete(String key, int pos) {
            Tuple<String?, int> Result = new Tuple<String?, int>(null, int.MaxValue);

            String[] split = key.Split(" ");
            String function = split[0];
            bool endOfArgs = pos == key.Length;
            bool searchForArgs = endOfArgs && split.Length > 1;
            String endArg = split[split.Length - 1];

            if (function.Length == 0 && !searchForArgs) return null;
            if (searchForArgs && endArg.Length == 0) return null;
            String[] fileArgs = key.Replace("\\ ", "{SPACE}").Split(" ");
            String endFileArg = fileArgs[fileArgs.Length - 1].Replace("{SPACE}", "\\ ");

            bool searchForFiles = (endFileArg[0] == '.' || endFileArg[0] == '/') && endOfArgs;

            if (searchForFiles) {
                String dirPath = endFileArg.Substring(0, endFileArg.LastIndexOf('/') + 1);
                String fileName = endFileArg.Substring(endFileArg.LastIndexOf('/') + 1);

                if (Directory.Exists(dirPath)) {
                    List<String> files = new List<String>();
                    files.AddRange(Directory.GetFiles(dirPath));
                    files.AddRange(Directory.GetDirectories(dirPath));

                    foreach (String file in files) {
                        String fileNameOnly = file.Substring(file.LastIndexOf('/') + 1);
                        if (fileNameOnly.StartsWith(fileName)) {
                            int distance = fileNameOnly.Length - fileName.Length;
                            if (distance < Result.Item2) {
                                Result = new Tuple<String?, int>(file, distance);
                            }
                        }
                    }
                    return Result.Item1;
                }
            } else if (!searchForArgs) {
                foreach (string s in FunctionList) {
                    if (s.StartsWith(split[split.Length - 1])) {
                        if (s == split[split.Length - 1]) return null;
                        if (s.Length < Result.Item2) {
                            Result = new Tuple<string?, int>(s, s.Length);
                        }
                    }
                }
            } else {

            }
            
            return Result.Item1;
        }

        public static void SortAutocomplete() {
            FunctionList.Sort((a, b) => a.Length.CompareTo(b.Length));
        }
    }
}