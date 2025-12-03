namespace VN;

public static class Paths {
    public static string Base => AppContext.BaseDirectory;
    public static string GetAssetPath(string path) => Path.Join(Base, "Assets", path);
    public static string GetBasePath(string path) => Path.Join(Base, path);
}
