import { Op } from "sequelize";
import Place, { getPlace, placePixel } from "./models/Place";
import { Result } from "./server";

/**
 * Base configuraiton for setting up a game.
 */
type PlaceGameConfig = {
  mapSize: { width: number; height: number };
};

/**
 * Class that manages the interactions with the Place game.
 * Do not instantiate this class directly, use `PlaceGameManager.getInstance()` instead.
 */
export class PlaceGameManager {
  private static instance: PlaceGameManager;

  /**
   * Gets the singleton instance of the PlaceGameManager.
   * @returns The PlaceGameManager instance.
   */
  static getInstance(): PlaceGameManager {
    if (!PlaceGameManager.instance) {
      PlaceGameManager.instance = new PlaceGameManager({
        mapSize: { width: 50, height: 50 },
      });
    }
    return PlaceGameManager.instance;
  }

  private constructor(config: PlaceGameConfig) {
    this.mapSize = config.mapSize;
  }

  /**
   * The size of the map.
   */
  mapSize: PlaceGameConfig["mapSize"];

  /**
   * Events that are triggered when the map size is updated.
   */
  updateMapSizeEvents: Array<(mapSize: PlaceGameConfig["mapSize"]) => void> =
    [];

  /**
   * Events that are triggered when a tile is updated.
   */
  updateTileEvents: Array<
    (x: number, y: number, color: string, ownerId: number) => void
  > = [];

  /**
   * Places or updates a tile on the map.
   * @param x The x coordinate of the tile.
   * @param y The y coordinate of the tile.
   * @param color The color of the tile.
   * @param ownerId The ID of the owner of the tile.
   * @param callback The callback to call when the operation is complete.
   * @returns
   */
  async placeTile(
    x: number,
    y: number,
    color: string,
    ownerId: number,
    callback: (res: Result) => void,
  ) {
    if (x < 0 || x >= this.mapSize.width || y < 0 || y >= this.mapSize.height) {
      callback({ success: false, error: "Tile out of bounds" });
      return;
    }

    await placePixel(x, y, color, ownerId);
    this.updateTileEvents.forEach((event) => event(x, y, color, ownerId));
    callback({ success: true });
  }

  /**
   * Gets the tile at the specified coordinates.
   * @param x The x coordinate of the tile.
   * @param y The y coordinate of the tile.
   * @returns The tile at the specified coordinates.
   */
  async getTile(x: number, y: number) {
    return await getPlace(x, y);
  }

  /**
   * Sets the size of the map.
   * @param width The width of the map.
   * @param height The height of the map.
   * @returns A boolean indicating if the operation was successful.
   */
  async setMapSize(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      return false;
    }

    this.mapSize = { width, height };
    this.updateMapSizeEvents.forEach((event) => event(this.mapSize));
    return true;
  }

  /**
   * Gets a 2D array of the map within the specified range.
   * @param x The x coordinate of the range.
   * @param y The y coordinate of the range.
   * @param width The width of the range.
   * @param height The height of the range.
   * @returns A 2D array of the map within the specified range.
   */
  async getTileMapRange(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Promise<Array<Array<Place>>> {
    const places = await Place.findAll({
      where: {
        x: {
          [Op.gte]: x,
          [Op.lt]: x + width,
        },
        y: {
          [Op.gte]: y,
          [Op.lt]: y + height,
        },
      },
    });

    const map: Array<Array<Place>> = [...Array(width)].map(() => Array(height));

    places.forEach((place) => {
      map[place.x][place.y] = place;
    });

    return map;
  }

  /**
   * Gets the entire map.
   * @returns A 2D array of the entire map.
   */
  async getTileMap(): Promise<Array<Array<Place>>> {
    return await this.getTileMapRange(
      0,
      0,
      this.mapSize.width,
      this.mapSize.height,
    );
  }

  /**
   * Loads the game manager instance.
   */
  async load() {
    /* So JS instanstiates the class */
  }
}

/**
 * The singleton instance of the PlaceGameManager.
 *
 * Use this instance to interact with the Place game.
 */
const PlaceGame = PlaceGameManager.getInstance();
export default PlaceGame;
