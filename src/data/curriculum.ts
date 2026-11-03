import type { Phase, Week } from './models';

// Course content: a 5-month (20-week) main course, w0–w19, plus optional bonus courses (track "bonus")
// that open once the main course is complete. Lesson ids follow "<week>-<day>", e.g. "w3-tue".
// Videos and PDFs are attached by admins (Admin → Lesson media).

export const PHASES: Phase[] = [
  {
    "name": "Month 1 · Foundations",
    "weekIds": [
      "w0",
      "w1",
      "w2",
      "w3"
    ]
  },
  {
    "name": "Month 2 · Layout, Bootstrap & JavaScript",
    "weekIds": [
      "w4",
      "w5",
      "w6",
      "w7"
    ]
  },
  {
    "name": "Month 3 · JavaScript & workflow",
    "weekIds": [
      "w8",
      "w9",
      "w10",
      "w11"
    ]
  },
  {
    "name": "Month 4 · React",
    "weekIds": [
      "w12",
      "w13",
      "w14",
      "w15"
    ]
  },
  {
    "name": "Month 5 · Ship it",
    "weekIds": [
      "w16",
      "w17",
      "w18",
      "w19"
    ]
  },
  {
    "name": "Bonus courses (optional)",
    "weekIds": [
      "ts",
      "tw",
      "ship",
      "ai"
    ]
  }
];

export const WEEKS: Week[] = [
  {
    "id": "w0",
    "number": "00",
    "title": "Tech, careers & what frontend is",
    "goal": "Understand the industry you are entering, the roles inside it, and exactly where a frontend developer fits, so the next 5 months make sense.",
    "lessons": [
      {
        "id": "w0-mon",
        "day": "mon",
        "title": "What is \"tech\"?",
        "learn": [
          "Tech as an industry vs tech as a skill: every company now runs on software",
          "The main areas: software engineering, data, cloud & infrastructure, cybersecurity, design (UI/UX), product & project management, QA",
          "Who pays for software: product companies, agencies, startups, banks, governments, freelancing"
        ],
        "research": [
          "Name 5 apps you used today. Which company built each, and how does it make money?",
          "What is the difference between a product company and an agency?"
        ],
        "resources": [
          {
            "label": "roadmap.sh",
            "url": "https://roadmap.sh"
          }
        ]
      },
      {
        "id": "w0-tue",
        "day": "tue",
        "title": "Career paths in tech",
        "learn": [
          "Engineering roles: frontend, backend, full‑stack, mobile, DevOps/cloud, QA/test automation",
          "Non‑coding roles that work with you daily: UI/UX designer, product manager, scrum master, technical writer",
          "Levels: intern → junior → mid → senior → lead / staff, and what changes at each level (scope, independence, mentoring)"
        ],
        "research": [
          "Find 3 real junior frontend job ads. List every skill they ask for.",
          "Which skills appear in all 3? Which ones appear only once?"
        ],
        "resources": [
          {
            "label": "Frontend roadmap",
            "url": "https://roadmap.sh/frontend"
          }
        ]
      },
      {
        "id": "w0-wed",
        "day": "wed",
        "title": "What frontend is, and what it is not",
        "learn": [
          "Frontend = everything the user sees and touches in the browser: layout, styling, interaction, accessibility, performance",
          "It is not: running servers, designing databases, managing cloud infrastructure, or training AI models",
          "Gray areas you will touch: calling APIs, reading designs in Figma, deployment, server‑side rendering"
        ],
        "research": [
          "Explain frontend vs backend using a restaurant analogy.",
          "Is building a Figma design frontend work? Is writing the API it calls? Why?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started"
          }
        ]
      },
      {
        "id": "w0-thu",
        "day": "thu",
        "title": "How to learn like a developer",
        "learn": [
          "Reading documentation instead of only watching videos",
          "Asking good questions: what you tried, what you expected, what happened",
          "Keeping a learning journal (one note per day: learned, confused about, next)",
          "Set up: a modern browser (Chrome or Firefox), a GitHub account, a notes app"
        ],
        "research": [
          "What makes a good question on a forum? Find one good and one bad example.",
          "Create your GitHub account and write your first journal entry."
        ],
        "resources": [
          {
            "label": "How to ask (Stack Overflow)",
            "url": "https://stackoverflow.com/help/how-to-ask"
          },
          {
            "label": "GitHub sign up",
            "url": "https://github.com/signup"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w0-fri",
      "title": "My Path map",
      "brief": "Write a one‑to‑two page document that shows you understand the journey you are starting.",
      "doneWhen": [
        "Analyse 3 junior frontend job ads: role, company type, required skills",
        "Sort these 12 tasks into Frontend / Not frontend / Gray area, with one sentence of reasoning each: build a login form, design the users table, fix a button that overlaps on mobile, configure a cloud server, make a page load faster, write an API endpoint, add keyboard navigation, train a recommendation model, turn a Figma design into a page, set up CI/CD, add dark mode, call a weather API and show the result",
        "Your 5‑month personal goal in 3 sentences"
      ],
      "submit": "A shared Google Doc link"
    },
    "review": {
      "id": "w0-sat",
      "questions": [
        "Which role surprised you the most, and why?",
        "Share your sort of the 12 tasks. Where did the group disagree?",
        "What does a typical day for a junior frontend developer look like?"
      ]
    },
    "extra": "orientation"
  },
  {
    "id": "w1",
    "number": "01",
    "title": "The internet & the browser",
    "goal": "Explain step by step what happens between typing a URL and seeing a page.",
    "lessons": [
      {
        "id": "w1-mon",
        "day": "mon",
        "title": "What is the internet?",
        "learn": [
          "Networks, routers, ISPs and undersea cables",
          "IP addresses and packets",
          "Client and server: who asks, who answers"
        ],
        "research": [
          "What is the difference between the internet and the web?",
          "How does data physically reach your phone?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work"
          }
        ]
      },
      {
        "id": "w1-tue",
        "day": "tue",
        "title": "DNS, domains & HTTP",
        "learn": [
          "Domain names and DNS lookup",
          "Hosting: where a website actually lives",
          "HTTP requests and responses, methods (GET, POST), status codes (200, 301, 404, 500)",
          "HTTPS and why the padlock matters"
        ],
        "research": [
          "What happens if DNS fails?",
          "What do 2xx, 3xx, 4xx and 5xx codes mean?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Glossary/DNS"
          }
        ]
      },
      {
        "id": "w1-wed",
        "day": "wed",
        "title": "What is a browser?",
        "learn": [
          "Browser parts: UI, rendering engine, JavaScript engine, networking",
          "How a page renders: HTML → DOM, CSS → CSSOM, render tree, layout, paint",
          "Engines: Blink (Chrome, Edge), Gecko (Firefox), WebKit (Safari)"
        ],
        "research": [
          "Why can a site look different in Safari and Chrome?",
          "What is the critical rendering path?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work"
          }
        ]
      },
      {
        "id": "w1-thu",
        "day": "thu",
        "title": "Browser DevTools",
        "learn": [
          "Elements panel: inspect and live‑edit HTML/CSS",
          "Console: run JavaScript, read errors",
          "Network panel: every request, its size and time",
          "Lighthouse: a first look at performance and accessibility scores"
        ],
        "research": [
          "How many requests does your favourite news site make on load?",
          "What is the largest file it downloads?"
        ],
        "resources": [
          {
            "label": "Chrome DevTools",
            "url": "https://developer.chrome.com/docs/devtools"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w1-fri",
      "title": "Trace a page load",
      "brief": "Pick any public website and document its journey from URL to pixels.",
      "doneWhen": [
        "Explain, in your own words, the 8–10 steps from typing the URL to seeing the page",
        "Screenshot the Network tab and label: the HTML document, a CSS file, a JS file, an image",
        "Report 3 status codes you found and what they mean",
        "Run Lighthouse and list the top 2 suggestions it gives"
      ],
      "submit": "A shared Google Doc link with screenshots"
    },
    "review": {
      "id": "w1-sat",
      "questions": [
        "Walk the group through your page load in under 3 minutes.",
        "What surprised you in the Network tab?",
        "Where does frontend responsibility start and end in this journey?"
      ]
    }
  },
  {
    "id": "w2",
    "number": "02",
    "title": "HTML: structure & meaning",
    "goal": "Write clean, semantic, accessible HTML pages by hand.",
    "lessons": [
      {
        "id": "w2-mon",
        "day": "mon",
        "title": "Documents, elements & attributes",
        "learn": [
          "Document structure: <code>&lt;!doctype&gt;</code>, <code>html</code>, <code>head</code>, <code>body</code>",
          "Elements, attributes, nesting, void elements",
          "Meta tags, title, linking files"
        ],
        "research": [
          "What does the <code>head</code> do if nothing in it is visible?",
          "Why does the <code>lang</code> attribute matter?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"
          }
        ]
      },
      {
        "id": "w2-tue",
        "day": "tue",
        "title": "Semantic HTML",
        "learn": [
          "Headings hierarchy, paragraphs, lists, links, images",
          "Landmarks: <code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>article</code>, <code>footer</code>",
          "When to use <code>div</code> and <code>span</code> and when not to"
        ],
        "research": [
          "Why is <code>&lt;button&gt;</code> better than a clickable <code>&lt;div&gt;</code>?",
          "How do screen readers use headings?"
        ],
        "resources": [
          {
            "label": "web.dev",
            "url": "https://web.dev/learn/html"
          }
        ]
      },
      {
        "id": "w2-wed",
        "day": "wed",
        "title": "Forms",
        "learn": [
          "<code>form</code>, <code>input</code> types, <code>label</code>, <code>select</code>, <code>textarea</code>",
          "Built‑in validation: <code>required</code>, <code>type=\"email\"</code>, <code>pattern</code>",
          "How form data is sent (GET vs POST)"
        ],
        "research": [
          "Why must every input have a label?",
          "Which input type gives a number keypad on phones?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms"
          }
        ]
      },
      {
        "id": "w2-thu",
        "day": "thu",
        "title": "Accessibility basics",
        "learn": [
          "Alt text that describes purpose",
          "Keyboard navigation and focus",
          "A light introduction to ARIA (and why semantic HTML comes first)",
          "Validating your HTML"
        ],
        "research": [
          "Navigate a website with only the keyboard. What broke?",
          "What is WCAG?"
        ],
        "resources": [
          {
            "label": "web.dev",
            "url": "https://web.dev/learn/accessibility"
          },
          {
            "label": "W3C validator",
            "url": "https://validator.w3.org"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w2-fri",
      "title": "Personal profile page",
      "brief": "Build a single HTML page about yourself using only HTML, no CSS.",
      "doneWhen": [
        "Uses header, nav, main, at least 2 sections, footer",
        "A photo with meaningful alt text, a list of skills, links to your GitHub",
        "A contact form with name, email, message, all labelled and validated",
        "Passes the W3C validator with zero errors"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w2-sat",
      "questions": [
        "Show your page with CSS disabled. Does it still make sense?",
        "Which semantic element were you unsure about?",
        "Live demo: tab through each other's forms."
      ]
    }
  },
  {
    "id": "w3",
    "number": "03",
    "title": "CSS I: selectors, box model & text",
    "goal": "Style pages with CSS: pick elements, control spacing and size, and set fonts and colours.",
    "lessons": [
      {
        "id": "w3-mon",
        "day": "mon",
        "title": "Selectors, cascade & units",
        "learn": [
          "Selectors: element, class, id, attribute, pseudo‑classes",
          "The cascade, specificity and inheritance",
          "Units: <code>px</code>, <code>rem</code>, <code>%</code>, <code>vw</code>; colors and fonts"
        ],
        "research": [
          "Why do two rules fight, and who wins?",
          "Why prefer <code>rem</code> for font sizes?"
        ],
        "resources": [
          {
            "label": "web.dev",
            "url": "https://web.dev/learn/css"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction"
          }
        ]
      },
      {
        "id": "w3-tue",
        "day": "tue",
        "title": "The box model",
        "learn": [
          "Content, padding, border and margin",
          "<code>box-sizing: border-box</code> and why everyone uses it",
          "Width, height, <code>max-width</code> and overflow",
          "Margins collapsing, and using DevTools to see the box"
        ],
        "research": [
          "Why is my element wider than the width I set?",
          "Inspect any website's button in DevTools. What are its padding and margin?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model"
          }
        ]
      },
      {
        "id": "w3-wed",
        "day": "wed",
        "title": "Text, fonts & colour",
        "learn": [
          "Font families, sizes, weights and line height",
          "Using Google Fonts",
          "Colours: names, hex, <code>rgb()</code> and <code>hsl()</code>",
          "Contrast: making text readable for everyone"
        ],
        "research": [
          "Pick two Google Fonts that work together. Why do they pair well?",
          "Find a website with text that is hard to read. What would you change?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling/Fundamentals"
          },
          {
            "label": "Google Fonts",
            "url": "https://fonts.google.com"
          }
        ]
      },
      {
        "id": "w3-thu",
        "day": "thu",
        "title": "Display & positioning",
        "learn": [
          "<code>display</code>: block, inline, inline-block, none",
          "<code>position</code>: static, relative, absolute, fixed, sticky",
          "<code>z-index</code> and stacking",
          "When to use positioning, and when to use layout instead"
        ],
        "research": [
          "When would you use <code>position: sticky</code>?",
          "Place a badge in the corner of a card with absolute positioning."
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Positioning"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w3-fri",
      "title": "Give your profile page style",
      "brief": "Style your Week 02 profile page with your own CSS (layout comes next week).",
      "doneWhen": [
        "An external stylesheet linked from your HTML",
        "Two Google Fonts and a consistent colour palette (at least 3 colours)",
        "Comfortable spacing using padding and margin",
        "Text that passes a contrast check",
        "Visible focus styles on links and buttons"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w3-sat",
      "questions": [
        "Show your page before and after CSS.",
        "Which CSS rule surprised you the most?",
        "How did you choose your fonts and colours?"
      ]
    }
  },
  {
    "id": "w4",
    "number": "04",
    "title": "CSS II: layout & responsive design",
    "goal": "Lay out pages with Flexbox and Grid that work on any screen, from a phone to a laptop.",
    "lessons": [
      {
        "id": "w4-mon",
        "day": "mon",
        "title": "Flexbox",
        "learn": [
          "Main axis vs cross axis",
          "<code>justify-content</code>, <code>align-items</code>, <code>gap</code>, <code>flex-wrap</code>",
          "Common patterns: navbars, centered content, card rows"
        ],
        "research": [
          "How do you center something both ways?",
          "Play all levels of Flexbox Froggy."
        ],
        "resources": [
          {
            "label": "Flexbox Froggy",
            "url": "https://flexboxfroggy.com"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox"
          }
        ]
      },
      {
        "id": "w4-tue",
        "day": "tue",
        "title": "CSS Grid",
        "learn": [
          "Columns and rows: <code>grid-template-columns</code>, <code>fr</code>, <code>repeat()</code>",
          "Gaps and placing items",
          "Named grid areas for page layouts",
          "When to use Grid and when to use Flexbox"
        ],
        "research": [
          "When is Grid better than Flexbox?",
          "Play the first 10 levels of Grid Garden."
        ],
        "resources": [
          {
            "label": "Grid Garden",
            "url": "https://cssgridgarden.com"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids"
          }
        ]
      },
      {
        "id": "w4-wed",
        "day": "wed",
        "title": "Media queries & mobile-first",
        "learn": [
          "The viewport meta tag",
          "Media queries: changing styles at a screen width",
          "Mobile-first: start small, add styles as the screen grows",
          "Testing with DevTools' device toolbar"
        ],
        "research": [
          "What does mobile-first mean in practice?",
          "Make a 3-column layout that becomes 1 column on phones."
        ],
        "resources": [
          {
            "label": "web.dev: media queries",
            "url": "https://web.dev/learn/design/media-queries"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries"
          }
        ]
      },
      {
        "id": "w4-thu",
        "day": "thu",
        "title": "Fluid layouts & responsive images",
        "learn": [
          "Flexible widths with %, <code>max-width</code> and <code>min()</code>",
          "Grids that wrap without media queries (<code>auto-fit</code>, <code>minmax()</code>)",
          "Responsive images: <code>max-width: 100%</code>, <code>srcset</code>",
          "No sideways scrolling: finding what overflows"
        ],
        "research": [
          "How can a grid change its number of columns without a media query?",
          "Find what makes a page scroll sideways using DevTools."
        ],
        "resources": [
          {
            "label": "web.dev: responsive images",
            "url": "https://web.dev/learn/design/responsive-images"
          },
          {
            "label": "web.dev: responsive design",
            "url": "https://web.dev/learn/design"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w4-fri",
      "title": "Make your profile page responsive",
      "brief": "Lay out your profile page with Flexbox and Grid so it works on phones and laptops.",
      "doneWhen": [
        "Flexbox for the navigation, Grid for a skills or projects section",
        "Works at 375px (phone) and 1280px (laptop) with no sideways scrolling",
        "At least one media query, written mobile-first",
        "Images never overflow their containers"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w4-sat",
      "questions": [
        "Show your page at phone and laptop width.",
        "Which CSS bug took you the longest?",
        "Flexbox or Grid: which did you reach for, and why?"
      ]
    }
  },
  {
    "id": "w5",
    "number": "05",
    "title": "Bootstrap: responsive layouts fast",
    "goal": "Build responsive, good-looking pages quickly with Bootstrap 5.",
    "lessons": [
      {
        "id": "w5-mon",
        "day": "mon",
        "title": "What a CSS framework is & adding Bootstrap",
        "learn": [
          "What a CSS framework gives you: a ready-made grid, components and consistent styling, and the trade-offs",
          "Adding Bootstrap 5 to a page with the CDN <code>&lt;link&gt;</code> and <code>&lt;script&gt;</code> tags",
          "Finding and copying components from the Bootstrap docs",
          "Containers, and why Bootstrap is mobile-first"
        ],
        "research": [
          "What problems does a CSS framework solve, and what can it make harder?",
          "Add Bootstrap to a blank page with the CDN link and style one button. What changed?"
        ],
        "resources": [
          {
            "label": "Bootstrap: Get started",
            "url": "https://getbootstrap.com/docs/5.3/getting-started/introduction/"
          },
          {
            "label": "Bootstrap: Containers",
            "url": "https://getbootstrap.com/docs/5.3/layout/containers/"
          }
        ]
      },
      {
        "id": "w5-tue",
        "day": "tue",
        "title": "The grid system",
        "learn": [
          "Containers, rows and columns",
          "The 12-column grid",
          "Breakpoints: <code>col-sm</code>, <code>col-md</code>, <code>col-lg</code>",
          "Gutters, and aligning columns with flex utilities"
        ],
        "research": [
          "How would you show 1 column on phones and 3 on laptops?",
          "What does <code>.row</code> do, and why must columns sit inside it?"
        ],
        "resources": [
          {
            "label": "Bootstrap: Grid",
            "url": "https://getbootstrap.com/docs/5.3/layout/grid/"
          },
          {
            "label": "Bootstrap: Breakpoints",
            "url": "https://getbootstrap.com/docs/5.3/layout/breakpoints/"
          }
        ]
      },
      {
        "id": "w5-wed",
        "day": "wed",
        "title": "Components",
        "learn": [
          "The navbar, with a menu that collapses on phones",
          "Cards, buttons and badges",
          "Forms and Bootstrap's validation styles",
          "Modals, alerts and accordions, and the JavaScript bundle they need"
        ],
        "research": [
          "Why does the navbar's mobile menu need Bootstrap's JavaScript?",
          "Build a grid of 3 product cards that stacks on phones."
        ],
        "resources": [
          {
            "label": "Bootstrap: Navbar",
            "url": "https://getbootstrap.com/docs/5.3/components/navbar/"
          },
          {
            "label": "Bootstrap: Card",
            "url": "https://getbootstrap.com/docs/5.3/components/card/"
          }
        ]
      },
      {
        "id": "w5-thu",
        "day": "thu",
        "title": "Utilities & making it yours",
        "learn": [
          "Spacing utilities: <code>m-</code>, <code>p-</code>, <code>gap-</code>",
          "Display, flex, text and colour utilities",
          "Changing Bootstrap's colours with CSS variables",
          "Keeping it accessible: contrast, labels and visible focus"
        ],
        "research": [
          "Change Bootstrap's primary colour to the FLE TRIBE purple (#3f09c9).",
          "When would you write your own CSS instead of using a utility class?"
        ],
        "resources": [
          {
            "label": "Bootstrap: Spacing utilities",
            "url": "https://getbootstrap.com/docs/5.3/utilities/spacing/"
          },
          {
            "label": "Bootstrap: CSS variables",
            "url": "https://getbootstrap.com/docs/5.3/customize/css-variables/"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w5-fri",
      "title": "Landing page in Bootstrap",
      "brief": "Build a responsive landing page for a made-up product (a study-planner app) with Bootstrap 5.",
      "doneWhen": [
        "Sections: navbar, hero, 3 features, pricing (3 plans), FAQ (accordion), footer",
        "1 column on phones, 3 columns on laptops",
        "Your own brand colour and font",
        "Lighthouse accessibility score 90+"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w5-sat",
      "questions": [
        "Show your page at phone and laptop width.",
        "Which Bootstrap components did you use, and what did you customise?",
        "Bootstrap vs your Week 04 CSS: what felt faster, and what felt worse?"
      ]
    }
  },
  {
    "id": "w6",
    "number": "06",
    "title": "JavaScript I: the basics",
    "goal": "Write small programs that store values, make decisions, repeat work and reuse code with functions.",
    "lessons": [
      {
        "id": "w6-mon",
        "day": "mon",
        "title": "Variables, types & operators",
        "learn": [
          "<code>let</code>, <code>const</code> (and why not <code>var</code>)",
          "Strings, numbers, booleans, null, undefined",
          "Operators, template literals, <code>===</code> vs <code>==</code>"
        ],
        "research": [
          "What does <code>typeof null</code> return and why?",
          "When should you use <code>const</code>?"
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/first-steps"
          }
        ]
      },
      {
        "id": "w6-tue",
        "day": "tue",
        "title": "Conditions: making decisions",
        "learn": [
          "<code>if</code>, <code>else if</code>, <code>else</code>",
          "Comparison and logical operators: <code>===</code>, <code>&&</code>, <code>||</code>, <code>!</code>",
          "Truthy and falsy values",
          "The ternary operator and <code>switch</code>"
        ],
        "research": [
          "Why should you use <code>===</code> instead of <code>==</code>?",
          "Write code that prints a grade (A–F) for a score."
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/ifelse"
          },
          {
            "label": "javascript.info",
            "url": "https://javascript.info/logical-operators"
          }
        ]
      },
      {
        "id": "w6-wed",
        "day": "wed",
        "title": "Loops: repeating work",
        "learn": [
          "<code>for</code> loops",
          "<code>while</code> loops",
          "<code>for...of</code> to go through a list",
          "<code>break</code>, <code>continue</code> and avoiding infinite loops"
        ],
        "research": [
          "Print the numbers 1 to 100, but \"Fizz\" for multiples of 3 and \"Buzz\" for multiples of 5.",
          "When would you use <code>while</code> instead of <code>for</code>?"
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/while-for"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Loops"
          }
        ]
      },
      {
        "id": "w6-thu",
        "day": "thu",
        "title": "Functions",
        "learn": [
          "Declaring and calling functions",
          "Parameters, arguments and return values",
          "Arrow functions",
          "Why small functions with one job are easier to test"
        ],
        "research": [
          "What is the difference between a parameter and an argument?",
          "Rewrite your grade code as a function that returns the letter."
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/function-basics"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Functions"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w6-fri",
      "title": "Console programs",
      "brief": "Write four small programs that run in the browser console.",
      "doneWhen": [
        "A tip calculator function: bill and percentage in, tip out",
        "FizzBuzz from 1 to 100",
        "A temperature converter (Celsius ↔ Fahrenheit) as two functions",
        "A function that returns a letter grade for any score, with tests in comments"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w6-sat",
      "questions": [
        "Explain one of your functions line by line.",
        "What error message confused you most this week?",
        "How did you test your code?"
      ]
    }
  },
  {
    "id": "w7",
    "number": "07",
    "title": "JavaScript II: arrays, objects & modern JS",
    "goal": "Work with lists and records of data, and write clean modern JavaScript.",
    "lessons": [
      {
        "id": "w7-mon",
        "day": "mon",
        "title": "Arrays",
        "learn": [
          "Creating arrays and reading items by index",
          "Adding and removing: <code>push</code>, <code>pop</code>, <code>shift</code>, <code>splice</code>",
          "<code>length</code>, <code>includes</code>, <code>indexOf</code>",
          "Looping through arrays"
        ],
        "research": [
          "What is the index of the last item in any array?",
          "Write a function that returns the largest number in an array."
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/array"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays"
          }
        ]
      },
      {
        "id": "w7-tue",
        "day": "tue",
        "title": "Objects",
        "learn": [
          "Objects as records: keys and values",
          "Dot and bracket notation",
          "Nested objects and arrays of objects",
          "Destructuring and the spread operator"
        ],
        "research": [
          "Model a student as an object with a name and three scores.",
          "What is the difference between copying an object and referencing it?"
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/object"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_basics"
          }
        ]
      },
      {
        "id": "w7-wed",
        "day": "wed",
        "title": "Array methods: map, filter & reduce",
        "learn": [
          "<code>map</code>: transform every item",
          "<code>filter</code>: keep the items you want",
          "<code>find</code> and <code>some</code>",
          "<code>reduce</code>: combine into one value"
        ],
        "research": [
          "Rewrite a <code>for</code> loop using <code>map</code>.",
          "Use <code>filter</code> and <code>reduce</code> to total the prices of items in stock."
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
          }
        ]
      },
      {
        "id": "w7-thu",
        "day": "thu",
        "title": "Scope, modules & debugging",
        "learn": [
          "Scope and closures (gently)",
          "ES modules: <code>import</code> / <code>export</code>",
          "Reading errors, <code>console.log</code>, breakpoints in DevTools"
        ],
        "research": [
          "Set a breakpoint and step through a function.",
          "What is a closure in one sentence?"
        ],
        "resources": [
          {
            "label": "Debug JS in Chrome",
            "url": "https://developer.chrome.com/docs/devtools/javascript"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w7-fri",
      "title": "Student grade book",
      "brief": "Write a JavaScript program (run in the browser console or a page) that manages a list of students.",
      "doneWhen": [
        "Store at least 6 students as objects: name, three scores",
        "Functions to compute each average, the class average, the top student",
        "Use <code>map</code>, <code>filter</code> and <code>reduce</code> at least once each",
        "Print a letter grade (A–F) for each student"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w7-sat",
      "questions": [
        "Explain one function line by line.",
        "What error message confused you most?",
        "How did you use the debugger?"
      ]
    }
  },
  {
    "id": "w8",
    "number": "08",
    "title": "JavaScript III: the DOM & events",
    "goal": "Make pages interactive: change what's on screen and respond to clicks, typing and forms.",
    "lessons": [
      {
        "id": "w8-mon",
        "day": "mon",
        "title": "The DOM",
        "learn": [
          "What the DOM is",
          "Selecting: <code>querySelector</code>, <code>querySelectorAll</code>",
          "Changing text, attributes, classes; creating and removing elements"
        ],
        "research": [
          "How is the DOM different from your HTML file?",
          "Why is <code>textContent</code> safer than <code>innerHTML</code>?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"
          }
        ]
      },
      {
        "id": "w8-tue",
        "day": "tue",
        "title": "Creating & updating elements",
        "learn": [
          "<code>document.createElement</code>, <code>append</code> and <code>remove</code>",
          "Changing text, attributes and classes",
          "Rendering a list of items from an array",
          "Why <code>textContent</code> is safer than <code>innerHTML</code>"
        ],
        "research": [
          "Show an array of 5 products as a list on the page.",
          "What can go wrong when you put user input into <code>innerHTML</code>?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement"
          },
          {
            "label": "javascript.info",
            "url": "https://javascript.info/modifying-document"
          }
        ]
      },
      {
        "id": "w8-wed",
        "day": "wed",
        "title": "Events",
        "learn": [
          "<code>addEventListener</code>: click, input, submit, keydown",
          "The event object, <code>preventDefault</code>",
          "Event delegation"
        ],
        "research": [
          "What is event bubbling?",
          "Why does a form reload the page, and how do you stop it?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events"
          }
        ]
      },
      {
        "id": "w8-thu",
        "day": "thu",
        "title": "Forms with JavaScript",
        "learn": [
          "Reading form values",
          "Stopping the page reload with <code>preventDefault</code>",
          "Validating input and showing friendly error messages",
          "Clearing and resetting the form after submit"
        ],
        "research": [
          "Validate an email field and show a message under it.",
          "When should validation happen: on typing, on leaving a field, or on submit?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation"
          },
          {
            "label": "javascript.info",
            "url": "https://javascript.info/forms-submit"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w8-fri",
      "title": "Interactive to-do list",
      "brief": "Build a to-do list app with plain HTML, CSS (or Bootstrap) and JavaScript.",
      "doneWhen": [
        "Add tasks with a form; empty tasks show an error message",
        "Mark tasks done and delete them",
        "Filter: all, active, done",
        "Shows a friendly message when the list is empty"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w8-sat",
      "questions": [
        "Demo adding, completing and deleting a task.",
        "How did you keep the screen in sync with your data?",
        "What would break if you used <code>innerHTML</code> for task names?"
      ]
    }
  },
  {
    "id": "w9",
    "number": "09",
    "title": "JavaScript IV: async & APIs",
    "goal": "Fetch live data from an API and show it with loading, error and empty states.",
    "lessons": [
      {
        "id": "w9-mon",
        "day": "mon",
        "title": "Promises & async/await",
        "learn": [
          "Synchronous vs asynchronous code",
          "Promises: pending, fulfilled, rejected",
          "<code>async</code>/<code>await</code>",
          "<code>try/catch</code> for errors"
        ],
        "research": [
          "What does <code>await</code> actually wait for?",
          "Write a function that waits 2 seconds, then logs a message."
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS"
          },
          {
            "label": "javascript.info",
            "url": "https://javascript.info/async-await"
          }
        ]
      },
      {
        "id": "w9-tue",
        "day": "tue",
        "title": "fetch & JSON",
        "learn": [
          "What an API is",
          "<code>fetch</code> and reading a JSON response",
          "Query parameters in URLs",
          "Checking <code>response.ok</code>"
        ],
        "research": [
          "Call a public API from the console and log the result.",
          "What happens when a fetch fails because there is no internet?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
          },
          {
            "label": "Open-Meteo API",
            "url": "https://open-meteo.com/en/docs"
          }
        ]
      },
      {
        "id": "w9-wed",
        "day": "wed",
        "title": "Loading, error & empty states",
        "learn": [
          "Every request has four states: loading, success, error, empty",
          "Showing a spinner or skeleton while loading",
          "Friendly error messages and a \"Try again\" button",
          "Testing slow networks with DevTools throttling"
        ],
        "research": [
          "Design the four states for a weather app before writing code.",
          "Throttle your network to Slow 3G. What does your app show?"
        ],
        "resources": [
          {
            "label": "Chrome DevTools: throttling",
            "url": "https://developer.chrome.com/docs/devtools/network#throttle"
          }
        ]
      },
      {
        "id": "w9-thu",
        "day": "thu",
        "title": "Storage & putting it together",
        "learn": [
          "<code>localStorage</code> for saving small data",
          "<code>try/catch</code>",
          "Structuring a small app: state → render → events"
        ],
        "research": [
          "What should never be saved in localStorage?",
          "Sketch the state of a todo app as an object."
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w9-fri",
      "title": "Weather now",
      "brief": "Build a small web app that shows the current weather for a city the user types.",
      "doneWhen": [
        "Uses the free Open‑Meteo API (no key needed)",
        "Shows loading, success and error states",
        "Remembers the last 5 searches with localStorage",
        "Styled and responsive with your own CSS"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w9-sat",
      "questions": [
        "Demo your app with the network throttled to Slow 3G.",
        "How did you structure your code?",
        "What would change if the API needed a secret key?"
      ]
    }
  },
  {
    "id": "w10",
    "number": "10",
    "title": "Developer workflow I: the terminal & Git",
    "goal": "Use the terminal confidently and track every change to your code with Git.",
    "lessons": [
      {
        "id": "w10-mon",
        "day": "mon",
        "title": "The terminal",
        "learn": [
          "Why developers use a terminal",
          "Navigate: <code>pwd</code>, <code>ls</code>, <code>cd</code>, <code>mkdir</code>, <code>touch</code>, <code>rm</code>",
          "Paths: absolute vs relative"
        ],
        "research": [
          "Create a folder structure for this course using only the terminal.",
          "What does <code>~</code> mean?"
        ],
        "resources": [
          {
            "label": "Command line crash course (MDN)",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line"
          }
        ]
      },
      {
        "id": "w10-tue",
        "day": "tue",
        "title": "Git basics",
        "learn": [
          "What version control is and why every team uses it",
          "<code>git init</code>, <code>status</code>, <code>add</code>, <code>commit</code>, <code>log</code>",
          "The staging area",
          "Writing clear commit messages"
        ],
        "research": [
          "What is the difference between Git and GitHub?",
          "Put your to-do list app under Git with 3 meaningful commits."
        ],
        "resources": [
          {
            "label": "Pro Git book",
            "url": "https://git-scm.com/book/en/v2"
          },
          {
            "label": "Learn Git Branching",
            "url": "https://learngitbranching.js.org"
          }
        ]
      },
      {
        "id": "w10-wed",
        "day": "wed",
        "title": "Branches & merging",
        "learn": [
          "Why branches: work on a feature without breaking main",
          "<code>git switch -c</code>, <code>git merge</code>",
          "Merge conflicts: what they are and how to fix one",
          "Deleting branches you've finished with"
        ],
        "research": [
          "Create a conflict on purpose and fix it.",
          "Play the first levels of Learn Git Branching."
        ],
        "resources": [
          {
            "label": "Pro Git: branching",
            "url": "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging"
          },
          {
            "label": "Learn Git Branching",
            "url": "https://learngitbranching.js.org"
          }
        ]
      },
      {
        "id": "w10-thu",
        "day": "thu",
        "title": "Undoing mistakes & .gitignore",
        "learn": [
          "<code>git restore</code>: throw away changes to a file",
          "<code>git commit --amend</code> for the last commit",
          "<code>git revert</code>: safely undo a commit",
          "<code>.gitignore</code>: keep secrets and junk out of Git"
        ],
        "research": [
          "What should never be committed to Git?",
          "Undo a commit with <code>git revert</code> and explain what happened."
        ],
        "resources": [
          {
            "label": "Pro Git: undoing things",
            "url": "https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w10-fri",
      "title": "Your projects under Git",
      "brief": "Put every project you've built so far under Git, the way a professional would.",
      "doneWhen": [
        "One Git repository per project, each with at least 3 meaningful commits",
        "A <code>.gitignore</code> in each project",
        "One feature built on a branch and merged into main",
        "One merge conflict created and resolved (describe it in your notes)"
      ],
      "submit": "A shared link (CodePen, Google Drive or GitHub)"
    },
    "review": {
      "id": "w10-sat",
      "questions": [
        "Show your commit history. Do the messages tell a story?",
        "Walk us through the conflict you resolved.",
        "What's one Git command you'll use every day?"
      ]
    }
  },
  {
    "id": "w11",
    "number": "11",
    "title": "Developer workflow II: GitHub, npm & teamwork",
    "goal": "Share code on GitHub, work with others through pull requests, and use npm and a professional editor setup.",
    "lessons": [
      {
        "id": "w11-mon",
        "day": "mon",
        "title": "GitHub: remotes, push & pull",
        "learn": [
          "Creating a repository on GitHub",
          "<code>git remote</code>, <code>push</code>, <code>pull</code>, <code>clone</code>",
          "README files",
          "Keeping your local copy in sync"
        ],
        "research": [
          "What makes a README useful?",
          "Push all your projects to GitHub."
        ],
        "resources": [
          {
            "label": "GitHub Docs",
            "url": "https://docs.github.com/en/get-started"
          }
        ]
      },
      {
        "id": "w11-tue",
        "day": "tue",
        "title": "Pull requests & code review",
        "learn": [
          "What a pull request is",
          "Opening a PR from a branch",
          "Reviewing code kindly: comments, suggestions, approvals",
          "Issues: tracking bugs and tasks"
        ],
        "research": [
          "Open a pull request on your own repo and review it as if it were someone else's.",
          "What makes a code review comment helpful?"
        ],
        "resources": [
          {
            "label": "GitHub: about pull requests",
            "url": "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"
          }
        ]
      },
      {
        "id": "w11-wed",
        "day": "wed",
        "title": "Node & npm",
        "learn": [
          "Node.js: JavaScript outside the browser",
          "npm and <code>package.json</code>",
          "Installing packages: dependencies and devDependencies",
          "npm scripts: <code>npm run dev</code>, <code>npm run build</code>"
        ],
        "research": [
          "What is <code>node_modules</code> and why is it in <code>.gitignore</code>?",
          "What's the difference between dependencies and devDependencies?"
        ],
        "resources": [
          {
            "label": "Node.js",
            "url": "https://nodejs.org/en/learn"
          },
          {
            "label": "npm docs",
            "url": "https://docs.npmjs.com/about-npm"
          }
        ]
      },
      {
        "id": "w11-thu",
        "day": "thu",
        "title": "Your editor: VS Code, Prettier & ESLint",
        "learn": [
          "VS Code basics: the file explorer, search and the built-in terminal",
          "Prettier: format your code automatically",
          "ESLint: catch mistakes before you run the code",
          "Format on save"
        ],
        "research": [
          "Set up Prettier to format on save. What changed in your code?",
          "What kind of bug can a linter catch?"
        ],
        "resources": [
          {
            "label": "VS Code: getting started",
            "url": "https://code.visualstudio.com/docs/getstarted/getting-started"
          },
          {
            "label": "Prettier",
            "url": "https://prettier.io/docs/install"
          },
          {
            "label": "ESLint",
            "url": "https://eslint.org/docs/latest/use/getting-started"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w11-fri",
      "title": "Everything on GitHub",
      "brief": "Move all your work to GitHub and practise the team workflow.",
      "doneWhen": [
        "Every project pushed to GitHub, each with a README",
        "One feature added on a branch and merged through a pull request",
        "One project with a <code>package.json</code> and at least one npm script",
        "Your best repositories pinned on your GitHub profile"
      ],
      "submit": "GitHub profile link"
    },
    "review": {
      "id": "w11-sat",
      "questions": [
        "Show your commit history. Do the messages tell a story?",
        "Walk through your pull request.",
        "How did reviewing your own pull request feel?"
      ]
    }
  },
  {
    "id": "w12",
    "number": "12",
    "title": "React I: components, JSX & state",
    "goal": "Create a React app with Vite and build UI from components, props and state.",
    "lessons": [
      {
        "id": "w12-mon",
        "day": "mon",
        "title": "Why React & setting up with Vite",
        "learn": [
          "The problem frameworks solve: keeping the screen in sync with your data as apps grow",
          "React, Angular, Vue and Svelte at a glance. React is a UI library you combine with other tools",
          "Create a project: <code>npm create vite@latest</code> with the React template",
          "Project files: <code>index.html</code>, <code>main.jsx</code>, <code>App.jsx</code>; adding Bootstrap to the project"
        ],
        "research": [
          "Why do so many companies choose React?",
          "What does each file in <code>src/</code> do?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/creating-a-react-app"
          }
        ]
      },
      {
        "id": "w12-tue",
        "day": "tue",
        "title": "Components, JSX & props",
        "learn": [
          "Function components and the rules of JSX (one root, <code>className</code>, <code>{}</code> expressions)",
          "Passing data into components with props",
          "Composition and <code>children</code>; splitting a page into components"
        ],
        "research": [
          "Draw your landing page as a component tree.",
          "What's the difference between props and state?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/your-first-component"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/passing-props-to-a-component"
          }
        ]
      },
      {
        "id": "w12-wed",
        "day": "wed",
        "title": "Lists, conditions & events",
        "learn": [
          "Rendering lists with <code>map</code> and why each item needs a <code>key</code>",
          "Conditional rendering with <code>&&</code> and the ternary operator",
          "Handling events: <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>"
        ],
        "research": [
          "What goes wrong if you use the array index as a key?",
          "Build a <code>ProductCard</code> list from an array."
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/rendering-lists"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/responding-to-events"
          }
        ]
      },
      {
        "id": "w12-thu",
        "day": "thu",
        "title": "State with useState",
        "learn": [
          "<code>useState</code> and re-rendering",
          "Updating arrays and objects without mutating them",
          "Derived values: calculate during render instead of storing copies",
          "Lifting state up to share it between components"
        ],
        "research": [
          "Build a counter, then a filter that shows a live count.",
          "Why should you never do <code>items.push()</code> on state?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/state-a-components-memory"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/updating-arrays-in-state"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w12-fri",
      "title": "Product catalogue",
      "brief": "Build a React + Bootstrap app that lists products and lets the user filter them.",
      "doneWhen": [
        "At least 4 components (header, search bar, product list, product card)",
        "Products kept in state; the filtered list and count are calculated during render",
        "Search by name and filter by category",
        "Empty state when nothing matches; responsive grid with Bootstrap"
      ],
      "submit": "GitHub repo link"
    },
    "review": {
      "id": "w12-sat",
      "questions": [
        "Show your component tree.",
        "How does data flow from parent to child and back up?",
        "What clicked about state, and what didn't?"
      ]
    }
  },
  {
    "id": "w13",
    "number": "13",
    "title": "React II: state, forms & sharing data",
    "goal": "Decide where state lives, build forms, and share data across your app.",
    "lessons": [
      {
        "id": "w13-mon",
        "day": "mon",
        "title": "Thinking in React & lifting state",
        "learn": [
          "Breaking a design into components",
          "Finding the minimal state",
          "Lifting state up to the closest shared parent",
          "Passing functions down as props to change state"
        ],
        "research": [
          "Draw the component tree for a to-do app. Where does the task list live?",
          "What does \"lifting state up\" solve?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/thinking-in-react"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/sharing-state-between-components"
          }
        ]
      },
      {
        "id": "w13-tue",
        "day": "tue",
        "title": "Forms",
        "learn": [
          "Controlled inputs: value + <code>onChange</code>",
          "Validation and showing errors only after the user touches a field",
          "A first look at React Hook Form"
        ],
        "research": [
          "When would you reach for a form library?",
          "Write a validator for \"due date can't be in the past\"."
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/reference/react-dom/components/input"
          },
          {
            "label": "React Hook Form",
            "url": "https://react-hook-form.com/get-started"
          }
        ]
      },
      {
        "id": "w13-wed",
        "day": "wed",
        "title": "Context",
        "learn": [
          "Prop drilling and when it becomes a problem",
          "<code>createContext</code>, a Provider and <code>useContext</code>",
          "What belongs in Context (and what doesn't)",
          "Keeping Context small"
        ],
        "research": [
          "When is passing props better than Context?",
          "Share a theme (light/dark) through Context."
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/passing-data-deeply-with-context"
          }
        ]
      },
      {
        "id": "w13-thu",
        "day": "thu",
        "title": "Custom hooks",
        "learn": [
          "What a custom hook is: reusable logic that uses other hooks",
          "Naming: always start with <code>use</code>",
          "Example: <code>useLocalStorage</code>",
          "Example: <code>useToggle</code>"
        ],
        "research": [
          "Write a <code>useLocalStorage</code> hook.",
          "Which logic in your projects could become a custom hook?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/reusing-logic-with-custom-hooks"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w13-fri",
      "title": "Task manager, part 1",
      "brief": "Build a single-page task manager in React + Bootstrap.",
      "doneWhen": [
        "Add tasks with a validated form: title required, due date not in the past, priority",
        "Tasks shared through Context",
        "Saved with a <code>useLocalStorage</code> custom hook",
        "Filter by status: all, active, done"
      ],
      "submit": "GitHub repo link"
    },
    "review": {
      "id": "w13-sat",
      "questions": [
        "Demo adding and completing a task.",
        "Why did you put state where you did?",
        "Show your custom hook and explain it."
      ]
    }
  },
  {
    "id": "w14",
    "number": "14",
    "title": "React III: effects & routing",
    "goal": "Synchronise with the outside world using effects, and build multi-page apps with React Router.",
    "lessons": [
      {
        "id": "w14-mon",
        "day": "mon",
        "title": "Effects & the component lifecycle",
        "learn": [
          "What a side effect is; <code>useEffect</code> and its dependency array",
          "Cleaning up: timers, subscriptions, <code>AbortController</code>",
          "When you don't need an effect"
        ],
        "research": [
          "Why does an effect with no dependency array run on every render?",
          "Rewrite one effect from your catalogue as a calculation during render."
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/synchronizing-with-effects"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/you-might-not-need-an-effect"
          }
        ]
      },
      {
        "id": "w14-tue",
        "day": "tue",
        "title": "Routing with React Router",
        "learn": [
          "Routes, <code>Link</code>, <code>NavLink</code> and active styles",
          "Route parameters with <code>useParams</code> (<code>/tasks/:id</code>)",
          "Nested layouts with <code>Outlet</code>; a 404 page",
          "Lazy loading pages with <code>React.lazy</code>"
        ],
        "research": [
          "What is the benefit of lazy loading?",
          "How do you read a route parameter?"
        ],
        "resources": [
          {
            "label": "React Router",
            "url": "https://reactrouter.com/start/declarative/routing"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/reference/react/lazy"
          }
        ]
      },
      {
        "id": "w14-wed",
        "day": "wed",
        "title": "Nested routes, layouts & protected pages",
        "learn": [
          "Shared layouts with <code>&lt;Outlet /&gt;</code>",
          "Route parameters and search parameters",
          "Redirecting with <code>&lt;Navigate /&gt;</code>",
          "Protected pages: only show them to signed-in users"
        ],
        "research": [
          "Build a layout with a header that stays on every page.",
          "How would you stop a signed-out user opening a \"favourites\" page?"
        ],
        "resources": [
          {
            "label": "React Router",
            "url": "https://reactrouter.com/start/declarative/routing"
          }
        ]
      },
      {
        "id": "w14-thu",
        "day": "thu",
        "title": "Performance basics: memo & lazy loading",
        "learn": [
          "Why components re-render",
          "<code>useMemo</code> and <code>useCallback</code>: when they help and when they don't",
          "Lazy loading pages with <code>React.lazy</code> and <code>Suspense</code>",
          "Measuring with the React DevTools Profiler"
        ],
        "research": [
          "Find an expensive calculation in your app. Does <code>useMemo</code> help?",
          "Which of your pages could be lazy loaded?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/reference/react/useMemo"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/reference/react/lazy"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w14-fri",
      "title": "Task manager, part 2: pages",
      "brief": "Turn your task manager into a multi-page app.",
      "doneWhen": [
        "Routes: task list, task detail (<code>/tasks/:id</code>), new task, 404",
        "A shared layout with navigation that shows the active page",
        "Detail page reads the task id from the URL",
        "One page lazy loaded"
      ],
      "submit": "GitHub repo link"
    },
    "review": {
      "id": "w14-sat",
      "questions": [
        "Demo creating, viewing and completing a task.",
        "Why did you put state where you did?",
        "Show one validation message and how it is triggered."
      ]
    }
  },
  {
    "id": "w15",
    "number": "15",
    "title": "React IV: data from APIs",
    "goal": "Load, cache and display real data in React, with loading and error states.",
    "lessons": [
      {
        "id": "w15-mon",
        "day": "mon",
        "title": "Fetching data in React",
        "learn": [
          "<code>fetch</code> inside an effect, with loading and error state",
          "Cancelling stale requests with <code>AbortController</code>",
          "Reading the JSON response and showing it"
        ],
        "research": [
          "Fetch books from the Open Library API.",
          "What is a race condition in a search box?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/synchronizing-with-effects#fetching-data"
          },
          {
            "label": "Open Library API",
            "url": "https://openlibrary.org/developers/api"
          }
        ]
      },
      {
        "id": "w15-tue",
        "day": "tue",
        "title": "TanStack Query",
        "learn": [
          "Why a data library: caching, refetching, deduplication",
          "<code>useQuery</code> and query keys",
          "<code>useMutation</code> and invalidating queries"
        ],
        "research": [
          "What does TanStack Query give you that a plain effect doesn't?",
          "Rewrite Monday's fetch with <code>useQuery</code>."
        ],
        "resources": [
          {
            "label": "TanStack Query",
            "url": "https://tanstack.com/query/latest/docs/framework/react/overview"
          }
        ]
      },
      {
        "id": "w15-wed",
        "day": "wed",
        "title": "Search UX: debouncing & race conditions",
        "learn": [
          "Debouncing: wait until the user stops typing",
          "Race conditions: older results arriving after newer ones",
          "Cancelling requests with <code>AbortController</code>",
          "Keeping the search in the URL"
        ],
        "research": [
          "Type fast in a search box. How many requests should fire?",
          "Write a <code>useDebounce</code> hook."
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Glossary/Debounce"
          },
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
          }
        ]
      },
      {
        "id": "w15-thu",
        "day": "thu",
        "title": "Environment & backends",
        "learn": [
          "Environment variables in Vite (<code>import.meta.env</code>) and what must never be in frontend code",
          "Protected routes: redirecting signed-out users",
          "Backend-as-a-service: a first look at Supabase (auth, database, storage)"
        ],
        "research": [
          "Why is an API secret in frontend code always public?",
          "Protect a \"favourites\" page so only signed-in users see it."
        ],
        "resources": [
          {
            "label": "Vite env variables",
            "url": "https://vite.dev/guide/env-and-mode"
          },
          {
            "label": "Supabase + React",
            "url": "https://supabase.com/docs/guides/getting-started/quickstarts/reactjs"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w15-fri",
      "title": "Book finder",
      "brief": "Build a book search app on the Open Library API with React + Bootstrap.",
      "doneWhen": [
        "Debounced search box (no request per keystroke)",
        "Clear loading, error, empty and results states",
        "Book detail route with cover image",
        "Favourites saved with a custom hook, on a protected favourites page"
      ],
      "submit": "GitHub repo link"
    },
    "review": {
      "id": "w15-sat",
      "questions": [
        "Type fast in your search box with DevTools open. How many requests fire?",
        "How do you handle an API error?",
        "Plain effects vs TanStack Query: when do you use each?"
      ]
    }
  },
  {
    "id": "w16",
    "number": "16",
    "title": "Hosting with Vercel",
    "goal": "Put your React apps online with Vercel: live links, environment variables, preview deployments and your own domain.",
    "lessons": [
      {
        "id": "w16-mon",
        "day": "mon",
        "title": "How hosting works",
        "learn": [
          "What a web server and a CDN do",
          "Building a React app: <code>npm run build</code> and the <code>dist</code> folder",
          "Static hosting vs servers",
          "Previewing the production build with <code>npm run preview</code>"
        ],
        "research": [
          "What's inside your <code>dist</code> folder after a build?",
          "Why is a static site fast to serve around the world?"
        ],
        "resources": [
          {
            "label": "MDN",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server"
          },
          {
            "label": "Vite: deploying a static site",
            "url": "https://vite.dev/guide/static-deploy"
          }
        ]
      },
      {
        "id": "w16-tue",
        "day": "tue",
        "title": "Deploy a React app to Vercel",
        "learn": [
          "Sign in to Vercel with GitHub and import a repository",
          "Build settings for a Vite app",
          "Automatic deploys on every push to main",
          "Reading the build log when a deploy fails"
        ],
        "research": [
          "Deploy your Product catalogue and share the link.",
          "Break the build on purpose. Where does Vercel show the error?"
        ],
        "resources": [
          {
            "label": "Vercel: getting started",
            "url": "https://vercel.com/docs/getting-started-with-vercel"
          },
          {
            "label": "Vercel: Vite",
            "url": "https://vercel.com/docs/frameworks/frontend/vite"
          }
        ]
      },
      {
        "id": "w16-wed",
        "day": "wed",
        "title": "Environment variables, previews & routing",
        "learn": [
          "Environment variables on Vercel (and why they start with <code>VITE_</code>)",
          "Preview deployments for every pull request",
          "Fixing 404s on refresh with a rewrite to <code>index.html</code>",
          "Rolling back to an earlier deployment"
        ],
        "research": [
          "Why does refreshing <code>/tasks/3</code> 404 without a rewrite?",
          "Open a pull request and find its preview link."
        ],
        "resources": [
          {
            "label": "Vercel: environment variables",
            "url": "https://vercel.com/docs/environment-variables"
          },
          {
            "label": "Vercel: preview deployments",
            "url": "https://vercel.com/docs/deployments/preview-deployments"
          }
        ]
      },
      {
        "id": "w16-thu",
        "day": "thu",
        "title": "Custom domains & going live",
        "learn": [
          "Adding your own domain to a Vercel project",
          "DNS records: what A and CNAME records do",
          "HTTPS is automatic",
          "A going-live checklist"
        ],
        "research": [
          "What DNS record does Vercel ask you to add, and why?",
          "Run Lighthouse on your live site. What's your score?"
        ],
        "resources": [
          {
            "label": "Vercel: add a domain",
            "url": "https://vercel.com/docs/domains/add-a-domain"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w16-fri",
      "title": "Ship your projects on Vercel",
      "brief": "Put your React projects online with Vercel.",
      "doneWhen": [
        "Product catalogue, Task manager and Book finder live on Vercel",
        "Refreshing any page works (no 404s)",
        "One preview deployment created from a pull request",
        "Live links added to each project's README"
      ],
      "submit": "Your three live Vercel links"
    },
    "review": {
      "id": "w16-sat",
      "questions": [
        "Share your live links. Do they work on a phone?",
        "What went wrong while deploying, and how did you fix it?",
        "What did the preview deployment let you check?"
      ]
    }
  },
  {
    "id": "w17",
    "number": "17",
    "title": "Capstone I: plan & build",
    "goal": "Plan an original React app and build its core feature.",
    "lessons": [
      {
        "id": "w17-mon",
        "day": "mon",
        "title": "Plan your capstone",
        "learn": [
          "Pick a problem you, or someone you know, actually has",
          "Write a short spec: who it's for, the pages, the features, the data",
          "Find the smallest version that is still useful",
          "Sketch every page before you code"
        ],
        "research": [
          "Write your spec in 10 lines or fewer.",
          "Which feature is the smallest version that's still useful?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/thinking-in-react"
          }
        ]
      },
      {
        "id": "w17-tue",
        "day": "tue",
        "title": "Set up & component tree",
        "learn": [
          "Set up the project with Vite, React and Bootstrap",
          "Turn your sketch into a component tree",
          "Connect your API or your data",
          "Commit after every working step, with clear messages"
        ],
        "research": [
          "Draw your component tree.",
          "What did you have to change from your plan, and why?"
        ],
        "resources": [
          {
            "label": "GitHub flow",
            "url": "https://docs.github.com/en/get-started/using-github/github-flow"
          }
        ]
      },
      {
        "id": "w17-wed",
        "day": "wed",
        "title": "Data & state",
        "learn": [
          "Decide where your data comes from: an API, a JSON file or user input",
          "Model it: what does one item look like?",
          "Place state using what you learned in Week 13",
          "Handle loading, error and empty states from day one"
        ],
        "research": [
          "Write down the shape of one item in your data.",
          "Which component owns each piece of state?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn/choosing-the-state-structure"
          }
        ]
      },
      {
        "id": "w17-thu",
        "day": "thu",
        "title": "Progress check: get feedback early",
        "learn": [
          "Deploy a preview on Vercel, even if it's unfinished",
          "Ask two people to try the core feature",
          "Write down what confused them",
          "Re-plan: what to cut, what to fix first"
        ],
        "research": [
          "What did your testers find that you missed?",
          "What will you cut to finish on time?"
        ],
        "resources": [
          {
            "label": "GitHub flow",
            "url": "https://docs.github.com/en/get-started/using-github/github-flow"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w17-fri",
      "title": "Capstone checkpoint",
      "brief": "Show your capstone's core feature working.",
      "doneWhen": [
        "Your written spec in the README",
        "The core feature works end to end",
        "Code pushed to GitHub with clear commits",
        "A preview deployment on Vercel"
      ],
      "submit": "GitHub repo + Vercel preview link"
    },
    "review": {
      "id": "w17-sat",
      "questions": [
        "Demo your core feature.",
        "What did you change from your plan?",
        "What's left, and what will you cut?"
      ]
    }
  },
  {
    "id": "w18",
    "number": "18",
    "title": "Capstone II: polish & present",
    "goal": "Finish, polish and present your capstone.",
    "lessons": [
      {
        "id": "w18-mon",
        "day": "mon",
        "title": "Responsive & accessible",
        "learn": [
          "Check every page at 375px and 1280px",
          "Keyboard-only test: can you use everything?",
          "Labels, alt text and contrast",
          "Run Lighthouse and fix the top issues"
        ],
        "research": [
          "What did the keyboard test reveal?",
          "What's your Lighthouse accessibility score now?"
        ],
        "resources": [
          {
            "label": "web.dev: accessibility",
            "url": "https://web.dev/learn/accessibility"
          }
        ]
      },
      {
        "id": "w18-tue",
        "day": "tue",
        "title": "README & final deploy",
        "learn": [
          "A README that sells your project: what, who, screenshots, live link",
          "How to run it locally",
          "A \"what I learned\" section",
          "Final deploy on Vercel"
        ],
        "research": [
          "Read your README as a recruiter would. What's missing?",
          "Does your live site match your README?"
        ],
        "resources": [
          {
            "label": "GitHub: about READMEs",
            "url": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"
          }
        ]
      },
      {
        "id": "w18-wed",
        "day": "wed",
        "title": "User testing & fixes",
        "learn": [
          "Watch someone use your app without helping",
          "Write down every hesitation",
          "Fix the biggest problems first",
          "Know when to stop polishing"
        ],
        "research": [
          "Where did your tester get stuck?",
          "Which fix made the biggest difference?"
        ],
        "resources": [
          {
            "label": "Nielsen Norman: usability testing 101",
            "url": "https://www.nngroup.com/articles/usability-testing-101/"
          }
        ]
      },
      {
        "id": "w18-thu",
        "day": "thu",
        "title": "Demo day prep",
        "learn": [
          "A 5-minute story: the problem, the solution, a live demo, what you learned",
          "Show one challenge and how you solved it",
          "Practise out loud and time yourself",
          "Have a backup plan (screenshots) if the demo fails"
        ],
        "research": [
          "Write your 5-minute demo outline.",
          "What question are you most afraid of, and how will you answer it?"
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w18-fri",
      "title": "Capstone",
      "brief": "Ship an original React app of your own design.",
      "doneWhen": [
        "Your own idea, written as a short spec",
        "Uses components, props, state, routing, a form and at least one API or data source",
        "Styled with Bootstrap and works on phone and laptop",
        "Live on Vercel, with a README containing screenshots and a \"what I learned\" section"
      ],
      "submit": "GitHub repo + Vercel live link + 2‑minute demo video (optional)"
    },
    "review": {
      "id": "w18-sat",
      "questions": [
        "Demo day: 5‑minute presentation per student.",
        "Peer feedback: one strength, one improvement.",
        "Your next 3 months: what will you build and learn?"
      ]
    }
  },
  {
    "id": "w19",
    "number": "19",
    "title": "Career launch",
    "goal": "Get ready for your first frontend job: portfolio, GitHub, CV, applications and interviews.",
    "lessons": [
      {
        "id": "w19-mon",
        "day": "mon",
        "title": "Your portfolio",
        "learn": [
          "Your 3 best projects, each with a live link, GitHub link and screenshot",
          "Two lines per project: what it does and what you learned",
          "A short \"about me\" and how to contact you",
          "Fast, responsive and accessible: it's your best project"
        ],
        "research": [
          "Which 3 projects best show what you can do?",
          "Ask a friend: what do they remember after 30 seconds on your portfolio?"
        ],
        "resources": [
          {
            "label": "roadmap.sh frontend",
            "url": "https://roadmap.sh/frontend"
          }
        ]
      },
      {
        "id": "w19-tue",
        "day": "tue",
        "title": "GitHub profile & CV",
        "learn": [
          "A profile README: who you are, what you're learning, your stack",
          "Pin your best repositories",
          "A one-page CV that leads with projects",
          "Send your CV as a PDF"
        ],
        "research": [
          "Write your profile README.",
          "Cut your CV to one page. What did you remove?"
        ],
        "resources": [
          {
            "label": "GitHub: profile README",
            "url": "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"
          }
        ]
      },
      {
        "id": "w19-wed",
        "day": "wed",
        "title": "Finding & applying for jobs",
        "learn": [
          "Where to look: job boards, LinkedIn, company sites, communities",
          "Reading a job ad: must-haves vs nice-to-haves",
          "Tailoring your application in 10 minutes",
          "Tracking your applications"
        ],
        "research": [
          "Find 3 roles that match your skills. What do they have in common?",
          "Write a short message to a hiring manager."
        ],
        "resources": [
          {
            "label": "roadmap.sh frontend",
            "url": "https://roadmap.sh/frontend"
          }
        ]
      },
      {
        "id": "w19-thu",
        "day": "thu",
        "title": "Interview prep",
        "learn": [
          "Common questions: HTML, CSS, JavaScript and React",
          "Talking through a project and a bug you fixed",
          "Live coding: think out loud, ask questions",
          "Questions to ask the interviewer"
        ],
        "research": [
          "Answer 10 common junior interview questions out loud.",
          "Practise explaining your capstone in 2 minutes."
        ],
        "resources": [
          {
            "label": "javascript.info",
            "url": "https://javascript.info/"
          }
        ]
      }
    ],
    "assignment": {
      "id": "w19-fri",
      "title": "Career pack",
      "brief": "Put together everything you need to start applying for frontend jobs.",
      "doneWhen": [
        "Portfolio site live on Vercel",
        "GitHub profile README and pinned projects",
        "One-page CV as a PDF",
        "Applied to at least 3 roles (keep a list)"
      ],
      "submit": "Portfolio link + GitHub profile link"
    },
    "review": {
      "id": "w19-sat",
      "questions": [
        "Show your portfolio. What would a recruiter see first?",
        "Share one application you're proud of.",
        "What's your plan for the next month?"
      ]
    }
  },
  {
    "id": "ts",
    "number": "B1",
    "title": "TypeScript",
    "goal": "Add types to your JavaScript, the way most professional React teams work.",
    "lessons": [
      {
        "id": "ts-mon",
        "day": "mon",
        "title": "Why TypeScript",
        "learn": [
          "What TypeScript adds and what it compiles to",
          "Basic types, type inference, <code>any</code> vs <code>unknown</code>",
          "Running TypeScript with <code>tsc</code>"
        ],
        "research": [
          "What kind of bug does TypeScript catch before you run the code?",
          "Why is <code>any</code> considered dangerous?"
        ],
        "resources": [
          {
            "label": "TS Handbook",
            "url": "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html"
          }
        ]
      },
      {
        "id": "ts-tue",
        "day": "tue",
        "title": "Shaping data",
        "learn": [
          "Interfaces and type aliases",
          "Optional and readonly properties",
          "Union and literal types, narrowing"
        ],
        "research": [
          "Interface or type alias: when does it matter?",
          "Model a <code>Product</code> and a <code>CartItem</code>."
        ],
        "resources": [
          {
            "label": "TS Handbook",
            "url": "https://www.typescriptlang.org/docs/handbook/2/objects.html"
          },
          {
            "label": "TS Handbook",
            "url": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
          }
        ]
      },
      {
        "id": "ts-wed",
        "day": "wed",
        "title": "Functions, classes & generics",
        "learn": [
          "Typing parameters and return values",
          "Classes, access modifiers, constructors (and why React code rarely uses them)",
          "A first look at generics: <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code>"
        ],
        "research": [
          "Write a generic function that returns the first item of any array.",
          "How would you type the props of a <code>ProductCard</code> component?"
        ],
        "resources": [
          {
            "label": "TS Handbook",
            "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html"
          },
          {
            "label": "TS Handbook",
            "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html"
          }
        ]
      },
      {
        "id": "ts-thu",
        "day": "thu",
        "title": "Config & strict mode",
        "learn": [
          "<code>tsconfig.json</code> and the <code>strict</code> flag",
          "Typing API responses",
          "Reading TypeScript error messages"
        ],
        "research": [
          "What does <code>strictNullChecks</code> protect you from?",
          "Type the Open‑Meteo response you used in Week 5."
        ],
        "resources": [
          {
            "label": "TS Playground",
            "url": "https://www.typescriptlang.org/play"
          }
        ]
      }
    ],
    "assignment": {
      "id": "ts-fri",
      "title": "Weather app in TypeScript",
      "brief": "Convert your Week 09 weather app to TypeScript.",
      "doneWhen": [
        "Strict mode on, zero <code>any</code>",
        "Interfaces for the API response and your app state",
        "Builds with an npm script (<code>npm run build</code>)",
        "README explains one bug TypeScript caught"
      ],
      "submit": "GitHub repo + live URL"
    },
    "review": {
      "id": "ts-sat",
      "questions": [
        "Show one bug TypeScript caught for you.",
        "Which type was hardest to write?",
        "Is TypeScript worth the extra typing? Argue both sides."
      ]
    },
    "track": "bonus"
  },
  {
    "id": "tw",
    "number": "B2",
    "title": "Tailwind CSS",
    "track": "bonus",
    "goal": "Style React apps fast with Tailwind's utility classes, and compare it with Bootstrap.",
    "lessons": [
      {
        "id": "tw-mon",
        "day": "mon",
        "title": "Modern styling approaches",
        "learn": [
          "Plain CSS, BEM naming, Sass, CSS Modules, CSS‑in‑JS, utility‑first",
          "What utility‑first means and the trade‑offs",
          "Installing Tailwind CSS v4 (with Vite or the CLI)"
        ],
        "research": [
          "What problems does utility‑first CSS solve, and which does it create?",
          "Install Tailwind in an empty project."
        ],
        "resources": [
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/installation"
          },
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/styling-with-utility-classes"
          }
        ]
      },
      {
        "id": "tw-tue",
        "day": "tue",
        "title": "Tailwind core",
        "learn": [
          "Spacing, sizing, colour and typography utilities",
          "Flex and grid utilities",
          "Reading the Tailwind docs quickly"
        ],
        "research": [
          "Rebuild your Week 04 navbar in Tailwind.",
          "How does Tailwind remove CSS you don't use?"
        ],
        "resources": [
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/responsive-design"
          },
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/hover-focus-and-other-states"
          }
        ]
      },
      {
        "id": "tw-wed",
        "day": "wed",
        "title": "Responsive design, states & dark mode",
        "learn": [
          "Mobile-first breakpoints: <code>sm:</code>, <code>md:</code>, <code>lg:</code>",
          "States: <code>hover:</code>, <code>focus:</code>, <code>disabled:</code>",
          "Dark mode with <code>dark:</code>",
          "Visible focus styles for keyboard users"
        ],
        "research": [
          "Make a card grid that shows 1, 2 and 3 columns at different widths.",
          "Add a dark mode to your navbar."
        ],
        "resources": [
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/responsive-design"
          },
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/dark-mode"
          }
        ]
      },
      {
        "id": "tw-thu",
        "day": "thu",
        "title": "Tailwind at scale",
        "learn": [
          "Customising the theme with <code>@theme</code> (colors, fonts, spacing)",
          "Avoiding class soup: components, not <code>@apply</code> everywhere",
          "Accessible color contrast and focus rings"
        ],
        "research": [
          "Define brand colors in your theme and use them.",
          "When is <code>@apply</code> acceptable?"
        ],
        "resources": [
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/theme"
          },
          {
            "label": "Tailwind docs",
            "url": "https://tailwindcss.com/docs/dark-mode"
          }
        ]
      }
    ],
    "assignment": {
      "id": "tw-fri",
      "title": "Bootstrap page, rebuilt in Tailwind",
      "brief": "Rebuild your Week 05 Bootstrap landing page in React + Tailwind, then compare the two.",
      "doneWhen": [
        "Same sections and content as your Bootstrap version",
        "Your brand colours and font defined in <code>@theme</code>",
        "Responsive, with dark mode and visible focus states",
        "README with a short Bootstrap vs Tailwind comparison"
      ],
      "submit": "GitHub repo + live URL"
    },
    "review": {
      "id": "tw-sat",
      "questions": [
        "Show both versions side by side.",
        "Which was faster to build? Which is easier to change?",
        "When would you choose Bootstrap, and when Tailwind?"
      ]
    }
  },
  {
    "id": "ship",
    "number": "B3",
    "title": "Testing, performance & shipping",
    "track": "bonus",
    "goal": "Make your apps production-ready: tested, fast, accessible and deployed automatically.",
    "lessons": [
      {
        "id": "ship-mon",
        "day": "mon",
        "title": "Testing basics",
        "learn": [
          "Why test; unit vs integration vs end-to-end",
          "Vitest + React Testing Library: render, find by role, click",
          "What is worth testing"
        ],
        "research": [
          "Write 3 tests for your task manager.",
          "Why test what the user sees instead of component internals?"
        ],
        "resources": [
          {
            "label": "Vitest",
            "url": "https://vitest.dev/guide/"
          },
          {
            "label": "Testing Library",
            "url": "https://testing-library.com/docs/react-testing-library/intro/"
          }
        ]
      },
      {
        "id": "ship-tue",
        "day": "tue",
        "title": "Accessibility & performance",
        "learn": [
          "Lighthouse and axe audits",
          "Lazy routes, image sizes and <code>loading=\"lazy\"</code>",
          "Bundle size: <code>npm run build</code> output and what to cut"
        ],
        "research": [
          "Fix the top 3 Lighthouse issues on your Book finder.",
          "Which of your pages could be lazy loaded?"
        ],
        "resources": [
          {
            "label": "web.dev performance",
            "url": "https://web.dev/learn/performance"
          },
          {
            "label": "react.dev",
            "url": "https://react.dev/reference/react/lazy"
          }
        ]
      },
      {
        "id": "ship-wed",
        "day": "wed",
        "title": "Build & deploy",
        "learn": [
          "<code>npm run build</code> and the <code>dist</code> folder",
          "Deploying React to Netlify or Vercel",
          "SPA routing on static hosts (rewrite every path to <code>index.html</code>)"
        ],
        "research": [
          "Why does refreshing <code>/tasks/3</code> 404 on some hosts?",
          "Deploy your capstone draft."
        ],
        "resources": [
          {
            "label": "Vite deploy guide",
            "url": "https://vite.dev/guide/static-deploy"
          }
        ]
      },
      {
        "id": "ship-thu",
        "day": "thu",
        "title": "Continuous integration with GitHub Actions",
        "learn": [
          "What CI is: checks that run on every push",
          "A GitHub Actions workflow that installs, tests and builds your app",
          "Branch protection: require checks to pass before merging",
          "Reading a failed run and fixing it"
        ],
        "research": [
          "Add a workflow that runs your tests on every push.",
          "Which checks should block a merge, and which shouldn't?"
        ],
        "resources": [
          {
            "label": "GitHub Actions quickstart",
            "url": "https://docs.github.com/en/actions/writing-workflows/quickstart"
          }
        ]
      }
    ],
    "assignment": {
      "id": "ship-fri",
      "title": "Production-ready capstone",
      "brief": "Take your Week 18 capstone and make it production-ready.",
      "doneWhen": [
        "At least 5 tests that pass on every push (GitHub Actions)",
        "Lighthouse accessibility and performance 90+",
        "Deployed, with environment variables set on the host",
        "README with a passing CI badge"
      ],
      "submit": "GitHub repo + live URL"
    },
    "review": {
      "id": "ship-sat",
      "questions": [
        "Show a failing test, then fix it.",
        "What did Lighthouse flag, and what did you change?",
        "What would you check before every release?"
      ]
    }
  },
  {
    "id": "ai",
    "number": "B4",
    "title": "AI in frontend with Claude",
    "goal": "Use Claude in the browser at claude.ai as a tutor, pair programmer and prototyping tool, while keeping your own skills sharp.",
    "lessons": [
      {
        "id": "ai-mon",
        "day": "mon",
        "title": "What AI can and can't do",
        "learn": [
          "How large language models work in plain terms: predicting text from patterns",
          "Using Claude at claude.ai in the browser; no editor or install needed",
          "Limits: confident mistakes, outdated APIs, missing context",
          "Rules: never paste secrets, API keys or private company code; always verify"
        ],
        "research": [
          "Ask Claude an React question you already know the answer to. Was it right?",
          "Find one case where it was wrong or out of date."
        ],
        "resources": [
          {
            "label": "claude.ai",
            "url": "https://claude.ai"
          },
          {
            "label": "Claude help center",
            "url": "https://support.claude.com"
          }
        ]
      },
      {
        "id": "ai-tue",
        "day": "tue",
        "title": "Claude as a tutor",
        "learn": [
          "Prompts that teach instead of solve: \"Give me hints, not the answer\"",
          "Asking for explanations at your level, analogies, and quiz questions",
          "Pasting code and asking \"explain this line by line\""
        ],
        "research": [
          "Have Claude quiz you on this week's topic. Score yourself.",
          "Write a reusable \"tutor\" prompt for this course."
        ],
        "resources": [
          {
            "label": "Prompting guide",
            "url": "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview"
          }
        ]
      },
      {
        "id": "ai-wed",
        "day": "wed",
        "title": "Prototyping with Artifacts",
        "learn": [
          "Asking Claude to build a UI as an Artifact (HTML + Tailwind) and previewing it in the browser",
          "Iterating: change layout, colors, states through follow‑up prompts",
          "Using Projects to keep course notes and requirements as context",
          "Turning a prototype into React components yourself"
        ],
        "research": [
          "Prototype a pricing card as an Artifact in 3 iterations.",
          "Which parts of the prototype would become separate React components?"
        ],
        "resources": [
          {
            "label": "Artifacts help",
            "url": "https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them"
          }
        ]
      },
      {
        "id": "ai-thu",
        "day": "thu",
        "title": "Debugging & code review",
        "learn": [
          "Pasting an error with context: what you ran, what you expected, the full message",
          "Asking for a review: accessibility, naming, edge cases",
          "Asking for tests for your own code",
          "Knowing when to stop and read the docs instead"
        ],
        "research": [
          "Paste a real error from your project. Did Claude's fix work first time?",
          "Ask for an accessibility review of one component and apply what's correct."
        ],
        "resources": [
          {
            "label": "react.dev",
            "url": "https://react.dev/learn"
          }
        ]
      }
    ],
    "assignment": {
      "id": "ai-fri",
      "title": "Prototype → real component",
      "brief": "Use Claude at claude.ai to prototype a UI, then build it yourself in React.",
      "doneWhen": [
        "Prompt Claude to create a dashboard‑widget prototype as an Artifact (HTML + Tailwind)",
        "Rebuild it yourself as React components with hooks; no copy‑pasting the whole thing",
        "Submit your prompt log (all prompts, in order)",
        "A short reflection: 3 things Claude got right, 2 it got wrong, how you caught them"
      ],
      "submit": "GitHub repo + prompt log + reflection"
    },
    "review": {
      "id": "ai-sat",
      "questions": [
        "Share your best prompt and your worst prompt.",
        "Where did AI save you time? Where did it cost you time?",
        "Agree on group rules for using AI in assignments."
      ]
    },
    "track": "bonus"
  }
];
