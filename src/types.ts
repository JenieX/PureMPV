export interface Options {
  copy_mode: CopyMode;
  pure_mode: boolean;
  pure_box: boolean;
  pure_webm: boolean;
  ffmpeg_params: string;
  purewebm_extra_params: string;
  input_seeking: boolean;
  selection: Selection;
  copy_utility: CopyUtility;
  cropbox_animation: boolean;
  [id: string]: string | number | boolean;
}

export interface MousePos {
  x: number;
  y: number;
}

export type Selection = "primary" | "clipboard";
export type CopyUtility = "detect" | "xclip" | "wl-copy";
export type CopyMode = "ffmpeg" | "purewebm";