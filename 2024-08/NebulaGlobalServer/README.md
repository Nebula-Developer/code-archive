# Nebula Global Server

### This is a private repository for the Nebula Global Server. It is not meant for public viewing.

### Setup

This project uses [Bun](https://bun.sh) as a runtime environment, although any other typescript runtimes should work (e.g. Node.js / TSX).

- Run `bun dev` for a development server
- Run `bun start` for a production server

All static configuration is in `.env`. The administration password will automatically change in the instance that it is different in the environment than the database.
