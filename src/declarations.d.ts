// IMAGENS
declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.jpeg" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

// SVG (caso use sem transformer)
declare module "*.svg" {
  const value: any;
  export default value;
}

// ÁUDIO
declare module "*.mp3" {
  const value: number; // React Native trata como number (require)
  export default value;
}

declare module "*.wav" {
  const value: number;
  export default value;
}

declare module "*.m4a" {
  const value: number;
  export default value;
}

// VÍDEO
declare module "*.mp4" {
  const value: number;
  export default value;
}

declare module 'lodash.debounce';