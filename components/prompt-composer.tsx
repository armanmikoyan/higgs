"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { ArrowRight, Plus, Video } from "lucide-react";
import { useTypingCycle } from "@/components/magicui/typing-animation";
import { usePaywall } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { models } from "@/lib/models";
import { formatUSD, getQuote } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Mode = "video" | "image";

const RATIOS: Record<Mode, string[]> = {
  video: ["9:16", "16:9", "1:1", "4:3", "3:4", "21:9"],
  image: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "4:5", "5:4", "21:9"],
};

const PROMPT_IDEAS = [
  "A neon samurai walking through rain in Osaka, shot on 35mm film",
  "An astronaut drifting through a violet nebula, IMAX cinematography",
  "Liquid chrome morphing into a human face, macro lens",
  "A woman crossing a salt flat at dusk, 85mm portrait",
] as const;

const MAX_FILES = 3;

function RatioShape({ ratio }: { ratio: string }) {
  const [w, h] = ratio.split(":").map(Number);
  const max = 14;
  const width = w >= h ? max : (max * w) / h;
  const height = w >= h ? (max * h) / w : max;

  return (
    <span
      className="block rounded-[3px] border border-current"
      style={{ width, height }}
    />
  );
}

function FileThumb({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const isImage = file.type.startsWith("image/");
  const url = useMemo(
    () => (isImage ? URL.createObjectURL(file) : null),
    [file, isImage]
  );

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <div
      className="group relative size-14 shrink-0 overflow-hidden rounded-xl border border-cream/20 bg-ink-3"
      title={file.name}
    >
      {isImage && url ? (
        <div
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url("${url}")` }}
          role="img"
          aria-label={file.name}
        />
      ) : (
        <span className="grid size-full place-items-center text-cream/60">
          <Video className="size-4" />
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-ink/85 p-0 text-[11px] leading-none font-normal text-cream/90 hover:bg-jade hover:text-ink"
      >
        ×
      </Button>
    </div>
  );
}

const selectItemStyles =
  "gap-2.5 rounded-xl py-2 pr-8 pl-2.5 text-sm text-cream/85 focus:outline-none focus-visible:outline-none data-[highlighted]:bg-cream/10 data-[highlighted]:text-cream data-[state=checked]:bg-jade/10 data-[state=checked]:text-jade data-[highlighted]:data-[state=checked]:bg-jade/10 data-[highlighted]:data-[state=checked]:text-jade [&>span:last-child]:gap-2.5 [&_svg]:size-3.5";

const selectContentStyles =
  "z-[80] max-h-[260px] min-w-[200px] rounded-2xl border border-cream/15 bg-ink-2/95 p-1.5 text-cream shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl ring-0 [&>div]:space-y-0.5 [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden";

const selectTriggerStyles =
  "h-9 w-auto gap-1.5 rounded-full border border-cream/15 bg-ink/60 py-0 pl-3 pr-2.5 text-sm text-cream/85 hover:border-cream/30 hover:bg-cream/5 focus-visible:border-cream/15 focus-visible:ring-0 data-[state=open]:border-jade/50 [&>svg]:size-3 [&>svg]:text-cream/60 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180 [&_[data-slot=select-value]>span:first-child]:size-4";

export default function PromptComposer() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(models[0].name);
  const [ratio, setRatio] = useState(RATIOS.video[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openPaywall } = usePaywall();
  const typedPlaceholder = useTypingCycle(PROMPT_IDEAS);
  const estimate = formatUSD(getQuote(1).unit);
  const canGenerate = prompt.trim().length > 0;

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    setFiles((current) => [...current, ...valid].slice(0, MAX_FILES));
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <Card className="relative mx-auto w-full max-w-3xl gap-0 overflow-hidden rounded-[22px] border border-cream/20 bg-ink-2/95 py-0 text-left text-cream shadow-[0_30px_100px_rgba(0,0,0,0.55)] ring-0 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_30%_0%,rgba(94,199,165,0.09),transparent_65%)]" />

      <div className="relative p-3 md:p-4">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            aria-label="Prompt"
            className="min-h-[68px] w-full resize-none field-sizing-fixed rounded-none border-0 bg-transparent px-1 py-0 text-[15px] leading-relaxed text-cream shadow-none placeholder:text-cream/45 outline-none focus:outline-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:disabled:bg-transparent md:min-h-[76px] md:text-base"
          />
          {prompt.length === 0 && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-1 top-0 text-[15px] leading-relaxed text-cream/45 md:text-base"
            >
              {typedPlaceholder}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
          {files.map((file, index) => (
            <FileThumb
              key={`${file.name}-${file.size}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}

          {files.length < MAX_FILES && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              aria-label="Add reference — click or drop an image or video"
              title="Click or drop an image / video"
              className={cn(
                "grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-dashed p-0 outline-none transition-colors focus:outline-none hover:bg-transparent",
                isDragging
                  ? "border-jade bg-jade/10 text-jade hover:bg-jade/10"
                  : "border-cream/25 text-cream/60 hover:border-jade/50 hover:text-jade"
              )}
            >
              <Plus className="size-4" />
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFiles}
            className="hidden"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-cream/10 pt-2.5">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger
              aria-label="Model"
              className={selectTriggerStyles}
            >
              <SelectValue className="max-w-[130px] truncate" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              sideOffset={8}
              className={selectContentStyles}
            >
              {models.map((item) => (
                <SelectItem
                  key={item.name}
                  value={item.name}
                  className={selectItemStyles}
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ratio} onValueChange={setRatio}>
            <SelectTrigger
              aria-label="Aspect ratio"
              className={selectTriggerStyles}
            >
              <SelectValue className="max-w-[130px] truncate" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              sideOffset={8}
              className={selectContentStyles}
            >
              {RATIOS.video.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className={selectItemStyles}
                >
                  <span className="grid size-5 shrink-0 place-items-center">
                    <RatioShape ratio={item} />
                  </span>
                  <span>{item}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-cream/55">
                Per video
              </span>
              <span className="text-base font-medium tabular-nums text-cream">
                {estimate}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => openPaywall(1)}
              disabled={!canGenerate}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-cream px-4 text-sm font-medium text-ink outline-none transition-colors hover:bg-jade hover:text-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generate
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
