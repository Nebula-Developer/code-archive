using System;
using SFML.Window;
using SFML.System;
using SFML.Graphics;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Reflection;



public static class GlobalKeyboard {
    public static List<Keyboard.Key> lastKeyboardState = new List<Keyboard.Key>();
    public static List<Keyboard.Key> currentKeyboardState = new List<Keyboard.Key>();

    public static void Flush() => lastKeyboardState = new List<Keyboard.Key>(currentKeyboardState);

    public static void AddKey(Keyboard.Key key) { if (!currentKeyboardState.Contains(key)) currentKeyboardState.Add(key); }
    public static void RemoveKey(Keyboard.Key key) { if (currentKeyboardState.Contains(key)) currentKeyboardState.Remove(key); }

    public static bool GetKey(Keyboard.Key key) => currentKeyboardState.Contains(key);
    public static bool GetKeyDown(Keyboard.Key key) => !lastKeyboardState.Contains(key) && currentKeyboardState.Contains(key);
    public static bool GetKeyUp(Keyboard.Key key) => lastKeyboardState.Contains(key) && !currentKeyboardState.Contains(key);
}

public enum KeyIncrementerType {
    Add,
    Multiply
}

public class KeyIncrementer {
    public float Value {
        get => _value;
        set {
            _value = value;
            OnValueChanged?.Invoke(_value);
        }
    }
    private float _value;
    
    public KeyIncrementerType Type;
    public float IncrementAmount = 1f;

    public event Action<float>? OnValueChanged;

    public void Increment() {
        if (Type == KeyIncrementerType.Add) Value += IncrementAmount;
        else Value *= IncrementAmount;
    }

    public void Decrement() {
        if (Type == KeyIncrementerType.Add) Value -= IncrementAmount;
        else Value /= IncrementAmount;
    }

    public Keyboard.Key IncrementKey = Keyboard.Key.Up;
    public Keyboard.Key DecrementKey = Keyboard.Key.Down;

    public void Update() {
        if (GlobalKeyboard.GetKeyDown(IncrementKey)) Increment();
        if (GlobalKeyboard.GetKeyDown(DecrementKey)) Decrement();
    }

    public KeyIncrementer(Action<float> valueChanged, Keyboard.Key incrementKey = Keyboard.Key.Up, Keyboard.Key decrementKey = Keyboard.Key.Down, float incrementAmount = 0f, KeyIncrementerType type = KeyIncrementerType.Add) {
        Type = type;
        IncrementKey = incrementKey;
        DecrementKey = decrementKey;
        IncrementAmount = incrementAmount;
        OnValueChanged = valueChanged;
    }
}

public enum BlockType {
    Grass,
    Dirt,
    Stone,
    Snow,
    Water,
    Air
}

public class BlockLayer {
    public float Height;
    public Color Color;

    public BlockLayer(float height, Color color) {
        Height = height;
        Color = color;
    }
}

public static class Globals {
    public static Dictionary<BlockType, BlockLayer> BlockLayers = new Dictionary<BlockType, BlockLayer>() {
        { BlockType.Water, new BlockLayer(0f, new Color(0, 0, 255)) },
        { BlockType.Grass, new BlockLayer(0.6f, new Color(0, 128, 0)) },
        { BlockType.Dirt, new BlockLayer(0.7f, new Color(128, 64, 0)) },
        { BlockType.Stone, new BlockLayer(0.9f, new Color(128, 128, 140)) },
        { BlockType.Snow, new BlockLayer(1f, new Color(255, 255, 255)) },
    };
}

public class Block {
    public BlockType Type;

    public Color GetColor() {
        if (Globals.BlockLayers.ContainsKey(Type)) return Globals.BlockLayers[Type].Color;
        else return Color.Transparent;
    }

    public Block(BlockType type) => Type = type;
}

public static class Helpers {
    public static void AddRect(ref VertexArray array, float x, float y, float w, float h, Color c) {
        array.Append(new Vertex(new Vector2f(x, y), c));
        array.Append(new Vertex(new Vector2f(x + w, y), c));
        array.Append(new Vertex(new Vector2f(x + w, y + h), c));
        array.Append(new Vertex(new Vector2f(x, y + h), c));
    }
}

public class Chunk {
    public int Size = 16, BlockSize = 20;
    public float X, Y;
    public Block[,] Blocks;

    public RenderTexture Texture;
    public Sprite Sprite;
    public bool IsLoaded = false;

    public void Draw() {
        Texture.Clear(Color.Transparent);
        VertexArray array = new VertexArray(PrimitiveType.Quads);
        // Parallel.For(0, Size, x => {
        //     Parallel.For(0, Size, y => {
        //         lock (array) {
        //             Helpers.AddRect(ref array, x * BlockSize, y * BlockSize, BlockSize, BlockSize, Blocks[x, y].GetColor());
        //         }
        //     });
        // });

        for (int x = 0; x < Size; x++) {
            for (int y = 0; y < Size; y++) {
                Helpers.AddRect(ref array, x * BlockSize, y * BlockSize, BlockSize, BlockSize, Blocks[x, y].GetColor());
            }
        }

        Texture.Draw(array);
        Texture.Display();

        UpdateSprite();
    }

    // so we only draw one block if its updated, instead of rerendering the whole chunk.
    public void DrawBlock(int x, int y) {
        RectangleShape rect = new RectangleShape(new Vector2f(BlockSize, BlockSize));
        rect.Position = new Vector2f(x * BlockSize, y * BlockSize);
        rect.FillColor = Blocks[x, y].GetColor();
        Texture.Draw(rect);
        Texture.Display();

        UpdateSprite();
    }

    public void UpdateSprite() {
        Sprite = new Sprite(Texture.Texture);
        Sprite.Position = new Vector2f(X * BlockSize, Y * BlockSize);
    }

    public Chunk(int size = 16, int blockSize = 20, float x = 0, float y = 0) {
        Size = size;
        BlockSize = blockSize;

        X = x;
        Y = y;

        Blocks = new Block[Size, Size];
        Texture = new RenderTexture((uint)(Size * BlockSize), (uint)(Size * BlockSize));
    }

    public void LoadChunk(int x, int y, Noise noise) {
        IsLoaded = true;
        for (int cx = 0; cx < Size; cx++) {
            for (int cy = 0; cy < Size; cy++) {
                float value = noise.GetNoise(x + cx, y + cy);
                
                // find height relative to BlockLayers
                foreach (KeyValuePair<BlockType, BlockLayer> layer in Globals.BlockLayers) {
                    if (value < layer.Value.Height) {
                        Blocks[cx, cy] = new Block(layer.Key);
                        break;
                    }
                }

            }
        }
        Draw();
    }

    public void SetBlock(int x, int y, BlockType block) {
        Blocks[x, y] = new Block(block);
        DrawBlock(x, y);
    }
}

public class Terrain {
    public int ChunkSize = 16, BlockSize = 20;
    public Dictionary<Vector2i, Chunk> Chunks = new Dictionary<Vector2i, Chunk>();
    public Noise Noise;

    public Terrain(int chunkSize = 16, int blockSize = 20) {
        ChunkSize = chunkSize;
        BlockSize = blockSize;

        Noise = new Noise(1);
        Noise.Frequency = 0.1f;
        Noise.FractalWeightedStrength = 1.0f; // Increase amplitude for taller peaks
        Noise.Lacunarity = 2.0f; // Adjust spatial frequency
        Noise.Gain = 0.5f; // Tweak terrain roughness
        Noise.Octaves = 6; // Add more detail
    }

    public void TryLoadChunk(float x, float y) {
        int realX = (int)Math.Floor(x / ChunkSize);
        int realY = (int)Math.Floor(y / ChunkSize);
        Vector2i chunkPos = new Vector2i(realX, realY);

        if (!Chunks.ContainsKey(chunkPos)) {
            Chunk chunk = new Chunk(ChunkSize, BlockSize, realX * ChunkSize, realY * ChunkSize);
            Chunks.Add(chunkPos, chunk);
            chunk.LoadChunk(realX * ChunkSize, realY * ChunkSize, Noise);
        } else if (!Chunks[chunkPos].IsLoaded) {
            Chunks[chunkPos].LoadChunk(realX * ChunkSize, realY * ChunkSize, Noise);
        }
    }

    public void Draw(RenderWindow window) {
        
    }

    public void Draw(RenderWindow window, float x, float y) {
        TryLoadChunk(x, y);
        window.Draw(Chunks[new Vector2i((int)Math.Floor(x / ChunkSize), (int)Math.Floor(y / ChunkSize))].Sprite);
    }

    public void DrawPosition(RenderWindow window, float x, float y, float minusPosX, float minusPosY) {
        TryLoadChunk(x, y);
        // sets the chunk position to the distance of x and y from the chunk position
        Chunk c = Chunks[new Vector2i((int)Math.Floor(x / ChunkSize), (int)Math.Floor(y / ChunkSize))];
        Chunks[new Vector2i((int)Math.Floor(x / ChunkSize), (int)Math.Floor(y / ChunkSize))].Sprite.Position = new Vector2f(
            (c.X * BlockSize) - (minusPosX * BlockSize),
            (c.Y * BlockSize) - (minusPosY * BlockSize)
        );
        window.Draw(Chunks[new Vector2i((int)Math.Floor(x / ChunkSize), (int)Math.Floor(y / ChunkSize))].Sprite);
    }

    public void SetBlock(int x, int y, int chunkXp, int chunkYp, BlockType type) {
        int chunkX = (int)MathF.Floor(x / ChunkSize);
        int chunkY = (int)MathF.Floor(y / ChunkSize);

        int blockX = (int)MathF.Floor(x - (chunkX * ChunkSize));
        int blockY = (int)MathF.Floor(y - (chunkY * ChunkSize));

        if (Chunks.ContainsKey(new Vector2i(chunkX, chunkY))) {
            if (!Chunks[new Vector2i(chunkX, chunkY)].IsLoaded) TryLoadChunk(chunkX * ChunkSize, chunkY * ChunkSize);
            Chunks[new Vector2i(chunkX, chunkY)].SetBlock(chunkXp, chunkYp, type);
        } else {
            TryLoadChunk(chunkX * ChunkSize, chunkY * ChunkSize);
            Chunks[new Vector2i(chunkX, chunkY)].SetBlock(chunkXp, chunkYp, type);
        }
    }
}

public static class Program {
    public static List<KeyIncrementer> keyIncrementers = new List<KeyIncrementer>();
    public static Terrain terrain = new Terrain();
    public static int ChunkSize = 64;
    public static int BlockSize = 10;

    public static int BrushSize = 2;

    public static void Main(string[] args) {
        terrain.ChunkSize = ChunkSize;
        terrain.BlockSize = BlockSize;

        RenderWindow window = new RenderWindow(new VideoMode(1080, 720), "Noise");
        window.Closed += (sender, e) => window.Close();
        window.Resized += (sender, e) => window.SetView(new View(new FloatRect(0, 0, e.Width, e.Height)));
        window.SetVerticalSyncEnabled(false);
        window.SetKeyRepeatEnabled(false);

        DateTime start = DateTime.Now;

        window.KeyPressed += (sender, e) => GlobalKeyboard.AddKey(e.Code);
        window.KeyReleased += (sender, e) => GlobalKeyboard.RemoveKey(e.Code);

        terrain.TryLoadChunk(0, 0);

        keyIncrementers.Add(new KeyIncrementer((value) => {
            terrain.Noise.Frequency = value;
            terrain.Chunks.Clear();
        }, Keyboard.Key.F, Keyboard.Key.V, 0.1f, KeyIncrementerType.Add));

        Text fpsText = new Text("FPS: 0", new Font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"));
        fpsText.FillColor = Color.Black;
        fpsText.CharacterSize = 30;

        float xPos = 0, yPos = 0;

        while (true) {
            GlobalKeyboard.Flush();

            window.DispatchEvents();
            window.Clear(Color.Black);

            // float mouseX = Mouse.GetPosition(window).X / BlockSize;
            // float mouseY = Mouse.GetPosition(window).Y / BlockSize;

            // // draw 3x3 around mosue
            // for (int x = -1; x < 2; x++) {
            //     for (int y = -1; y < 2; y++) {
            //         terrain.Draw(window, mouseX + (x * ChunkSize), mouseY + (y * ChunkSize));
            //     }
            // }

            // cover screen
            double width = Math.Ceiling((double)(window.Size.X / BlockSize) / ChunkSize) + 1;
            double height = Math.Ceiling((double)(window.Size.Y / BlockSize) / ChunkSize) + 1;

            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    terrain.DrawPosition(window, (x * ChunkSize) + xPos, (y * ChunkSize) + yPos, xPos, yPos);
                }
            }

            float mouseX = (float)Mouse.GetPosition(window).X / (float)BlockSize;
            float mouseY = (float)Mouse.GetPosition(window).Y / (float)BlockSize;

            // mouseX in blocks, including xPos/yPos
            float mouseBlockX = mouseX + xPos;
            float mouseBlockY = mouseY + yPos;

            Vector2i mouseChunkPos = new Vector2i(
                (int)Math.Floor(mouseBlockX / ChunkSize),
                (int)Math.Floor(mouseBlockY / ChunkSize)
            );

            // make red box around chunk
            if (terrain.Chunks.ContainsKey(mouseChunkPos)) {
                Chunk c = terrain.Chunks[mouseChunkPos];

                // draw redRect at the position of the pixel under the mouse
                RectangleShape redRect = new RectangleShape(new Vector2f(BlockSize * BrushSize, BlockSize * BrushSize));

                float mouseRelativePosX = mouseBlockX % ChunkSize;
                float mouseRelativePosY = mouseBlockY % ChunkSize;
                
                Vector2i newPos = new Vector2i(
                    // (int)Math.Ceiling((double)((int)mouseRelativePosX * BlockSize)),
                    // (int)mouseRelativePosY * BlockSize
                    (int)(mouseBlockX - (mouseChunkPos.X * ChunkSize)) * BlockSize,
                    (int)(mouseBlockY - (mouseChunkPos.Y * ChunkSize)) * BlockSize
                );

                redRect.Position = new Vector2f(
                    (c.Sprite.Position.X + newPos.X) - (((BrushSize - 1) / 2) * BlockSize),
                    (c.Sprite.Position.Y + newPos.Y) - (((BrushSize - 1) / 2) * BlockSize)
                );

                if (GlobalKeyboard.GetKeyDown(Keyboard.Key.O)) {
                    // set all blocks to air in chunk
                    for (int x = 0; x < ChunkSize; x++) {
                        for (int y = 0; y < ChunkSize; y++) {
                            terrain.Chunks[mouseChunkPos].SetBlock(x, y, BlockType.Grass);
                        }
                    }
                }
                
                if (Mouse.IsButtonPressed(Mouse.Button.Left)) {
                    for (int x = 0; x < BrushSize; x++) {
                        for (int y = 0; y < BrushSize; y++) {
                            terrain.SetBlock(
                                (int)(Math.Floor(mouseBlockX - (mouseChunkPos.X * ChunkSize)) + x) + (int)(mouseChunkPos.X * ChunkSize),
                                (int)(Math.Floor(mouseBlockY - (mouseChunkPos.Y * ChunkSize)) + y) + (int)(mouseChunkPos.Y * ChunkSize),
                                (int)(Math.Floor(mouseBlockX - (mouseChunkPos.X * ChunkSize)) + x) + ((int)(mouseChunkPos.X * ChunkSize) % ChunkSize),
                                (int)(Math.Floor(mouseBlockY - (mouseChunkPos.Y * ChunkSize)) + y) + ((int)(mouseChunkPos.Y * ChunkSize) % ChunkSize),
                                BlockType.Grass
                            );
                        }
                    }
                }

                redRect.FillColor = Color.Transparent;
                redRect.OutlineColor = Color.Red;
                redRect.OutlineThickness = 2;
                window.Draw(redRect);


            }
            
            fpsText.DisplayedString = $"FPS: {1f / (DateTime.Now - start).TotalSeconds}";
            window.Draw(fpsText);

            float dt = (float)(DateTime.Now - start).TotalSeconds;

            if (GlobalKeyboard.GetKey(Keyboard.Key.Right)) xPos += 100 * dt;
            if (GlobalKeyboard.GetKey(Keyboard.Key.Left)) xPos -= 100 * dt;
            if (GlobalKeyboard.GetKey(Keyboard.Key.Up)) yPos -= 100 * dt;
            if (GlobalKeyboard.GetKey(Keyboard.Key.Down)) yPos += 100 * dt;

            start = DateTime.Now;

            if (GlobalKeyboard.GetKeyDown(Keyboard.Key.R)) {
                // delete all chunks
                terrain.Chunks.Clear();
            }

            for (int i = 0; i < keyIncrementers.Count; i++) {
                keyIncrementers[i].Update();
            }

            window.Display();
        }
    }
}
