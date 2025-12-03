// https://vike.dev/config

import vikeSolid from "vike-solid/config";
import type { Config } from "vike/types";
import Layout from "../layouts/LayoutDefault.js";

export default {
  Layout,

  title: "My Vike App",
  description: "Demo showcasing Vike",

  passToClient: ["user"],
  extends: vikeSolid,
} satisfies Config;
