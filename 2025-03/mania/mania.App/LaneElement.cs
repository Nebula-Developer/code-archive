using Natsu.Graphics;
using Natsu.Core.Elements;
using Natsu.Mathematics;
using Natsu.Extensions;
using Natsu.Input;
using Natsu.Graphics.Shaders;

namespace Mania;

public class LaneElement : GlobalInputElement {
    public Game Game { get; }
    public int LaneIndex { get; }
    public Lane Lane { get; }
    public BoxElement Flash { get; }

    public LaneElement(Game game, int laneIndex) : base() {
        Game = game;
        LaneIndex = laneIndex;
        Lane = game.Map.Lanes[laneIndex];

        RelativeSizeAxes = Axes.Y;
        Size = new(100, 1);
        Position = new(laneIndex * 100, 0);

        Flash = new() {
            RelativeSizeAxes = Axes.Both,
            Color = Colors.Black,
            Pivot = new(0, 1f),
            Size = new(1, 0.5f),
            Opacity = 0,
            Parent = this
        };
    }

    public void FlashOn() {
        Flash.StopTransformSequence(nameof(Flash.Opacity));
        Flash.OpacityTo(1, 0.02f);
    }

    public void FlashOff() {
        Flash.StopTransformSequence(nameof(Flash.Opacity));
        Flash.OpacityTo(0, 0.1f);
    }

    protected override void OnLoad() {
        string flashShader = @"
        uniform float time;
        uniform vec2 pos;
        uniform vec2 resolution;

        vec4 main(vec2 coord) {
            float opacity = coord.y / resolution.y;
            opacity = pow(opacity, 3.0);
            return vec4(1.0, 1.0, 1.0, opacity) * opacity;
        }
        ";

        IShader shader = App.ShaderManager.Parse(flashShader);
        Flash.Shader = shader;
    }

    public static ReadonlyColor[] LaneColors = {
        Colors.Yellow,
        Colors.Orange,
        Colors.Red,
        Colors.Purple
    };

    protected override void OnRender(ICanvas canvas) {
        Color color = LaneColors[LaneIndex % LaneColors.Length];
        canvas.DrawRect(new(0, 0, DrawSize.X, DrawSize.Y), new() {
            Color = color * 0.5f,
            Opacity = 0.25f,
        });

        for (int i = 0; i < Lane.Hitpoints.Count; i++) {
            var hitpoint = Lane.Hitpoints[i];
            if (hitpoint.HasHit) continue;
            if (hitpoint.Time + hitpoint.Length < (Game.Time - 0.1f)) {
                hitpoint.HasHit = true;
                if (hitpoint.Score == Score.Miss)
                    Add(new LaneScoreElement(Score.Miss) {
                        Position = new(0, -50)
                    });
                
                continue;
            }

            // if the hitpoint is too far in the future, ignore
            if (hitpoint.Time - Game.Time > 2)
                break;

            float y = DrawSize.Y - (hitpoint.Time - Game.Time + hitpoint.Length) * Game.NoteScale;
            y -= 25;

            if (hitpoint.Length > 0) {
                canvas.DrawRect(new(0, y, DrawSize.X, hitpoint.Length * Game.NoteScale), new() {
                    Color = color,
                    Opacity = 0.5f,
                    IsAntialias = true
                });
            }
            
            canvas.DrawRect(new(0, y + (hitpoint.Length * Game.NoteScale), DrawSize.X, 25), new() {
                Color = color,
                Opacity = 1f,
                IsAntialias = true
            });

            canvas.DrawRect(new(0, DrawSize.Y - 25, DrawSize.X, 25), new() {
                Color = color * 0.5f,
                Opacity = 0.5f,
                IsAntialias = true
            });
        }
    }

    public Hitpoint GetHitpoint(float time) {
        Hitpoint? closest = null;
        float closestDist = float.MaxValue;

        foreach (var hitpoint in Lane.Hitpoints) {
            if (hitpoint.HasHit) continue;
            float dist = Math.Abs(hitpoint.Time - time + hitpoint.Length);
            if (dist < closestDist) {
                closestDist = dist;
                closest = hitpoint;
            }
        }

        return closest ?? new Hitpoint(0, 0);
    }

    public Score DistanceToScore(float dist) {
        if (dist < 0.06f) {
            return Score.Perfect;
        } else if (dist < 0.15f) {
            return Score.Great;
        } else {
            return Score.Meh;
        }
    }

    private int _downHash = 0;
    protected override bool OnKeyDown(Key key, KeyMods mods) {
        if (Lane.Key != key) return false;
        if (mods.HasFlag(KeyMods.Repeat)) return true;

        FlashOn();

        Console.WriteLine($"Key {key} pressed on lane {LaneIndex}");

        if (Lane.Hitpoints.Count > 0) {
            var nextNote = GetHitpoint(Game.Time);

            float dist = Math.Abs(nextNote.Time - Game.Time);
            if (dist > 0.2f) {
                Console.WriteLine($"Hitpoint {nextNote.Time} too far on lane {LaneIndex} ({dist})");
                return true;
            }
            _downHash = nextNote.GetHashCode();

            Console.WriteLine($"Hitpoint {nextNote.Time} hit on lane {LaneIndex} ({dist})");

            Score score = DistanceToScore(dist);
            nextNote.Score = score;

            Add(new LaneScoreElement(score) {
                Position = new(0, -50)
            });

            if (nextNote.Length == 0) nextNote.HasHit = true;
        }

        return true;
    }

    protected override bool OnKeyUp(Key key, KeyMods mods) {
        if (Lane.Key != key) return false;
        if (mods.HasFlag(KeyMods.Repeat)) return true;

        FlashOff();

        if (Lane.Hitpoints.Count > 0) {
            var nextNote = GetHitpoint(Game.Time);

            if (_downHash != nextNote.GetHashCode()) {
                Console.WriteLine($"Key {key} released on lane {LaneIndex} but not the same note");
                return true;
            }

            if (nextNote.Length == 0) return true; // should always be false

            // get distance from the END of the note, not the start
            float dist = nextNote.Time - Game.Time + nextNote.Length;


            Score score = DistanceToScore(dist);
            nextNote.Score = score;

            Add(new LaneScoreElement(score) {
                Position = new(0, -50)
            });

            Console.WriteLine($"Hitpoint {nextNote.Time} released on lane {LaneIndex} ({score})");
        }
        return true;
    }
}
