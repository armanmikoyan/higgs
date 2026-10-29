export type Clip = {
  id: string;
  src: string;
  poster: string;
  color: string;
  title: string;
  prompt: string;
  model: string;
  duration: string;
};

const vids = [
  { src: "/videos/clip-1.mp4", poster: "/posters/clip-1.jpg", color: "#1a3a2a" },
  { src: "/videos/clip-2.mp4", poster: "/posters/clip-2.jpg", color: "#1a2a3a" },
];

export const clips: Clip[] = [];
const models = [
  "VEO 3.1",
  "SORA 2",
  "KLING 2.5",
  "SEEDANCE 2.5",
  "WAN 2.5",
  "HAILUO 02",
];

let idx = 1;
models.forEach((model) => {
  for (let i = 0; i < 5; i++) {
    const v = vids[idx % 2];
    clips.push({
      id: `clip-${idx.toString().padStart(2, "0")}`,
      src: v.src,
      poster: v.poster,
      color: v.color,
      title: `${model} clip ${i + 1}`,
      prompt: `Sample prompt for ${model} variation ${i + 1}`,
      model,
      duration: "0:06",
    });
    idx++;
  }
});
