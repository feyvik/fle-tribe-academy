/** FLE Tribe Tailwind preset. Import fle-tokens.css once in your app, then add this file to `presets` in tailwind.config.js. */
/** @type {import("tailwindcss").Config} */
module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "surface": "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        "surface-sunken": "var(--surface-sunken)",
        "line": "var(--line)",
        "line-strong": "var(--line-strong)",
        "ink": "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "primary": "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-soft": "var(--primary-soft)",
        "on-primary": "var(--on-primary)",
        "lime": "var(--lime)",
        "on-lime": "var(--on-lime)",
        "lime-ink": "var(--lime-ink)",
        "lime-soft": "var(--lime-soft)",
        "coral": "var(--coral)",
        "on-coral": "var(--on-coral)",
        "coral-ink": "var(--coral-ink)",
        "coral-soft": "var(--coral-soft)",
        "danger": "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        "warning": "var(--warning)",
        "warning-soft": "var(--warning-soft)",
        "brand-blue": "var(--brand-blue)",
        "raisin": "var(--raisin)",
        "on-raisin": "var(--on-raisin)",
        "focus-ring": "var(--focus-ring)",
        "link": "var(--link)"
      },
      "fontFamily": {
        "heading": [
          "var(--font-heading)"
        ],
        "body": [
          "var(--font-body)"
        ],
        "mono": [
          "var(--font-mono)"
        ]
      },
      "spacing": {
        "s1": "var(--space-1)",
        "s2": "var(--space-2)",
        "s3": "var(--space-3)",
        "s4": "var(--space-4)",
        "s5": "var(--space-5)",
        "s6": "var(--space-6)",
        "s7": "var(--space-7)",
        "s8": "var(--space-8)"
      },
      "borderRadius": {
        "sm": "var(--radius-sm)",
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "full": "var(--radius-full)"
      },
      "boxShadow": {
        "sm": "var(--shadow-sm)",
        "md": "var(--shadow-md)"
      },
      "fontSize": {
        "display": [
          "48px",
          {
            "lineHeight": "52px",
            "fontWeight": "800",
            "letterSpacing": "-0.02em"
          }
        ],
        "h1": [
          "36px",
          {
            "lineHeight": "42px",
            "fontWeight": "700",
            "letterSpacing": "-0.01em"
          }
        ],
        "h2": [
          "28px",
          {
            "lineHeight": "34px",
            "fontWeight": "700"
          }
        ],
        "h3": [
          "22px",
          {
            "lineHeight": "28px",
            "fontWeight": "700"
          }
        ],
        "h4": [
          "18px",
          {
            "lineHeight": "24px",
            "fontWeight": "600"
          }
        ],
        "body-lg": [
          "18px",
          {
            "lineHeight": "28px",
            "fontWeight": "400"
          }
        ],
        "body": [
          "16px",
          {
            "lineHeight": "24px",
            "fontWeight": "400"
          }
        ],
        "body-sm": [
          "14px",
          {
            "lineHeight": "20px",
            "fontWeight": "400"
          }
        ],
        "label": [
          "14px",
          {
            "lineHeight": "20px",
            "fontWeight": "600"
          }
        ],
        "overline": [
          "12px",
          {
            "lineHeight": "16px",
            "fontWeight": "700",
            "letterSpacing": "0.08em"
          }
        ],
        "code": [
          "14px",
          {
            "lineHeight": "22px",
            "fontWeight": "400"
          }
        ]
      }
    }
  }
};
