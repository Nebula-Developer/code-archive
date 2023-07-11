namespace VN;

public class Binding<Type> {
    public Type Value { get; set; }
    public Action<Type> ValueSet;

    public Binding(Type value, Action<Type> valueSet) {
        Value = value;
        this.ValueSet = valueSet;
    }

    public void Set(Type value) {
        Value = value;
        ValueSet?.Invoke(value);
    }

    public static implicit operator Type(Binding<Type> binding) {
        return binding.Value;
    }
}
