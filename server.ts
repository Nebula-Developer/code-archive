// nextJS server
import express from "express";
import next from "next";
import { Sequelize, DataTypes, Model } from "sequelize";
import api from "./api";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "nebuladev",
  password: "mazzys123",
  database: "anxiousdoggies",
});

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;

  declare addRemedy: (remedy: Remedy) => Promise<void>;
  declare getRemedies: () => Promise<Remedy[]>;
  declare removeRemedy: (remedy: Remedy) => Promise<void>;
}

export class Remedy extends Model {
  declare id: number;
  declare remedies: string;
  declare dosage: string;
  declare animalName: string;
  declare animalBirthday: string;
  declare description: string;
  declare causes: string;
  declare duration: string;
  declare purchaseId: number;
  declare address: string;

  declare getUser: () => Promise<User>;
  declare setUser: (user: User) => Promise<void>;
}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "user" }
);

Remedy.init(
  {
    remedies: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animalBirthday: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    causes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "remedy" }
);

User.hasMany(Remedy);
Remedy.belongsTo(User);

sequelize.sync({ force: true }).then(async () => {
  const server = express();

  process.on("SIGINT", async () => {
    await sequelize.close();
    process.exit();
  });

  server.use(express.json());

  server.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
          // console.error(err);
          return res.status(400).send({ status: 400, message: err.message }); // Bad request
      }
      next();
  });
  
  server.use("/api", api);

  (server as any).listen(3000, (err: any) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});

// Path: api.ts
