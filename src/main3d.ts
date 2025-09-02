import { boot } from "./preview3d";

boot().catch(err => console.error("Failed to boot 3D preview:", err));
