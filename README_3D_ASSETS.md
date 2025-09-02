# Fofr Pedro - 3D Assets Pack

## 📁 Struktura 3D modelů

```
public/assets/3d/
├── characters/
│   └── kenney3d_char_pedro.glb     # Hlavní postava Pedro
├── props/
│   ├── kenney3d_prop_scooter.glb   # Koloběžka (speedster)
│   ├── kenney3d_prop_car01.glb     # Auto 1 (SUV)
│   └── kenney3d_prop_car02.glb     # Auto 2 (racer)
└── env/
    ├── kenney3d_env_house01.glb    # Dům 1
    ├── kenney3d_env_house02.glb    # Dům 2
    ├── kenney3d_env_tree01.glb     # Strom
    ├── kenney3d_env_bush01.glb     # Keř
    ├── kenney3d_env_sign01.glb     # Cedule
    └── kenney3d_env_trash.glb      # Odpadkový koš (bedna)
```

## 🚀 Spuštění

```bash
npm install
npm run dev
```

Otevři `http://localhost:5173/index3d.html` pro 3D preview.

## 🎮 3D Preview

- **Ovládání**: Myš pro rotaci kamery, kolečko pro zoom
- **Modely**: Všechny .glb soubory se načítají automaticky
- **Pozice**: Modely jsou rozmístěné po scéně pro lepší přehled

## 📝 Použití v kódu

```typescript
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const gltf = await loader.loadAsync("/assets/3d/characters/kenney3d_char_pedro.glb");
scene.add(gltf.scene);
```

## 🎨 Zdroje modelů

- **Postavy**: Kenney Starter Kit 3D Platformer
- **Vozítka**: Kenney Toy Car Kit  
- **Prostředí**: Kenney City Kit, Nature Kit, Platformer Kit

Všechny modely jsou ve formátu .glb (optimalizované pro web).

