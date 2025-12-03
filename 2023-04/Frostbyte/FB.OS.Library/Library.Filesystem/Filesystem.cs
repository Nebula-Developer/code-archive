using System.Text.Json;

namespace FB.OS.Library.FilesystemNS;

/// <summary>
/// A class for working with files and directories.
/// </summary>
public class Filesystem {
    public virtual string GetPath(string path) => Paths.RelativeToRoot(path);

    public Filesystem() {
        string? parent = Directory.GetParent(GetPath(""))?.FullName;

        while (parent != null && !Exists(parent)) {
            CreateDirectory(parent);
            parent = Directory.GetParent(parent)?.FullName;
        }

        if (parent == null) {
            throw new Exception("Could not create root directory.");
        }
    }

    #region Information
    /// <summary>
    /// Gets the size, in bytes, of the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <returns>The size of the file, in bytes.</returns>
    public virtual long GetFileSize(string path) => new FileInfo(GetPath(path)).Length;

    /// <summary>
    /// Gets the size, in bytes, of the specified directory.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <returns>The size of the directory, in bytes.</returns>
    public virtual long GetDirectorySize(string path) {
        long size = 0;
        foreach (var file in Directory.GetFiles(GetPath(path), "*.*", SearchOption.AllDirectories)) {
            size += GetFileSize(file);
        }
        return size;
    }

    /// <summary>
    /// Checks if the specified path exists.
    /// </summary>
    /// <param name="path">The path to check.</param>
    /// <returns>True if the path exists, false otherwise.</returns>
    public virtual bool Exists(string path) => File.Exists(GetPath(path)) || Directory.Exists(GetPath(path));

    /// <summary>
    /// Checks if the specified path is a file.
    /// </summary>
    /// <param name="path">The path to check.</param>
    /// <returns>True if the path is a file, false otherwise.</returns>
    public virtual bool IsFile(string path) => File.Exists(GetPath(path));

    /// <summary>
    /// Checks if the specified path is a directory.
    /// </summary>
    /// <param name="path">The path to check.</param>
    /// <returns>True if the path is a directory, false otherwise.</returns>
    public virtual bool IsDirectory(string path) => Directory.Exists(GetPath(path));

    /// <summary>
    /// Lists all files in the specified directory.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <returns>An array of all files in the directory.</returns>
    public virtual string[] ListFiles(string path) => Directory.GetFiles(GetPath(path));

    /// <summary>
    /// Lists all directories in the specified directory.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <returns>An array of all directories in the directory.</returns>
    public virtual string[] ListDirectories(string path) => Directory.GetDirectories(GetPath(path));

    /// <summary>
    /// Lists all files and directories in the specified directory.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <returns>An array of all files and directories in the directory.</returns>
    public virtual string[] List(string path) => Directory.GetFileSystemEntries(GetPath(path));

    /// <summary>
    /// Lists all files and directories in the specified directory, optionally including subdirectories.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <param name="recursive">Whether to include subdirectories.</param>
    /// <returns>An array of all files and directories in the directory.</returns>
    public virtual string[] List(string path, bool recursive) => Directory.GetFileSystemEntries(GetPath(path), "*.*", recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly);
    #endregion

    #region Creation
    /// <summary>
    /// Creates a file at the specified path.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    public virtual void CreateFile(string path) => File.Create(GetPath(path));

    /// <summary>
    /// Creates a directory at the specified path.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    public virtual void CreateDirectory(string path) => Directory.CreateDirectory(GetPath(path));

    /// <summary>
    /// Creates a file at the specified path, and writes the specified text to it.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="text">The text to write to the file.</param>
    public virtual void CreateFile(string path, string text) => File.WriteAllText(GetPath(path), text);

    /// <summary>
    /// Creates a file at the specified path, and writes the specified bytes to it.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="bytes">The bytes to write to the file.</param>
    public virtual void CreateFile(string path, byte[] bytes) => File.WriteAllBytes(GetPath(path), bytes);

    /// <summary>
    /// Creates a file at the specified path, and writes the specified lines to it.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="lines">The lines to write to the file.</param>
    public virtual void CreateFile(string path, string[] lines) => File.WriteAllLines(GetPath(path), lines);
    #endregion

    #region Deletion
    /// <summary>
    /// Deletes the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    public virtual void DeleteFile(string path) => File.Delete(GetPath(path));

    /// <summary>
    /// Deletes the specified directory.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    public virtual void DeleteDirectory(string path) => Directory.Delete(GetPath(path));

    /// <summary>
    /// Deletes the specified file or directory.
    /// </summary>
    /// <param name="path">The path to the file or directory.</param>
    public virtual void Delete(string path) {
        if (IsFile(path)) DeleteFile(path);
        else if (IsDirectory(path)) DeleteDirectory(path);
    }

    /// <summary>
    /// Deletes all files in the specified directory.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    public virtual void EmptyDirectory(string path) {
        foreach (var file in ListFiles(path)) DeleteFile(file);
        foreach (var directory in ListDirectories(path)) DeleteDirectory(directory);
    }
    #endregion

    #region Reading
    /// <summary>
    /// Reads the specified file as text.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <returns>The text in the file.</returns>
    public virtual string ReadFile(string path) => File.ReadAllText(GetPath(path));

    /// <summary>
    /// Reads the specified file as bytes.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <returns>The bytes in the file.</returns>
    public virtual byte[] ReadFileBytes(string path) => File.ReadAllBytes(GetPath(path));

    /// <summary>
    /// Reads the specified file as lines.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <returns>The lines in the file.</returns>
    public virtual string[] ReadFileLines(string path) => File.ReadAllLines(GetPath(path));
    #endregion

    #region Writing
    /// <summary>
    /// Writes the specified text to the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="text">The text to write to the file.</param>
    public virtual void WriteFile(string path, string text) => File.WriteAllText(GetPath(path), text);

    /// <summary>
    /// Writes the specified bytes to the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="bytes">The bytes to write to the file.</param>
    public virtual void WriteFile(string path, byte[] bytes) => File.WriteAllBytes(GetPath(path), bytes);

    /// <summary>
    /// Writes the specified lines to the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="lines">The lines to write to the file.</param>
    public virtual void WriteFile(string path, string[] lines) => File.WriteAllLines(GetPath(path), lines);

    /// <summary>
    /// Appends the specified text to the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="text">The text to append to the file.</param>
    public virtual void AppendFile(string path, string text) => File.AppendAllText(GetPath(path), text);

    /// <summary>
    /// Appends the specified bytes to the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="bytes">The bytes to append to the file.</param>
    public virtual void AppendFile(string path, byte[] bytes) => File.WriteAllBytes(GetPath(path), ReadFileBytes(path).Concat(bytes).ToArray());

    /// <summary>
    /// Appends the specified lines to the specified file.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="lines">The lines to append to the file.</param>
    public virtual void AppendFile(string path, string[] lines) => File.AppendAllLines(GetPath(path), lines);
    #endregion

    #region Copying
    /// <summary>
    /// Copies the specified file to the specified destination.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="destination">The path to the destination.</param>
    public virtual void CopyFile(string path, string destination) => File.Copy(GetPath(path), GetPath(destination));

    /// <summary>
    /// Copies the specified directory to the specified destination.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <param name="destination">The path to the destination.</param>
    public virtual void CopyDirectory(string path, string destination) => DirectoryCopy(GetPath(path), GetPath(destination), true);

    /// <summary>
    /// Copies the specified file or directory to the specified destination.
    /// </summary>
    /// <param name="path">The path to the file or directory.</param>
    /// <param name="destination">The path to the destination.</param>
    public virtual void Copy(string path, string destination) {
        if (IsFile(path)) CopyFile(path, destination);
        else if (IsDirectory(path)) CopyDirectory(path, destination);
    }

    private void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs) {
        DirectoryInfo dir = new DirectoryInfo(sourceDirName);

        if (!dir.Exists) throw new DirectoryNotFoundException("Source directory does not exist or could not be found: " + sourceDirName);

        DirectoryInfo[] dirs = dir.GetDirectories();
        if (!Directory.Exists(destDirName)) Directory.CreateDirectory(destDirName);

        FileInfo[] files = dir.GetFiles();
        foreach (FileInfo file in files) {
            string tempPath = Path.Combine(destDirName, file.Name);
            file.CopyTo(tempPath, false);
        }

        if (copySubDirs) {
            foreach (DirectoryInfo subdir in dirs) {
                string tempPath = Path.Combine(destDirName, subdir.Name);
                DirectoryCopy(subdir.FullName, tempPath, copySubDirs);
            }
        }
    }
    #endregion

    #region Moving
    /// <summary>
    /// Moves the specified file to the specified destination.
    /// </summary>
    /// <param name="path">The path to the file.</param>
    /// <param name="destination">The path to the destination.</param>
    public virtual void MoveFile(string path, string destination) => File.Move(GetPath(path), GetPath(destination));

    /// <summary>
    /// Moves the specified directory to the specified destination.
    /// </summary>
    /// <param name="path">The path to the directory.</param>
    /// <param name="destination">The path to the destination.</param>
    public virtual void MoveDirectory(string path, string destination) => Directory.Move(GetPath(path), GetPath(destination));

    /// <summary>
    /// Moves the specified file or directory to the specified destination.
    /// </summary>
    /// <param name="path">The path to the file or directory.</param>
    /// <param name="destination">The path to the destination.</param>
    public virtual void Move(string path, string destination) {
        if (IsFile(path)) MoveFile(path, destination);
        else if (IsDirectory(path)) MoveDirectory(path, destination);
    }
    #endregion

    #region JSON
    /// <summary>
    /// Reads the specified file as a JSON object.
    /// </summary>
    /// <typeparam name="T">The type of the object.</typeparam>
    /// <param name="path">The path to the file.</param>
    /// <returns>The JSON object.</returns>
    public virtual T? ReadJson<T>(string path) {
        var options = new JsonSerializerOptions {
            PropertyNameCaseInsensitive = true
        };

        try {
            var json = ReadFile(path);
            return JsonSerializer.Deserialize<T>(json, options);
        } catch {
            return default(T);
        }
    }

    /// <summary>
    /// Writes the specified JSON object to the specified file.
    /// </summary>
    /// <typeparam name="T">The type of the object.</typeparam>
    /// <param name="path">The path to the file.</param>
    /// <param name="obj">The JSON object.</param>
    public virtual void WriteJson(string path, object json) {
        var options = new JsonSerializerOptions {
            WriteIndented = true
        };

        var jsonText = JsonSerializer.Serialize(json, options);
        WriteFile(path, jsonText);
    }
    #endregion
}
