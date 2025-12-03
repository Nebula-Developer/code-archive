using SFML.Graphics;
using SFML.System;

namespace Prisms;

public class MainMenuScreen : Screen {
    public MainMenuScreen(RenderWindow window) : base(window) { }

    RectangleShape testShapeA = new RectangleShape(new Vector2f(100, 100)) {
        FillColor = Color.White,
        Position = new Vector2f(100, 100)
    };

    RectangleShape testShapeB = new RectangleShape(new Vector2f(100, 100)) {
        FillColor = Color.White,
        Position = new Vector2f(100, 100)
    };

    Clock timer = new();

    float duration = 1f;
    float deltaAm = 0f;

    // macos default font:
    Text resultTextA = new Text("", new Font("/System/Library/Fonts/SFNSMono.ttf")) {
        CharacterSize = 24, FillColor = Color.White, Position = new Vector2f(100, 370)
    };

    Text resultTextB = new Text("", new Font("/System/Library/Fonts/SFNSMono.ttf")) {
        CharacterSize = 24, FillColor = Color.White, Position = new Vector2f(100, 400)
    };

    Text timeText = new Text("", new Font("/System/Library/Fonts/SFNSMono.ttf")) {
        CharacterSize = 24,
        FillColor = Color.Cyan,
        Position = new Vector2f(100, 500)
    };

    EaseType easeType = EaseType.Linear;

    public override void Update() {
        deltaAm += Time.DeltaTime / duration;

        float easeA = Ease.From(easeType, deltaAm);
        float easeB = Ease.From(easeType, timer.ElapsedTime.AsSeconds() / duration);

        float to = window.Size.X - 200;
        float aX = Maths.Lerp(100, to, easeA);
        float bX = Maths.Lerp(100, to, easeB);

        testShapeA.Position = new Vector2f(aX, 100);
        testShapeB.Position = new Vector2f(bX, 200);

        if (timer.ElapsedTime.AsSeconds() >= duration) {
            timer.Restart();
            deltaAm = 0f;

            int typeLen = Enum.GetValues(typeof(EaseType)).Length;
            int curIndex = (int)easeType;

            curIndex = (curIndex + 1) % typeLen;

            easeType = (EaseType)curIndex;

            resultTextA.DisplayedString = "A: " + testShapeA.Position.X;
            resultTextB.DisplayedString = "B: " + testShapeB.Position.X;
        }

        timeText.DisplayedString = (int)timer.ElapsedTime.AsSeconds() + "s with easing '" + easeType + "'";
    }

    public override void Draw() {
        window.Clear(Color.Black);

        window.Draw(testShapeA);
        window.Draw(testShapeB);

        window.Draw(resultTextA);
        window.Draw(resultTextB);

        window.Draw(timeText);
    }
}
