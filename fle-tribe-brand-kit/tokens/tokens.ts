/** FLE Tribe tokens for TypeScript/JavaScript (charts, canvas, emails). In components prefer the CSS variables. */
export const tokens = {
  "colors": {
    "surface": {
      "light": "#FAF9FC",
      "dark": "#141217"
    },
    "surface-raised": {
      "light": "#FFFFFF",
      "dark": "#1E1B22"
    },
    "surface-sunken": {
      "light": "#F2EFF7",
      "dark": "#0F0E11"
    },
    "line": {
      "light": "#E3DEEC",
      "dark": "#322E38"
    },
    "line-strong": {
      "light": "#857D92",
      "dark": "#7A7386"
    },
    "ink": {
      "light": "#2A292C",
      "dark": "#F4F3F6"
    },
    "ink-muted": {
      "light": "#5E5866",
      "dark": "#ADA6B8"
    },
    "primary": {
      "light": "#3F09C9",
      "dark": "#A68BFF"
    },
    "primary-hover": {
      "light": "#3207A1",
      "dark": "#BBA6FF"
    },
    "primary-soft": {
      "light": "#ECE6FC",
      "dark": "#251A4D"
    },
    "on-primary": {
      "light": "#FFFFFF",
      "dark": "#141216"
    },
    "lime": {
      "light": "#B6FF00",
      "dark": "#B6FF00"
    },
    "on-lime": {
      "light": "#2A292C",
      "dark": "#2A292C"
    },
    "lime-ink": {
      "light": "#3D5E00",
      "dark": "#B6FF00"
    },
    "lime-soft": {
      "light": "#F0FFD1",
      "dark": "#24300A"
    },
    "coral": {
      "light": "#F44446",
      "dark": "#F65A5C"
    },
    "on-coral": {
      "light": "#FFFFFF",
      "dark": "#FFFFFF"
    },
    "coral-ink": {
      "light": "#C2272A",
      "dark": "#FF9496"
    },
    "coral-soft": {
      "light": "#FFE8E8",
      "dark": "#3A1617"
    },
    "danger": {
      "light": "#9E1219",
      "dark": "#FFA39E"
    },
    "danger-soft": {
      "light": "#FDE8E6",
      "dark": "#3A1614"
    },
    "warning": {
      "light": "#8A5300",
      "dark": "#F5C04A"
    },
    "warning-soft": {
      "light": "#FFF2D6",
      "dark": "#33270A"
    },
    "brand-blue": {
      "light": "#3F09C9",
      "dark": "#3F09C9"
    },
    "raisin": {
      "light": "#2A292C",
      "dark": "#3A393C"
    },
    "on-raisin": {
      "light": "#FFFFFF",
      "dark": "#FFFFFF"
    },
    "focus-ring": {
      "light": "#3F09C9",
      "dark": "#A68BFF"
    },
    "link": {
      "light": "#3F09C9",
      "dark": "#A68BFF"
    }
  },
  "brand": {
    "chryslerBlue": "#3F09C9",
    "raisinBlack": "#2A292C",
    "white": "#FFFFFF",
    "lime": "#B6FF00",
    "coral": "#F44446"
  },
  "fonts": {
    "heading": "Montserrat, \"Segoe UI\", system-ui, sans-serif",
    "body": "\"Plus Jakarta Sans\", system-ui, -apple-system, \"Segoe UI\", sans-serif",
    "mono": "\"JetBrains Mono\", ui-monospace, Menlo, Consolas, monospace"
  },
  "spacing": {
    "space-1": "4px",
    "space-2": "8px",
    "space-3": "12px",
    "space-4": "16px",
    "space-5": "24px",
    "space-6": "32px",
    "space-7": "48px",
    "space-8": "64px"
  },
  "radius": {
    "radius-sm": "6px",
    "radius-md": "10px",
    "radius-lg": "16px",
    "radius-full": "999px"
  }
} as const;

export type ColorToken = keyof typeof tokens.colors;
