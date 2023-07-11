using SFML.Graphics;
using SFML.Window;
using SFML.System;
using System;

namespace VN;

public class ImgElement {
    public Sprite Sprite { get; set; }
    public string Image {
        get => _image;
        set {
            _image = value;
            Sprite.Texture = new Texture(Paths.GetAssetPath(value));
        }
    }
    private string _image = "";

    public uint Width => Sprite.Texture.Size.X;
    public uint Height => Sprite.Texture.Size.Y;

    public Vector2f Position { get; set; }

    public ImgElement(string image) {
        Sprite = new Sprite();
        Image = image;
    }

    public virtual Vector2f CalculatePosition(RenderWindow window) {
        return new Vector2f(((float)window.Size.X / 2) - ((float)Width / 2), (float)window.Size.Y - (float)Height);
    }

    private Vector2f _position;

    public void UpdatePosition(RenderWindow window) {
        Vector2f newPosition = CalculatePosition(window);
        newPosition += Position;

        if (_position != newPosition) {
            _position = newPosition;
            Sprite.Position = _position;
        }
    }

    public void Draw(RenderWindow window) {
        UpdatePosition(window);
        window.Draw(Sprite);
    }
}
