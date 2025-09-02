// This allows TypeScript to understand imports for these file types.
// Useful when using a bundler like Vite or Webpack with asset handling.
declare module '*.glb' {
    const src: string;
    export default src;
}

declare module '*.fbx' {
    const src: string;
    export default src;
}
