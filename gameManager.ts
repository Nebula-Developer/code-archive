import { Op } from "sequelize";
import Place, { getPlace, placePixel } from "./models/Place";

type GameConfig = {
  mapSize: { width: number; height: number };
};

export type Result = { success: boolean; data?: any; error?: string };

export class GameManager {
  private static instance: GameManager;

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager({
        mapSize: { width: 50, height: 50 },
      });
    }
    return GameManager.instance;
  }

  private constructor(config: GameConfig) {
    this.mapSize = config.mapSize;
  }

  mapSize: GameConfig["mapSize"];

  updateMapSizeEvents: Array<(mapSize: GameConfig["mapSize"]) => void> = [];
  updateTileEvents: Array<
    (x: number, y: number, color: string, ownerId: number) => void
  > = [];

  async placeTile(
    x: number,
    y: number,
    color: string,
    ownerId: number,
    callback: (res: Result) => void
  ) {
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) {
      callback({ success: false, error: "Tile out of bounds" });
      return;
    }

    await placePixel(x, y, color, ownerId);
    this.updateTileEvents.forEach((event) => event(x, y, color, ownerId));
    callback({ success: true });
  }

  async getTile(x: number, y: number) {
    return await getPlace(x, y);
  }

  async setMapSize(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      return false;
    }

    this.mapSize = { width, height };
    this.updateMapSizeEvents.forEach((event) => event(this.mapSize));
    return true;
  }

  async getTileMapRange(
    width: number,
    height: number
  ): Promise<Array<Array<Place>>> {
    var places = await Place.findAll({
      where: {
        x: { [Op.lt]: width },
        y: { [Op.lt]: height },
      },
    });

    var map: Array<Array<Place>> = [...Array(width)].map(() => Array(height));

    places.forEach((place) => {
      map[place.x][place.y] = place;
    });

    return map;
  }

  async getTileMap(): Promise<Array<Array<Place>>> {
    return await this.getTileMapRange(this.mapSize.width, this.mapSize.height);
  }

  async load() {
    /* So JS instanstiates the class */
  }
}

const Game = GameManager.getInstance();
export default Game;
