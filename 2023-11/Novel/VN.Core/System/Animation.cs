using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace VN;

public enum AnimationLoopMode {
    None,
    Loop,
    PingPong,
    Mirror
}

public class Animation {
    public float Duration;
    public float Elapsed;
    public Action<float> Callback;
    public Func<float, float> Easing;
    public AnimationLoopMode LoopMode = AnimationLoopMode.None;

    public bool PingPongDirection = false;
    public float LoopDelay = 0f;
    public float StartDelay = 0f;

    public Animation(float duration, Action<float> callback, Func<float, float> easing = null, AnimationLoopMode loopMode = AnimationLoopMode.None) {
        Duration = duration;
        Callback = callback;
        Easing = easing ?? (t => t);
        LoopMode = loopMode;
    }
}

public class Animations {
    private Dictionary<string, Animation> animations = new Dictionary<string, Animation>();

    private int id = 0;

    public string GenID() => "Animation" + id++;

    public void Animate(string key, Animation animation) {
        if (animations.ContainsKey(key))
            animations.Remove(key);
        animations.Add(key, animation);
    }

    public void Update(Time time) {
        for (int i = 0; i < animations.Count; i++) {
            Animation animation = animations.Values.ElementAt(i);

            if (animation.StartDelay > 0) {
                animation.StartDelay -= time.DeltaTime;
                continue;
            }
            
            if (animation.LoopMode == AnimationLoopMode.PingPong || animation.LoopMode == AnimationLoopMode.Mirror)
                animation.Elapsed += animation.PingPongDirection ? -time.DeltaTime : time.DeltaTime;
            else animation.Elapsed += time.DeltaTime;

            if (animation.Elapsed >= animation.Duration || animation.Elapsed <= 0) {
                switch (animation.LoopMode) {
                    case AnimationLoopMode.Loop:
                        if (animation.Elapsed >= animation.Duration + animation.LoopDelay)
                            animation.Elapsed = 0;
                        break;
                    case AnimationLoopMode.PingPong:
                    case AnimationLoopMode.Mirror:
                        if (animation.Elapsed <= -animation.LoopDelay) {
                            animation.PingPongDirection = false;
                            animation.Elapsed = 0;
                        } else if (animation.Elapsed >= animation.Duration + animation.LoopDelay) {
                            animation.PingPongDirection = true;
                            animation.Elapsed = animation.Duration;
                        }
                        break;
                    case AnimationLoopMode.None:
                        animation.Callback(animation.Easing(1));
                        animations.Remove(animations.Keys.ElementAt(i));
                        i--;
                        break;
                }
            } else {
                if (animation.LoopMode == AnimationLoopMode.PingPong) {
                    // if going backwards, we need to flip the easing function
                    if (animation.PingPongDirection)
                        animation.Callback(1 - animation.Easing(1 - animation.Elapsed / animation.Duration));
                    else animation.Callback(animation.Easing(animation.Elapsed / animation.Duration));
                } else {    
                    animation.Callback(animation.Easing(animation.Elapsed / animation.Duration));
                }
            }
        }
    }

    public bool IsAnimating(string name) => animations.ContainsKey(name);
}
