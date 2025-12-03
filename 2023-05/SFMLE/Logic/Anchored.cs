using SFML.System;

namespace SFMLE;

public class Anchored {
    public Vector2f Position { get; set; }
    public Vector2f WorldPosition { get; private set; }
    public Vector2f Size { get; set; }
    public Anchor Anchor { get; set; }

    public Anchored() {
        Position = new Vector2f(0, 0);
        Size = new Vector2f(0, 0);
        Anchor = Anchor.TopLeft;
    }

    private static readonly Dictionary<Anchor, Vector2f> AnchorPositions = new Dictionary<Anchor, Vector2f> {
        { Anchor.TopLeft, new Vector2f(0, 0) },
        { Anchor.TopCenter, new Vector2f(0.5f, 0) },
        { Anchor.TopRight, new Vector2f(1, 0) },
        { Anchor.CenterLeft, new Vector2f(0, 0.5f) },
        { Anchor.Center, new Vector2f(0.5f, 0.5f) },
        { Anchor.CenterRight, new Vector2f(1, 0.5f) },
        { Anchor.BottomLeft, new Vector2f(0, 1) },
        { Anchor.BottomCenter, new Vector2f(0.5f, 1) },
        { Anchor.BottomRight, new Vector2f(1, 1) },
    };

    public void CalcWorldPosition(Vector2f parentPosition, Vector2f parentSize) {
        Vector2f anchorPositionDict = AnchorPositions[Anchor];
        Vector2f anchorPosition = new Vector2f(parentSize.X * anchorPositionDict.X, parentSize.Y * anchorPositionDict.Y);

        Vector2f position = new Vector2f(anchorPosition.X, anchorPosition.Y);

        bool isXCentered = Anchor == Anchor.Center || Anchor == Anchor.TopCenter || Anchor == Anchor.BottomCenter;
        bool isYCentered = Anchor == Anchor.Center || Anchor == Anchor.CenterLeft || Anchor == Anchor.CenterRight;

        bool isBottom = Anchor == Anchor.BottomLeft || Anchor == Anchor.BottomCenter || Anchor == Anchor.BottomRight;
        bool isRight = Anchor == Anchor.TopRight || Anchor == Anchor.CenterRight || Anchor == Anchor.BottomRight;
        
        if (isXCentered) position.X -= Size.X / 2;
        if (isYCentered) position.Y -= Size.Y / 2;

        if (isBottom) position.Y -= Size.Y;
        if (isRight) position.X -= Size.X;

        position += parentPosition;
        position += Position;

        WorldPosition = position;
    }
}
