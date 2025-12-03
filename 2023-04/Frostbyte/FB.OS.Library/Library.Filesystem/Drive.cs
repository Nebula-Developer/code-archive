
namespace FB.OS.Library.FilesystemNS;

public class Drive : Filesystem {
    /// <summary>
    /// The drive label that will represent the drive in the host operating system.
    /// </summary>
    public string Label { get; }

    /// <summary>
    /// The location of the drive in the host operating system, most commonly Paths.Root.
    /// </summary>
    public string DriveLocation { get; }

    public override string GetPath(string path) => Path.Combine(DriveLocation, path);

    /// <summary>
    /// Primary constructor for the Drive class.
    /// </summary>
    /// <param name="label">The drive label that will represent the drive in the host operating system.</param>
    public Drive(string label) : base() {
        Label = label;
        DriveLocation = Paths.Root;
    }

    /// <summary>
    /// Primary constructor for the Drive class.
    /// </summary>
    /// <param name="label">The drive label that will represent the drive in the host operating system.</param>
    /// <param name="driveLocation">The location of the drive in the host operating system, most commonly Paths.Root.</param>
    public Drive(string label, string driveLocation) : base() {
        Label = label;
        DriveLocation = driveLocation;
    }
}
