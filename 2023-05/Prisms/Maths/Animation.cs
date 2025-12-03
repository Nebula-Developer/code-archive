using System;
using SFML.Graphics;
using SFML.System;
using SFML.Window;

namespace Prisms;

public static class Animations {
    private static List<Animation> animations = new();
    
    public static void Update() {
        for (int i = 0; i < animations.Count; i++)
            if (animations[i] != null)
                animations[i].Update();
    }

    public static void AddAnimation(Animation anim) => animations.Add(anim);
    public static void RemoveAnimation(Animation anim) => animations.Remove(anim);
}

public class Animation {
    public float duration;
    public EaseType easing;
    public Clock timer = new();
    public Action<float> onUpdate;
    public bool removeOnComplete = true;
    public bool isComplete => timer.ElapsedTime.AsSeconds() >= duration;

    public Animation(float duration, EaseType easing, Action<float> onUpdate, bool removeOnComplete = true) {
        this.duration = duration;
        this.easing = easing;
        this.onUpdate = onUpdate;
        this.removeOnComplete = removeOnComplete;
    }

    public void Update() {
        if (timer.ElapsedTime.AsSeconds() >= duration) {
            if (removeOnComplete)
                Animations.RemoveAnimation(this);
            
            return;
        }

        float delta = timer.ElapsedTime.AsSeconds() / duration;
        float ease = Ease.From(easing, delta);
        onUpdate(ease);
    }
    
    public void Reset() => timer.Restart();

    public static Animation Create(float duration, EaseType easing, Action<float> onUpdate, bool removeOnComplete = true) {
        Animation anim = new(duration, easing, onUpdate, removeOnComplete);
        Animations.AddAnimation(anim);
        return anim;
    }
}
