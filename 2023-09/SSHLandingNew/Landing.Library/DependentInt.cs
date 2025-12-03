namespace Landing.Library;

public class DependentInt {
    public int AbsoluteValue { get; set; }
    public Func<int> DependentValue { get; set; }

    public enum DependentType {
        Absolute,
        Dependent
    }

    public DependentType Type { get; set; }

    public DependentInt(int absoluteValue) {
        AbsoluteValue = absoluteValue;
        Type = DependentType.Absolute;
    }

    public DependentInt(Func<int> dependentValue) {
        DependentValue = dependentValue;
        Type = DependentType.Dependent;
    }

    public int Value {
        get {
            return Type switch {
                DependentType.Absolute => AbsoluteValue,
                DependentType.Dependent => DependentValue(),
                _ => throw new ArgumentOutOfRangeException()
            };
        }
    }
    
    public static DependentInt WindowHeight = new DependentInt(() => Console.WindowHeight);
    public static DependentInt WindowWidth = new DependentInt(() => Console.WindowWidth);
}

public class DependentIntVariable : DependentInt {
    public int Variable { get; set; }

    public DependentIntVariable(int value) : base(value) { }
    public DependentIntVariable(Func<int> value) : base(value) { }
}
