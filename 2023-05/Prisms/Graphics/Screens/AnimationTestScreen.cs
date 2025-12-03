using SFML.Graphics;
using SFML.System;
using SFML.Window;

namespace Prisms;

public class AnimationTestScreen : Screen {
    public float duration = 2f;
    public EaseType easeType = EaseType.InOutExpo;
    public Animation anim;
    public RectangleShape rect = new(new Vector2f(100, 100));

    public AnimationTestScreen(RenderWindow window) : base(window) {
        anim = Animation.Create(duration, easeType, (float ease) => {
            rect.Position = new Vector2f(window.Size.X - rect.Size.X, window.Size.Y - rect.Size.Y) * ease;
        }, false);
    }

    public override void Update() {
        if (anim.isComplete)
            anim.Reset();

        if (Keyboard.IsKeyPressed(Keyboard.Key.Space))
            Animations.RemoveAnimation(anim);
    }

    public override void Draw() {
        window.Clear(Color.Black);
        window.Draw(rect);
    }
}