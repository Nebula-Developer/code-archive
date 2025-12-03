using System.IO;

namespace NexusPort.System;

public static class Paths {
    public static string ApplicationData => Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
    public static string Root => Path.Combine(ApplicationData, "NexusPort");
    public static string GetRootPath(string path) => Path.Combine(Root, path);
}
