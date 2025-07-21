using AudioEngine.Processing;

namespace AudioEngine.Audio;

public partial class AudioStream {
    public EffectDSP EffectsDSP { get; }
    public IReadOnlyCollection<Effect> Effects => EffectsDSP.Effects;

    public void AddEffect(Effect effect) => EffectsDSP.AddEffect(effect);
    public void InsertEffect(int index, Effect effect) => EffectsDSP.InsertEffect(index, effect);
    public void RemoveEffect(Effect effect) => EffectsDSP.RemoveEffect(effect);
    public void MoveEffect(int oldIndex, int newIndex) => EffectsDSP.MoveEffect(oldIndex, newIndex);
    public void ClearEffects() => EffectsDSP.ClearEffects();
}