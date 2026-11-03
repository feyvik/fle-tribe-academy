# Written lesson guides for lessons that use a PDF instead of a video.
# Each section is (heading, list of blocks). A block is a paragraph string, a list of bullet strings,
# or ("code", "source") for a code sample. The lesson's own topics, research questions and links are added
# automatically from src/data/curriculum.ts by build_pdfs.py.

GUIDES = {'w0-mon': [('Tech is two things',
             ['When people say "tech" they usually mean one of two things: the technology industry (companies whose '
              'main product is software, like Paystack, Flutterwave, Google or Spotify) or technology as a skill used '
              'inside every other industry. Banks, hospitals, airlines, schools and governments all run on software, '
              'and they all hire people to build and maintain it.',
              'That is why a frontend developer can work almost anywhere: a fintech startup in Lagos, a bank in '
              'London, an agency that builds websites for many clients, or as a freelancer.']),
            ('The main areas of tech',
             [['<b>Software engineering</b>: building apps and websites (frontend, backend, mobile).',
               '<b>Data</b>: collecting, analysing and visualising information to help decisions.',
               '<b>Cloud &amp; infrastructure</b>: the servers and networks software runs on.',
               '<b>Cybersecurity</b>: keeping systems and data safe from attacks.',
               '<b>Design (UI/UX)</b>: researching users and designing how products look and work.',
               '<b>Product &amp; project management</b>: deciding what to build and keeping teams on track.',
               '<b>QA / testing</b>: making sure software works before users see it.']]),
            ('How companies make money from software',
             [['<b>Subscriptions</b>: users pay monthly (Netflix, Spotify).',
               '<b>Transaction fees</b>: a small cut of every payment (Paystack, Flutterwave).',
               '<b>Advertising</b>: free for users, paid for by advertisers (Instagram, YouTube).',
               '<b>Services</b>: agencies and freelancers are paid to build software for clients.']]),
            ('Product company or agency?',
             ['A <b>product company</b> builds and improves its own product for years, so you go deep on one codebase. '
              'An <b>agency</b> builds projects for many clients, so you see more variety and work to deadlines. Both '
              'are good first jobs; they suit different personalities.'])],
 'w0-tue': [('Engineering roles',
             [['<b>Frontend developer</b>: builds what users see and interact with in the browser.',
               '<b>Backend developer</b>: builds the servers, APIs and databases behind the scenes.',
               '<b>Full-stack developer</b>: works on both, usually after starting on one side.',
               '<b>Mobile developer</b>: builds iOS and Android apps.',
               '<b>DevOps / cloud engineer</b>: automates deployment and keeps systems running.',
               '<b>QA / test automation</b>: writes tests and checks quality before release.']]),
            ("People you'll work with every day",
             [['<b>UI/UX designer</b>: gives you the designs (usually in Figma) you turn into code.',
               '<b>Product manager</b>: decides what to build next and why.',
               "<b>Scrum master / delivery lead</b>: runs the team's planning and stand-ups.",
               '<b>Technical writer</b>: documents how things work.']]),
            ('Career levels',
             [['<b>Intern</b>: learning on the job with close supervision.',
               '<b>Junior (0–2 years)</b>: completes well-defined tasks, asks lots of questions.',
               '<b>Mid-level (2–5 years)</b>: owns features end to end with little help.',
               "<b>Senior (5+ years)</b>: designs solutions, reviews others' code, mentors juniors.",
               '<b>Lead / Staff / Manager</b>: sets technical direction or manages people.']]),
            ('Reading a job ad',
             ['Job ads list more than they truly need. Split each requirement into <b>must have</b> (usually HTML, '
              'CSS, JavaScript, one framework such as React, Git) and <b>nice to have</b>. If you match most of the '
              'must-haves, apply.'])],
 'w0-wed': [('Frontend in one sentence',
             ['Frontend is everything a person sees and touches in the browser: the layout, the styling, what happens '
              'when they click, how fast it loads, and whether everyone, including people using screen readers or '
              'keyboards, can use it.']),
            ('The restaurant analogy',
             ['In a restaurant, the <b>dining room</b> is the frontend: the menu, the tables, the waiter who takes '
              'your order. The <b>kitchen</b> is the backend: it stores ingredients (the database) and cooks the food '
              '(business logic). The waiter carrying orders between them is the <b>API</b>. A frontend developer '
              'designs and runs the dining room, and knows how to talk to the kitchen.']),
            ('Frontend vs not frontend',
             [['<b>Frontend</b>: turning designs into pages and components, layout and responsive design, '
               'interactivity, accessibility, page speed, showing data from APIs.',
               '<b>Not frontend</b>: designing database tables, writing server APIs, configuring servers, training AI '
               "models, creating the brand's visual identity.",
               '<b>Gray areas</b>: agreeing API data shapes with backend developers, deploying the frontend, '
               'server-side rendering, small design decisions when no designer is available, writing UI tests.']])],
 'w0-thu': [('Learn from documentation, not only videos',
             ['Videos are great for first understanding. Documentation is where you go for exact answers, and it is '
              'what working developers use every day. Get comfortable with <b>MDN Web Docs</b> (HTML, CSS, JavaScript) '
              'and <b>react.dev</b> early.']),
            ('How to ask a good question',
             [['Say what you were trying to do.',
               'Show what you tried (code, screenshot of the error).',
               'Say what you expected to happen, and what actually happened.',
               'Copy the exact error message instead of describing it.',
               "Remove everything that isn't needed to show the problem."]]),
            ('Keep a learning journal',
             ['Write one short entry every study day with three headings:',
              ['<b>Learned</b>: one or two things that clicked today.',
               "<b>Confused about</b>: what still doesn't make sense.",
               "<b>Next</b>: what you'll look at tomorrow."],
              "Bring your journal to the Saturday review. It's the fastest way to see how far you've come."]),
            ('Set up today',
             [['A modern browser: Chrome or Firefox.',
               'A free GitHub account (github.com/signup).',
               'A notes app for your journal (Notion, Google Docs or a notebook all work).']])],
 'w1-wed': [('The parts of a browser',
             [['<b>User interface</b>: the address bar, tabs and buttons.',
               '<b>Networking</b>: downloads HTML, CSS, JavaScript and images.',
               '<b>Rendering engine</b>: turns HTML and CSS into pixels (Blink in Chrome and Edge, Gecko in Firefox, '
               'WebKit in Safari).',
               '<b>JavaScript engine</b>: runs your scripts (V8 in Chrome, SpiderMonkey in Firefox).']]),
            ('From code to pixels: the critical rendering path',
             [['<b>1. Parse HTML → DOM</b>: the browser reads the HTML and builds a tree of elements.',
               '<b>2. Parse CSS → CSSOM</b>: it reads every stylesheet and builds a tree of styles.',
               '<b>3. Render tree</b>: DOM + CSSOM combined, keeping only what is visible.',
               '<b>4. Layout</b>: works out the exact size and position of every element.',
               '<b>5. Paint</b>: fills in pixels: text, colours, borders, images.',
               '<b>6. Composite</b>: layers are put together and shown on screen.']]),
            ('Why sites can look different in different browsers',
             ['Each engine is built by a different team and adds new features at its own pace. Check a feature on '
              '<b>caniuse.com</b> before relying on it, and always test your work in at least two browsers.'])],
 'ts-thu': [('tsconfig.json',
             ['Every TypeScript project has a <code>tsconfig.json</code> that tells the compiler how strict to be and '
              "what JavaScript to produce. Vite creates one for you; you'll mostly change a few options.",
              ('code',
               '{\n'
               '  "compilerOptions": {\n'
               '    "target": "ES2020",\n'
               '    "strict": true,\n'
               '    "noUnusedLocals": true,\n'
               '    "noUncheckedIndexedAccess": true\n'
               '  },\n'
               '  "include": ["src"]\n'
               '}')]),
            ('Turn strict mode on',
             ['<code>"strict": true</code> switches on a group of checks. The most important is '
              '<b>strictNullChecks</b>: TypeScript makes you handle values that might be <code>null</code> or '
              '<code>undefined</code> before you use them, which removes a whole class of "cannot read property of '
              'undefined" crashes.',
              ('code',
               'function greet(name: string | null) {\n'
               '  // return name.toUpperCase();  ✗ error: name might be null\n'
               "  return name ? name.toUpperCase() : 'Guest'; // ✓\n"
               '}')]),
            ('Typing API responses',
             ['Data from an API is <code>unknown</code> until you describe it. Write an interface for the shape you '
              'expect:',
              ('code',
               'interface Weather {\n'
               '  current: { temperature_2m: number; wind_speed_10m: number };\n'
               '}\n'
               '\n'
               'const res = await fetch(url);\n'
               'const data: Weather = await res.json();\n'
               'console.log(data.current.temperature_2m);')]),
            ('Reading error messages',
             [['Read the <b>last line</b> first: it usually says what is wrong.',
               'Note the file and line number, then go there.',
               '"Type \'X\' is not assignable to type \'Y\'" means you gave the wrong kind of value.',
               '"Object is possibly \'undefined\'" means you need to check before using it.']])],
 'tw-tue': [('How Tailwind works',
             ['Instead of writing CSS in a separate file, you add small single-purpose classes straight to your HTML '
              'or JSX. Each class does one thing.',
              ('code',
               '<button class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500">\n'
               '  Sign in\n'
               '</button>')]),
            ('Cheat sheet',
             [['<b>Spacing</b>: <code>p-4</code> padding, <code>px-4</code> left/right, <code>mt-2</code> margin-top, '
               '<code>gap-3</code> gap.',
               '<b>Size</b>: <code>w-full</code>, <code>max-w-md</code>, <code>h-12</code>.',
               '<b>Colour</b>: <code>text-slate-700</code>, <code>bg-white</code>, <code>border-slate-200</code>.',
               '<b>Type</b>: <code>text-lg</code>, <code>font-bold</code>, <code>leading-tight</code>.',
               '<b>Flex</b>: <code>flex items-center justify-between gap-4</code>.',
               '<b>Grid</b>: <code>grid grid-cols-1 md:grid-cols-3 gap-6</code>.',
               '<b>Borders &amp; corners</b>: <code>border rounded-xl</code>.']])],
 'tw-thu': [('Your brand in the theme',
             ['In Tailwind v4 you define your design tokens in CSS with <code>@theme</code>. Every token becomes a '
              'class automatically.',
              ('code',
               '@import "tailwindcss";\n'
               '\n'
               '@theme {\n'
               '  --color-brand: #3f09c9;\n'
               '  --color-lime: #b6ff00;\n'
               '  --font-display: "Montserrat", sans-serif;\n'
               '}\n'
               '\n'
               '/* now you can use bg-brand, text-lime, font-display */')]),
            ('Avoiding class soup',
             [['When the same long class list repeats, make a <b>component</b> (e.g. a React <code>Button</code>) '
               'instead of copying it.',
               "Use <code>@apply</code> rarely, for things you can't make a component, such as styling HTML you don't "
               'control.',
               'Keep class order consistent (layout → spacing → colour → type → states) so lists are easy to scan.']]),
            ('Accessibility checks',
             [['Text needs a contrast ratio of at least <b>4.5:1</b> against its background (check with a contrast '
               'checker).',
               'Never remove focus outlines without replacing them, e.g. <code>focus-visible:outline-2</code>.',
               "Don't rely on colour alone to show meaning: add text or an icon too."]])],
 'ship-tue': [('Run an audit',
               ['Open DevTools → <b>Lighthouse</b>, choose Mobile, tick Performance and Accessibility, then <b>Analyze '
                'page load</b>. Fix the top items first and run it again. Aim for 90+ in Accessibility.']),
              ('Accessibility checklist',
               [['Every image has meaningful <code>alt</code> text (or <code>alt=""</code> if it\'s decorative).',
                 'Every form field has a <code>&lt;label&gt;</code>.',
                 'You can use the whole page with only the keyboard, and focus is always visible.',
                 'Text contrast is at least 4.5:1.',
                 'Headings go in order (h1, h2, h3) and buttons are real <code>&lt;button&gt;</code> elements.']]),
              ('Performance checklist',
               [['Resize and compress images; use <code>loading="lazy"</code> for images below the fold.',
                 'Lazy-load pages with <code>React.lazy</code> so the first load is smaller.',
                 'Check the output of <code>npm run build</code>: big files are a sign of heavy libraries.',
                 'Remove unused dependencies.']])],
 'ship-wed': [('Build',
               [('code',
                 'npm run build\n# creates the dist/ folder: plain HTML, CSS and JavaScript ready for any host'),
                'Preview the production build locally with <code>npm run preview</code> before deploying.']),
              ('Deploy to Netlify or Vercel',
               [['Push your project to GitHub.',
                 'Sign in to Netlify or Vercel with GitHub and import the repository.',
                 'Build command: <code>npm run build</code>. Output directory: <code>dist</code>.',
                 "Add environment variables (anything starting with <code>VITE_</code>) in the host's settings.",
                 'Deploy. Every push to main now redeploys automatically.']]),
              ('Fix 404s on refresh',
               ['A React app has one real file, <code>index.html</code>. If someone refreshes <code>/tasks/3</code>, '
                "the host looks for a file that doesn't exist. Tell it to send every path to index.html:",
                ('code',
                 '# Netlify: public/_redirects\n'
                 '/*  /index.html  200\n'
                 '\n'
                 '# Vercel: vercel.json\n'
                 '{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }')])],
 'ai-mon': [('What a large language model does',
             ['Claude is a large language model. It learned patterns from a huge amount of text and code, and it '
              'generates answers by predicting what text should come next. That makes it very good at explaining, '
              'drafting and spotting patterns, but it can also produce answers that sound confident and are wrong.']),
            ('Using Claude in the browser',
             ["Go to <b>claude.ai</b>, sign in and start a chat. You don't need an editor or anything installed. You "
              'can paste code, upload screenshots of errors, and ask follow-up questions.']),
            ('Limits to keep in mind',
             [['It can be <b>wrong or out of date</b>, especially about very new library versions.',
               'It only knows what you tell it about your project.',
               'Always run and check the code it suggests.']]),
            ('Rules for this course',
             [['Never paste passwords, API keys or private company code.',
               'Use AI to understand, not to skip learning: you must be able to explain every line you submit.',
               'Say when you used AI in an assignment, and what for.']])],
 'ai-tue': [('Ask for teaching, not answers',
             ['The most useful prompt for a learner is one that makes Claude a tutor:',
              ('code',
               "I'm learning React. Don't give me the solution.\n"
               'Give me one hint at a time to fix this, and ask me\n'
               'questions to check I understand.\n'
               '\n'
               '[paste your code and the error]')]),
            ('Prompts that work well',
             [['"Explain this code line by line for a beginner."',
               '"Explain closures with an everyday analogy, then a short code example."',
               '"Quiz me with 5 questions on this week\'s topic, one at a time."',
               '"What\'s the difference between X and Y, and when would I use each?"']]),
            ('Make it your own tutor prompt',
             ['Write a short prompt you reuse every day: your level, the course topic, how you like explanations '
              '(short, with examples), and that it should give hints before answers. Save it in your notes.'])],
 'ai-wed': [('Artifacts',
             ['When you ask Claude to build a small page or component, it can show it as an <b>Artifact</b>: a live '
              "preview next to the chat that you can click through. It's a quick way to try ideas before you write the "
              'real thing.',
              ('code',
               'Create a pricing card in HTML and Tailwind CSS with\n'
               'three plans (Basic, Pro, Team). Use #3f09c9 as the\n'
               'brand colour. Make it responsive.')]),
            ('Iterate in small steps',
             [['Change one thing per message: "make the Pro plan stand out", "add a monthly/yearly toggle".',
               "Ask why it made a choice if you don't understand it.",
               'Keep the version you like by copying it to your notes.']]),
            ('Projects',
             ['Use a <b>Project</b> on claude.ai to keep the course brief, your notes and your assignment requirements '
              "as context, so you don't repeat them in every chat."]),
            ('From prototype to React',
             ['The prototype is a sketch, not your submission. Rebuild it yourself as React components: decide the '
              "component tree, the props, and where state lives, then write it. That's where the learning happens."])],
 'ai-thu': [('Ask for help with an error',
             ['Give Claude what a senior developer would need:',
              ('code',
               "I'm running: npm run dev\n"
               'I expected: the product list to show\n'
               'What happened: blank page, and this error in the console:\n'
               '\n'
               '[paste the full error]\n'
               '\n'
               "Here's the component: [paste code]")]),
            ('Ask for a code review',
             [['"Review this component for accessibility issues."',
               '"Are there edge cases I\'m not handling?"',
               '"Suggest clearer names for these variables."',
               '"Write 3 tests for this function."']]),
            ('Check before you trust',
             [['Run every suggestion and confirm it fixes the problem.',
               "If two fixes in a row don't work, stop and read the docs for that library.",
               'Make sure you understand the fix well enough to explain it on Saturday.']])],
 'tw-wed': [('Responsive design: mobile first',
             ['Classes without a prefix apply to every screen size. Add a prefix to change something from a breakpoint '
              'upwards: <code>sm:</code> (640px+), <code>md:</code> (768px+), <code>lg:</code> (1024px+), '
              '<code>xl:</code> (1280px+).',
              ('code',
               '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">\n'
               '  <Card /> <Card /> <Card />\n'
               '</div>'),
              "Design for the phone first, then add prefixes as the screen gets wider. That's the opposite of how many "
              'people learned CSS, and it keeps your classes short.']),
            ('Interaction states',
             [('code',
               '<button class="bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2\n'
               '               focus-visible:outline-offset-2 disabled:opacity-50">\n'
               '  Save\n'
               '</button>'),
              ['<code>hover:</code> when the pointer is over it.',
               "<code>focus-visible:</code> when it's reached with the keyboard. Always keep a visible focus style.",
               "<code>disabled:</code> when the button can't be used."]]),
            ('Dark mode',
             ['<code>dark:</code> applies a style when the device is set to dark mode. Pair every background and text '
              'colour with its dark version:',
              ('code', '<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">…</div>')])],
 'ship-thu': [('What continuous integration is',
               ['Continuous integration (CI) runs your checks automatically on every push: install, test, build. If '
                'something breaks, you find out in minutes, before it reaches users.']),
              ('Your first GitHub Actions workflow',
               ['Create <code>.github/workflows/ci.yml</code> in your project:',
                ('code',
                 'name: CI\n'
                 'on: [push, pull_request]\n'
                 '\n'
                 'jobs:\n'
                 '  test:\n'
                 '    runs-on: ubuntu-latest\n'
                 '    steps:\n'
                 '      - uses: actions/checkout@v4\n'
                 '      - uses: actions/setup-node@v4\n'
                 '        with:\n'
                 '          node-version: 20\n'
                 '      - run: npm ci\n'
                 '      - run: npm test -- --run\n'
                 '      - run: npm run build'),
                'Push it, then open the <b>Actions</b> tab on GitHub to watch it run.']),
              ('Protect your main branch',
               ['In GitHub → Settings → Branches, add a rule for <code>main</code> that requires the CI check to pass '
                'before a pull request can be merged.']),
              ('When a run fails',
               [['Open the failed step and read the last lines of the log first.',
                 'Run the same command locally (<code>npm test</code>) to reproduce it.',
                 'Fix, commit, push: the check runs again automatically.']])],
 'w12-wed': [('Rendering lists',
              ['Use <code>map</code> to turn an array of data into an array of elements. Every item needs a '
               "<code>key</code> that is unique and stable, usually the item's id.",
               ('code',
                'function ProductList({ products }) {\n'
                '  return (\n'
                '    <ul>\n'
                '      {products.map((p) => (\n'
                '        <li key={p.id}>{p.name}</li>\n'
                '      ))}\n'
                '    </ul>\n'
                '  );\n'
                '}'),
               'Avoid using the array index as a key when items can be added, removed or reordered: React may mix up '
               'which item is which.']),
             ('Conditional rendering',
              [('code',
                '{isLoading && <Spinner />}\n'
                '{error ? <ErrorMessage text={error} /> : <Results items={items} />}\n'
                '{items.length === 0 && <p>No products match your search.</p>}'),
               'Watch out: <code>{count && …}</code> renders a <b>0</b> when count is 0. Use <code>{count > 0 && '
               '…}</code> instead.']),
             ('Handling events',
              [('code',
                '<button onClick={() => setOpen(true)}>Open</button>\n'
                '<input value={query} onChange={(e) => setQuery(e.target.value)} />\n'
                '<form onSubmit={(e) => { e.preventDefault(); save(); }}>…</form>'),
               "Pass a function, don't call it: <code>onClick={save}</code> or <code>onClick={() => save(id)}</code>, "
               'never <code>onClick={save()}</code>.'])],
 'w13-tue': [('Controlled inputs',
              ['In React, form fields are usually <b>controlled</b>: the value lives in state and every keystroke '
               'updates it.',
               ('code',
                "const [email, setEmail] = useState('');\n"
                '\n'
                '<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />')]),
             ('Validation that feels friendly',
              [['Validate on submit, then live as the user fixes each field.',
                'Show errors only after a field has been touched, not while someone is still typing their first '
                'letters.',
                'Put the message right under the field and say how to fix it: "Enter a date that isn\'t in the past".',
                'Disable the submit button while saving and show progress ("Saving…").']]),
             ("Example: due date can't be in the past",
              [('code',
                'function validateDueDate(value) {\n'
                "  if (!value) return 'Choose a due date.';\n"
                '  const today = new Date().toISOString().slice(0, 10);\n'
                "  return value < today ? 'Choose a date that isn\\'t in the past.' : '';\n"
                '}')]),
             ('When to use a form library',
              ['For one or two fields, plain state is fine. For long forms with many rules, <b>React Hook Form</b> '
               'handles values, touched state and validation for you, with less re-rendering.'])],
 'w17-mon': [('Pick a real problem',
              ['The best capstones solve a small problem someone actually has: a church or club needing an events '
               'page, a tutor tracking students, a shop showing its menu. A real user gives you real feedback, and a '
               'better story in interviews.']),
             ('Write a 10-line spec',
              [['<b>Who</b> is it for?',
                '<b>What problem</b> does it solve, in one sentence?',
                '<b>Pages</b>: list them (e.g. Home, List, Detail, Add new).',
                '<b>Features</b>: what can someone do on each page?',
                '<b>Data</b>: where does it come from: an API, a JSON file, or what the user types?']]),
             ('Find the smallest useful version',
              ["Cut your feature list until what's left can be built in three days and is still useful. Everything "
               'else goes on a "later" list. Shipping something small that works beats half-finishing something big.']),
             ('Sketch before you code',
              ['Draw each page on paper or in Figma: boxes for the main parts and the buttons. Your sketch becomes '
               'your component tree tomorrow.'])],
 'w17-tue': [('Set up',
              [('code',
                'npm create vite@latest my-capstone -- --template react\n'
                'cd my-capstone\n'
                'npm install\n'
                'npm install bootstrap react-router-dom\n'
                'npm run dev'),
               'Import Bootstrap once in <code>main.jsx</code>: <code>import '
               "'bootstrap/dist/css/bootstrap.min.css';</code>"]),
             ('From sketch to components',
              [['Draw a box around every part of your sketch that repeats or has one clear job. Each box becomes a '
                'component.',
                'Name components after what they show: <code>EventCard</code>, <code>EventList</code>, '
                '<code>SearchBar</code>.',
                'Decide where each piece of state lives: in the lowest component that all its users share.']]),
             ('Work in small steps',
              [['Make one thing work, then commit: <code>git commit -m "Show events from the API"</code>.',
                'If something breaks, you can always go back to the last working commit.',
                'Push to GitHub at the end of every session.']])],
 'w18-mon': [('Check it on a phone',
              ['Open DevTools, switch on the device toolbar, and test at 375px and 1280px. Nothing should scroll '
               'sideways, and every button should be easy to tap.']),
             ('Accessibility basics',
              [['Every image has <code>alt</code> text; every form field has a <code>&lt;label&gt;</code>.',
                'You can use the whole app with only the keyboard, and you can always see where the focus is.',
                'Text is readable against its background (contrast).']]),
             ('Run Lighthouse',
              ['Open DevTools → <b>Lighthouse</b>, choose Mobile, tick Accessibility and Performance, then run it. Fix '
               'the top three issues and run it again.'])],
 'w18-tue': [('Write a README',
              [["One sentence on what the app does and who it's for.",
                'A screenshot or two, and the live link.',
                'How to run it locally: <code>npm install</code>, then <code>npm run dev</code>.',
                'A short "what I learned" section.']]),
             ('Final deploy on Vercel',
              ['Push your final changes to <code>main</code>. Vercel deploys automatically, exactly as in Week 16. '
               'Open the live link on your phone and click through every page before you submit.'])],
 'w19-mon': [('Your portfolio',
              [['Show your 3 best projects, each with a live link, GitHub link, one screenshot and two lines on what '
                'it does and what you learned.',
                'Add a short "about me" and a way to contact you.',
                'Make sure it works on a phone and loads fast.']])],
 'w19-tue': [('Your GitHub profile',
              [["Add a profile README: who you are, what you're learning, your stack.",
                'Pin your best repositories.',
                'Every project gets a README with screenshots and setup steps.']]),
             ('A one-page CV',
              [['Lead with projects, not a long list of tools.',
                'For each project: what you built, the tech used, and one result or challenge you solved.',
                'Keep it to one page and send it as a PDF.']])],
 'w19-thu': [('Common junior interview questions',
              [["What's the difference between <code>let</code>, <code>const</code> and <code>var</code>?",
                'Explain the CSS box model.',
                'What happens when you type a URL and press Enter?',
                'What are props and state in React?',
                'When does <code>useEffect</code> run?',
                'How do you make a page accessible?',
                'Walk me through a project you built and one bug you fixed.']]),
             ('Talking about your projects',
              ['Use a simple structure: the problem, what you built, one challenge and how you solved it, and what '
               "you'd do next. Keep it under 2 minutes and practise it out loud."]),
             ('Live coding',
              [['Think out loud: interviewers want to hear how you reason.',
                'Ask questions before you start coding.',
                'Start simple, then improve.',
                "If you're stuck, say what you'd try next."]])],
 'w6-wed': [('Why loops',
             ["A loop repeats code so you don't have to copy it. Use one whenever you'd otherwise write the same line "
              'again and again.']),
            ('for: when you know how many times',
             [('code', "for (let i = 1; i <= 5; i++) {\n  console.log('Lap', i);\n}")]),
            ('while: until something changes',
             [('code',
               'let balance = 1000;\n'
               'let months = 0;\n'
               'while (balance > 0) {\n'
               '  balance -= 150;\n'
               '  months++;\n'
               '}\n'
               'console.log(months); // 7')]),
            ('for...of: go through a list',
             [('code',
               "const fruits = ['mango', 'pawpaw', 'orange'];\n"
               'for (const fruit of fruits) {\n'
               '  console.log(fruit);\n'
               '}')]),
            ('Watch out',
             [['An infinite loop never ends and freezes the tab: make sure the condition eventually becomes false.',
               '<code>break</code> stops the loop early; <code>continue</code> skips to the next round.']])],
 'w7-mon': [('An array is an ordered list',
             [('code',
               'const scores = [72, 85, 90];\n'
               'scores[0];        // 72 (counting starts at 0)\n'
               'scores.length;    // 3\n'
               'scores[scores.length - 1]; // 90, the last item')]),
            ('Changing an array',
             [['<code>push(x)</code> adds to the end; <code>pop()</code> removes from the end.',
               '<code>unshift(x)</code> adds to the start; <code>shift()</code> removes from the start.',
               '<code>splice(index, count)</code> removes items from the middle.',
               "<code>includes(x)</code> and <code>indexOf(x)</code> check what's inside."]]),
            ('Looping through an array',
             [('code',
               'let total = 0;\n'
               'for (const score of scores) {\n'
               '  total += score;\n'
               '}\n'
               'console.log(total / scores.length); // the average')])],
 'w7-tue': [('An object describes one thing',
             [('code',
               'const student = {\n'
               "  name: 'Ada',\n"
               '  age: 21,\n'
               '  scores: [72, 85, 90],\n'
               '};\n'
               '\n'
               "student.name;        // 'Ada'\n"
               "student['age'];      // 21\n"
               "student.city = 'Lagos'; // add a property")]),
            ('Arrays of objects',
             ['Most real data is a list of objects: products, users, tasks.',
              ('code',
               'const products = [\n'
               "  { id: 1, name: 'Notebook', price: 1500 },\n"
               "  { id: 2, name: 'Pen', price: 300 },\n"
               '];\n'
               "products[1].name; // 'Pen'")]),
            ('Destructuring and spread',
             [('code',
               'const { name, age } = student;          // pull values out\n'
               'const older = { ...student, age: 22 };  // copy and change one value\n'
               'const more = [...scores, 100];          // copy an array and add')]),
            ('Copy vs reference',
             ["<code>const b = a</code> doesn't copy an object: both names point to the same one, so changing "
              '<code>b</code> changes <code>a</code>. Use spread (<code>{ ...a }</code>) to make a copy.'])],
 'w8-tue': [('Create, fill, add',
             [('code',
               "const list = document.querySelector('#tasks');\n"
               '\n'
               "const item = document.createElement('li');\n"
               "item.textContent = 'Buy data';\n"
               "item.classList.add('task');\n"
               'list.append(item);')]),
            ('Render a list from data',
             ['Keep your data in an array, and rebuild the list from it whenever it changes:',
              ('code',
               'function render(tasks) {\n'
               "  list.innerHTML = ''; // clear\n"
               '  for (const task of tasks) {\n'
               "    const li = document.createElement('li');\n"
               '    li.textContent = task.title;\n'
               '    list.append(li);\n'
               '  }\n'
               '}')]),
            ('Why textContent, not innerHTML',
             ['<code>innerHTML</code> treats text as HTML. If a user types <code>&lt;img src=x '
              'onerror=alert(1)&gt;</code> as a task name, it runs. <code>textContent</code> always shows text as '
              'text. Use it for anything a user typed.']),
            ('Removing and updating',
             [['<code>element.remove()</code> deletes it from the page.',
               "<code>element.classList.toggle('done')</code> switches a class on and off.",
               "<code>element.setAttribute('aria-pressed', 'true')</code> changes an attribute."]])],
 'w8-thu': [('Handle the submit',
             [('code',
               "const form = document.querySelector('#task-form');\n"
               '\n'
               "form.addEventListener('submit', (event) => {\n"
               '  event.preventDefault(); // stop the page reloading\n'
               '  const title = form.elements.title.value.trim();\n'
               "  if (!title) return showError('Enter a task.');\n"
               '  addTask(title);\n'
               '  form.reset();\n'
               '});')]),
            ('Friendly validation',
             [['Check on submit first; then re-check as the user fixes the field.',
               'Put the message right under the field and say how to fix it.',
               "Keep what they typed: never clear the form when there's an error.",
               'Link the message to the field with <code>aria-describedby</code> so screen readers read it.']]),
            ('Use HTML validation too',
             ['<code>required</code>, <code>type="email"</code> and <code>minlength</code> give you free checks. '
              "JavaScript adds friendlier messages and rules HTML can't express."])],
 'w9-wed': [('Four states, every time',
             [['<b>Loading</b>: the request is on its way. Show a spinner or a grey placeholder.',
               '<b>Success</b>: show the data.',
               "<b>Empty</b>: it worked, but there's nothing to show. Say so and suggest what to do.",
               '<b>Error</b>: say what went wrong in plain words and offer "Try again".']]),
            ('In code',
             [('code',
               'async function loadWeather(city) {\n'
               "  show('loading');\n"
               '  try {\n'
               '    const res = await fetch(url(city));\n'
               "    if (!res.ok) throw new Error('Request failed');\n"
               '    const data = await res.json();\n'
               "    data ? show('success', data) : show('empty');\n"
               '  } catch {\n'
               '    show(\'error\', "Couldn\'t load the weather. Check your connection and try again.");\n'
               '  }\n'
               '}')]),
            ('Test it',
             ['In DevTools → Network, set throttling to <b>Slow 3G</b> to see your loading state, and <b>Offline</b> '
              'to see your error state.'])],
 'w10-wed': [('Why branches',
              ['A branch is a separate line of work. Build a feature on a branch, and <code>main</code> stays working '
               'until the feature is ready.']),
             ('The everyday flow',
              [('code',
                'git switch -c add-filter     # create and move to a branch\n'
                '# ...edit, then:\n'
                'git add .\n'
                'git commit -m "Add status filter"\n'
                'git switch main\n'
                'git merge add-filter         # bring the work into main\n'
                'git branch -d add-filter     # tidy up')]),
             ('Merge conflicts',
              ['A conflict happens when two branches changed the same lines. Git marks them in the file:',
               ('code', '<<<<<<< HEAD\n<h1>My Tasks</h1>\n=======\n<h1>Task Manager</h1>\n>>>>>>> add-filter'),
               'Keep the version you want, delete the markers, then <code>git add</code> and <code>git '
               'commit</code>.'])],
 'w10-thu': [('Undo, safely',
              [["<code>git restore file.js</code>: throw away changes you haven't committed.",
                '<code>git restore --staged file.js</code>: unstage a file but keep your changes.',
                "<code>git commit --amend</code>: fix the last commit's message or add a forgotten file (before you "
                'push).',
                '<code>git revert &lt;commit&gt;</code>: make a new commit that undoes an old one. Safe even after '
                'pushing.']]),
             ('Keep things out of Git',
              ['Create a <code>.gitignore</code> file:',
               ('code', 'node_modules/\ndist/\n.env\n.DS_Store'),
               "Never commit passwords, API keys or <code>.env</code> files. Once something is pushed, assume it's "
               'public forever.']),
             ('Good commit messages',
              ['Say what the commit does, in the present tense: <b>"Add dark mode toggle"</b>, not "stuff" or "fixed". '
               'One commit = one change.'])],
 'w11-tue': [('What a pull request is',
              ['A pull request (PR) asks to merge your branch into <code>main</code>. It shows every change, and '
               'teammates can comment before anything is merged.']),
             ('Open one',
              [['Push your branch: <code>git push -u origin add-filter</code>.',
                'On GitHub, click <b>Compare &amp; pull request</b>.',
                'Write a title and a short description: what changed, why, and how to check it.',
                'Add a screenshot for anything visual.']]),
             ('Review kindly',
              [['Comment on the code, not the person.',
                'Ask questions: "What happens if the list is empty?"',
                "Suggest, don't demand, and explain why.",
                "Approve when it's good enough, not perfect."]]),
             ('Issues',
              ['Use GitHub Issues to track bugs and tasks. Mention an issue in a PR ("Fixes #3") and it closes when '
               'the PR is merged.'])],
 'w11-thu': [('VS Code basics',
              [['<b>Cmd/Ctrl + P</b>: open any file by name.',
                '<b>Cmd/Ctrl + Shift + F</b>: search the whole project.',
                '<b>Ctrl + `</b>: open the built-in terminal.',
                'Extensions to install: Prettier, ESLint.']]),
             ('Prettier: formatting you never think about',
              ['Install the Prettier extension, then in Settings turn on <b>Format On Save</b> and set Prettier as the '
               'default formatter. Every save now tidies spacing, quotes and line length the same way for everyone.']),
             ('ESLint: catch mistakes early',
              ['ESLint reads your code and flags problems before you run it: unused variables, typos in names, missing '
               "dependencies in React effects. Vite's React template already includes it: run <code>npm run "
               'lint</code>.',
               ('code', 'npm run lint')])],
 'w13-mon': [('Thinking in React: 5 steps',
              [['<b>Break the design into components</b>: draw boxes around each part.',
                '<b>Build a static version</b> with props only, no state.',
                "<b>Find the minimal state</b>: what changes over time and can't be calculated?",
                '<b>Decide where state lives</b>: the closest parent of every component that needs it.',
                '<b>Pass functions down</b> so children can ask the parent to change state.']]),
             ('Lifting state up',
              [('code',
                'function App() {\n'
                '  const [tasks, setTasks] = useState([]);\n'
                '  const addTask = (title) => setTasks([...tasks, { id: Date.now(), title }]);\n'
                '  return (\n'
                '    <>\n'
                '      <TaskForm onAdd={addTask} />\n'
                '      <TaskList tasks={tasks} />\n'
                '    </>\n'
                '  );\n'
                '}'),
               '<code>TaskForm</code> and <code>TaskList</code> both need the tasks, so they live in '
               '<code>App</code>.'])],
 'w14-wed': [('Shared layouts',
              [('code',
                '<Route element={<Layout />}>\n'
                '  <Route path="/" element={<Home />} />\n'
                '  <Route path="tasks/:id" element={<TaskDetail />} />\n'
                '</Route>\n'
                '\n'
                'function Layout() {\n'
                '  return (<><Header /><main><Outlet /></main></>);\n'
                '}')]),
             ('Params and search params',
              [('code',
                "const { id } = useParams();               // /tasks/42 → '42'\n"
                'const [params, setParams] = useSearchParams();\n'
                "const filter = params.get('status') ?? 'all'; // /tasks?status=done")]),
             ('Protected pages',
              [('code',
                'function RequireUser({ children }) {\n'
                '  const user = useUser();\n'
                '  if (!user) return <Navigate to="/login" replace />;\n'
                '  return children;\n'
                '}\n'
                '\n'
                '<Route path="favourites" element={<RequireUser><Favourites /></RequireUser>} />'),
               'This hides the page in the app. Real data must also be protected on the server.'])],
 'w15-wed': [('Debouncing',
              ['Wait until the user pauses typing before searching:',
               ('code',
                'function useDebounce(value, delay = 400) {\n'
                '  const [debounced, setDebounced] = useState(value);\n'
                '  useEffect(() => {\n'
                '    const id = setTimeout(() => setDebounced(value), delay);\n'
                '    return () => clearTimeout(id);\n'
                '  }, [value, delay]);\n'
                '  return debounced;\n'
                '}')]),
             ('Race conditions',
              ['If you search "re" then "react", the "re" results might arrive last and overwrite the right ones. '
               'Cancel the old request when a new one starts:',
               ('code',
                'useEffect(() => {\n'
                '  const controller = new AbortController();\n'
                '  fetch(url(query), { signal: controller.signal })\n'
                '    .then((r) => r.json())\n'
                '    .then(setResults)\n'
                '    .catch(() => {});\n'
                '  return () => controller.abort();\n'
                '}, [query]);')]),
             ('Keep the search in the URL',
              ['Store the query in search params (<code>?q=react</code>) so people can share and refresh a search.'])],
 'w16-mon': [('From code to website',
              [['<code>npm run build</code> turns your React code into plain HTML, CSS and JavaScript in the '
                '<code>dist</code> folder.',
                'A host stores those files and sends them to anyone who visits your address.',
                'A <b>CDN</b> keeps copies in many cities, so your site loads fast everywhere.']]),
             ('Static hosting',
              ['A React app built with Vite is <b>static</b>: just files, no server code. That makes it cheap (often '
               'free) and fast to host on Vercel.']),
             ('Check before you deploy',
              [('code', 'npm run build\nnpm run preview   # opens the production build locally'),
               'If it works in the preview, it will almost always work on Vercel.'])],
 'w16-tue': [('Deploy in five steps',
              [['Push your project to GitHub.',
                'Go to <b>vercel.com</b> and sign in with GitHub.',
                'Click <b>Add New → Project</b> and import your repository.',
                'Vercel detects Vite: build command <code>npm run build</code>, output directory <code>dist</code>.',
                'Click <b>Deploy</b>. In about a minute you get a live link.']]),
             ('Every push redeploys',
              ['From now on, every push to <code>main</code> deploys automatically. Your live site always matches your '
               'latest code.']),
             ('When a deploy fails',
              ['Open the deployment and read the <b>build log</b> from the bottom up. Run <code>npm run build</code> '
               'locally to reproduce the error, fix it, and push again.'])],
 'w16-wed': [('Environment variables',
              ['Values like API URLs go in environment variables, not in your code. In Vite they must start with '
               '<code>VITE_</code>:',
               ('code',
                '// .env (never commit this file)\n'
                'VITE_API_URL=https://api.example.com\n'
                '\n'
                '// in your code\n'
                'const api = import.meta.env.VITE_API_URL;'),
               'On Vercel: Project → <b>Settings → Environment Variables</b>, add the same names, then redeploy. '
               'Anything starting with <code>VITE_</code> ends up in the browser, so never put secrets there.']),
             ('Preview deployments',
              ['Every pull request gets its own preview link. Check the change live before merging it into '
               '<code>main</code>.']),
             ('Fix 404s on refresh',
              ['Add a <code>vercel.json</code> file so every path loads your app:',
               ('code', '{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }')]),
             ('Roll back',
              ['Broke production? Open an earlier deployment in Vercel and choose <b>Promote to Production</b>.'])],
 'w16-thu': [('Your own domain',
              [['Buy a domain from a registrar (for example a .com or .com.ng).',
                'In Vercel: Project → <b>Settings → Domains</b> → add your domain.',
                'Vercel shows the DNS record to add at your registrar: an <b>A</b> record (points the domain to an '
                'address) or a <b>CNAME</b> (points a subdomain like www to another name).',
                'Wait for DNS to update (minutes to a few hours). HTTPS is set up for you.']]),
             ('Going-live checklist',
              [['Every page loads, including after a refresh.',
                'Works on a phone.',
                'Environment variables set on Vercel.',
                'Lighthouse accessibility and performance checked.',
                'Live link in your README.']])],
 'w17-wed': [('Model your data',
              ['Write down what one item looks like before you build:',
               ('code',
                '// one event\n'
                '{\n'
                "  id: 'e1',\n"
                "  title: 'Youth tech meetup',\n"
                "  date: '2026-12-05',\n"
                "  location: 'Yaba, Lagos',\n"
                '  seats: 40,\n'
                '}')]),
             ('Where does it come from?',
              [['<b>An API</b>: fetch it, with loading and error states (Week 09 and 15).',
                '<b>A JSON file</b>: import it, simplest for a first version.',
                '<b>The user</b>: a form, saved with <code>useLocalStorage</code> (Week 13).']]),
             ('Place your state',
              ['Use the Week 13 steps: find the minimal state, then keep it in the closest shared parent or in '
               'Context.'])],
 'w17-thu': [('Show it early',
              ['Push your unfinished app and share the Vercel preview link. Early feedback costs nothing; late '
               'feedback costs days.']),
             ('A 10-minute test',
              [['Give someone one task: "Find an event this weekend and save it."',
                "Don't help or explain. Watch and take notes.",
                'Write down every place they hesitate or get stuck.']]),
             ('Re-plan',
              ["List what's left. Cut anything that isn't needed for your core feature. A finished small app beats an "
               'unfinished big one.'])],
 'w18-wed': [("Watch, don't help",
              ["Ask two people to complete your app's main task while you watch silently. Every time they hesitate, "
               "that's a design problem, not their mistake."]),
             ('Fix in order',
              [['Anything that stops someone finishing the task.',
                'Anything that confused more than one person.',
                'Small visual polish, last.']]),
             ('Know when to stop',
              ['When the main task is smooth on phone and laptop, stop polishing and get ready to present.'])],
 'w18-thu': [('A 5-minute demo',
              [['<b>The problem</b> (30 seconds): who has it and why it matters.',
                '<b>Live demo</b> (2 minutes): the main task, start to finish.',
                '<b>One challenge</b> (1 minute): something that broke and how you fixed it.',
                "<b>What you learned and what's next</b> (1 minute)."]]),
             ('Practise',
              ['Say it out loud three times and time yourself. Keep screenshots ready in case the internet fails '
               'during the demo.'])],
 'w19-wed': [('Where to look',
              [['Job boards and LinkedIn: search "junior frontend", "React developer", "frontend intern".',
                'Company career pages of products you use.',
                'Tech communities, meetups and Twitter/X: many roles are shared there first.']]),
             ('Reading a job ad',
              ['Split requirements into must-haves (usually HTML, CSS, JavaScript, React, Git) and nice-to-haves. If '
               'you meet most must-haves, apply.']),
             ('Apply well',
              [['Tailor your first two lines to the company: what they build and why you care.',
                'Link your portfolio and the most relevant project.',
                'Keep a simple tracker: company, role, date, link, status.',
                'Follow up politely after a week if you hear nothing.']])]}
