export type VideoModel = {
  name: string;
  provider: string;
};

export const models: VideoModel[] = [
  { name: "VEO 3.1", provider: "Google" },
  { name: "SORA 2", provider: "OpenAI" },
  { name: "KLING 2.5", provider: "Kuaishou" },
  { name: "SEEDANCE 2.5", provider: "ByteDance" },
  { name: "WAN 2.5", provider: "Alibaba" },
  { name: "HAILUO 02", provider: "MiniMax" },
];
