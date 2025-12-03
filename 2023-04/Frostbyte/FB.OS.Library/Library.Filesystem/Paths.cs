using System.IO;

namespace FB.OS.Library.FilesystemNS;

/// <summary>
/// A class that provides a set of static methods and baseplates for working with paths.
/// </summary>
public static class Paths {
    /// <summary>
    /// Combines two or more strings into a path.
    /// </summary>
    /// <param name="paths">The paths to combine.</param>
    /// <returns>The combined paths.</returns>
    public static string Join(params string[] paths) => Path.Combine(paths);
    
    /// <summary>
    /// A path that is relative to the project executable.
    /// </summary>
    /// <param name="path">The path to combine.</param>
    /// <returns>The combined path.</returns>
    public static string RelativeToExecutable(string path) => Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);

    /// <summary>
    /// The root directory of all drives.
    /// </summary>
    public static Func<string> GetRoot = () => RelativeToExecutable("FrostbyteOS") + Path.DirectorySeparatorChar;

    /// <summary>
    /// The root directory of all drives.
    /// </summary>
    public static string Root => GetRoot();

    /// <summary>
    /// Get a path relative to the root directory.
    /// </summary>
    /// <param name="path">The path to combine.</param>
    public static string RelativeToRoot(string path) => Path.Combine(Root, path);
}