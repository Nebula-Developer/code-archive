using System;

namespace PSH.Syntax {
    public class PearlSyntax {
        public static List<String> PathItems = new List<String>();
        public static List<String> CustomItems = new List<String>();

        public static void FetchPathItems() {
            String path = Environment.GetEnvironmentVariable("PATH") ?? "";
            String[] PathDirs = path.Split(Environment.OSVersion.Platform == PlatformID.Win32NT ? ';' : ':');

            foreach (String dir in PathDirs) {
                if (Directory.Exists(dir)) {
                    foreach (String file in Directory.GetFiles(dir)) {
                        PathItems.Add(Path.GetFileName(file));
                    }
                }
            }
        }

        public static String? SearchFileSyntax(String path) {
            String pathNew = path.Replace("~", Environment.GetEnvironmentVariable("HOME") ?? "");
            String dir = Path.GetDirectoryName(pathNew) ?? "/";

            if (File.Exists(dir) || !Directory.Exists(dir)) {
                return null;
            }

            List<String> pathItems = new List<String>(PathItems);
            pathItems.AddRange(Directory.GetFiles(dir));
            pathItems.AddRange(Directory.GetDirectories(dir));

            foreach (String item in pathItems) {
                if (item.StartsWith(pathNew)) {
                    return item;
                }
            }
            return null;
        }

        public static String? SearchPathSyntax(String str) {
            foreach (String item in PathItems) {
                if (item.StartsWith(str)) {
                    return item;
                }
            }
            return null;
        }
    }
}