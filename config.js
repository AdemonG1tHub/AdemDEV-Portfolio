// -----------------------------------------------------------------------------
// Portfolio Config
// -----------------------------------------------------------------------------
// Everything shown on the website is driven by this object.
// Edit this file to add/update your content without touching HTML/JS.
//
// Tips:
// - Keep URLs absolute (https://...) for external links.
// - Keep local file paths relative to website root (example: images/foo.png).
// - Markdown files can be used in `currentlySelling[].md`.
// -----------------------------------------------------------------------------
// 
const CONFIG = {
  // ---------------------------------------------------------------------------
  // Identity / Hero
  // ---------------------------------------------------------------------------
  name: "AdemDEV",
  tagline: "Minecraft & Discord Development",
  subtitle:
    "A developer specialising in MC Bedrock Scripting, Discord bots, and Endstone Plugins. Creating new projects every month.",

  // Contact + social
  email: "contact@ademdev.xyz",
  github: "https://github.com/AdemonG1tHub",
  discord: "ademondiscrd",

  FOOTER: {
    tagLine: "Not affiliated with Mojang Studios.",
  },

  // ---------------------------------------------------------------------------
  // Stats (displayed in hero/stats area if enabled by layout)
  // ---------------------------------------------------------------------------
  // Shape: { num: string, label: string }
  // Example:
  // { num: "10+", label: "Production Deployments" }
  stats: [
    { num: "3+", label: "Years of Experience" },
    { num: "5+", label: "Projects Built" },
    { num: "Owner", label: "of Realm Explorer" },
    { num: "Intermediate", label: "Developer" },
  ],

  // ---------------------------------------------------------------------------
  // Skills chips
  // ---------------------------------------------------------------------------
  skills: [
    "TypeScript",
    "Python",
    "Node.js",
    "Discord.js/py",
    "Bedrock Scripting API",
    "Endstone Plugins",
    "GitHub Apps",
    "HTML / CSS",
  ],

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  // Required fields:
  // - title, desc
  // Optional fields:
  // - icon (emoji), tags (string[]), status ("active" | "wip" | "archived")
  // - color (hex), cover (image path), links ([{label,url}]), gallery ([{url,caption}])
  //
  // Example project template:
  // {
  //   icon: "🧩",
  //   title: "Project Name",
  //   desc: "Short description.",
  //   tags: ["TypeScript", "API"],
  //   status: "active",
  //   color: "#42A5F5",
  //   cover: "images/project-cover.png",
  //   links: [{ label: "GitHub", url: "https://github.com/user/repo" }],
  //   gallery: [
  //     { url: "images/project-1.png", caption: "Dashboard" },
  //     { url: "images/project-2.png", caption: "Settings" },
  //   ],
  // }
  projects: [
    {
      icon: "🌌",
      title: "CrabSMP Engine",
      desc: "Full-featured Minecraft Bedrock server engine — RPG levelling, factions, quest system, custom shop menu, NPC handlers, sidebar HUD, and Discord embed integration.",
      tags: ["TypeScript", "Python", "Endstone", "Discord.js"],
      status: "active",
      color: "#29B6F6",
      // Optional: project cards also support cover images now.
      cover: "images/cover-art/CrabSMP.png",
      links: [
        { label: "Join the Discord", url: "https://discord.gg/crabsmp" },
        { label: "Visit the Website", url: "https://crabsmp.net" },
      ],
      gallery: [{ url: "images/crab-engine/crab-engine1.png", caption: "Main Menu" }],
    },
    {
      icon: "🛡️",
      title: "Pixel Badge Icon Pack",
      desc: "A collection of 9 pixel art badge like icons for Discord bots, Minecraft servers, or any other project. Free to use with attribution.",
      tags: ["Pixel Art", "Free Resource"],
      status: "active",
      color: "#E91E63",
      cover: "images/cover-art/PixelBadgePack.png",
      links: [
        { label: "Download on Discord", url: "https://discord.gg/jJT58SFTEy" },
      ],
      gallery: [{url: "images/pixel-badge/red.png", caption: "Red Badge"},
                {url: "images/pixel-badge/orange.png", caption: "Orange Badge"},
                {url: "images/pixel-badge/yellow.png", caption: "Yellow Badge"},
                {url: "images/pixel-badge/lime.png", caption: "Lime Badge"},
                {url: "images/pixel-badge/lightgreen.png", caption: "Light Green Badge"},
                {url: "images/pixel-badge/cyan.png", caption: "Cyan Badge"},
                {url: "images/pixel-badge/blue.png", caption: "Blue Badge"},
                {url: "images/pixel-badge/purple.png", caption: "Purple Badge"},
                {url: "images/pixel-badge/pink.png", caption: "Pink Badge"},
      ],
    },
    {
      icon: "🌐",
      title: "Realm Explorer",
      desc: "A discovery platform for Minecraft Bedrock Realms & Servers. Featuring RE Hub which allows you to join Bedrock servers on console.",
      tags: ["Scripting API", "Discord"],
      status: "active",
      color: "#4CAF50",
      cover: "images/cover-art/RealmExplorer.png",
      links: [
        { label: "Join the Discord", url: "https://discord.gg/realmexplorer" },
      ],
      gallery: [],
    },
    {
      icon: "⚔️",
      title: "Endrod Utilities",
      desc: "An open-sourced server / realm management tool for Minecraft Bedrock. Featuring Homes, Warps, Player Stats, and more planned.",
      tags: ["TypeScript", "JSON UI"],
      status: "wip",
      color: "#F5C518",
      cover: "images/cover-art/EndrodUtilities.png",
      links: [],
      gallery: [],
    },
    {
      icon: "🐍",
      title: "Embed Creator",
      desc: "A python script that lets you create custom Discord embeds with a live preview, and copy the resulting JSON to clipboard.",
      tags: ["Python", "discord.py"],
      status: "wip",
      color: "#9E9E9E",
      cover: "images/cover-art/EmbedCreator.png",
      links: [],
      gallery: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------------------
  // Shape: { icon: string, name: string, desc: string }
  // Example:
  // { icon: "🛠", name: "Plugin Maintenance", desc: "Bug fixes and updates." }
  services: [
    {
      icon: "🎮",
      name: "Minecraft Developer",
      desc: "Custom Bedrock scripting with TypeScript & Endstone. Quest systems, GUI menus, RPG mechanics, shop systems, and more.",
    },
    {
      icon: "🤖",
      name: "Discord Bot Developer",
      desc: "Feature-rich bots with slash commands, admin panels, Minecraft integrations, and persistent data storage.",
    },
    {
      icon: "🔧",
      name: "Server Infrastructure",
      desc: "CI/CD pipelines, GitHub Actions, SFTP deployment, Pterodactyl panel management, and process automation.",
    },
    {
      icon: "🌐",
      name: "Web Development",
      desc: "Clean, functional websites and tools — full-stack JS/TS with Node.js backends and modern frontends.",
    },
  ],

  // ---------------------------------------------------------------------------
  // Feature flags
  // ---------------------------------------------------------------------------
  // Set to false to temporarily hide the Store section and related links.
  featureFlags: {
    showStoreSection: false,
  },

  // ---------------------------------------------------------------------------
  // Store hidden fallback CTA (hero top button)
  // ---------------------------------------------------------------------------
  // Used only when `featureFlags.showStoreSection` is false.
  // action: "copy" | "url"
  // - "copy": copies `copyText` to clipboard
  // - "url": opens `url`
  // If omitted, defaults to copying `discord`.
  storeHiddenCta: {
    action: "url",
    label: "Join Discord ↩",
    copyText: "ademondiscrd",
    url: "https://discord.gg/jJT58SFTEy",
  },

  // ---------------------------------------------------------------------------
  // Currently Selling (store cards + selling modal)
  // ---------------------------------------------------------------------------
  // `md` supports either:
  // - inline markdown string
  // - local markdown path (example: "markdown/astral-engine.md")
  //
  // Store item template:
  // {
  //   id: "unique-id",
  //   title: "Product Name",
  //   price: "$20 USD",
  //   cover: "images/product-cover.png", (size: 1000x400)
  //   images: [{ url: "images/product-1.png", caption: "Screenshot 1" }],
  //   tags: ["engine", "minecraft"],
  //   md: "markdown/product.md",
  //   links: [{ label: "Buy", url: "https://..." }],
  // }
  currentlySelling: [
    {
      id: "astral-engine",
      title: "AstralCraft Engine",
      price: "$50 USD",
      cover: "images/cover-art/AstralCraft.png",
      images: [
        { url: "images/astral-engine/astral-engine1.png", caption: "Screenshot 1" },
        { url: "images/astral-engine/astral-engine2.png", caption: "Screenshot 2" },
        { url: "images/astral-engine/astral-engine3.png", caption: "Screenshot 3" },
        { url: "images/astral-engine/astral-engine4.png", caption: "Screenshot 4" },
        { url: "images/astral-engine/astral-engine5.png", caption: "Screenshot 5" },
        { url: "images/astral-engine/astral-engine6.png", caption: "Screenshot 6" },
        { url: "images/astral-engine/astral-engine7.png", caption: "Screenshot 7" },
        { url: "images/astral-engine/astral-engine8.png", caption: "Screenshot 8" },
        { url: "images/astral-engine/astral-engine9.png", caption: "Screenshot 9" },
        { url: "images/astral-engine/astral-engine10.png", caption: "Screenshot 10" },
        { url: "images/astral-engine/astral-engine11.png", caption: "Screenshot 11" },
        { url: "images/astral-engine/astral-engine12.png", caption: "Screenshot 12" },
        { url: "images/astral-engine/astral-engine13.png", caption: "Screenshot 13" },
        { url: "images/astral-engine/astral-engine14.png", caption: "Screenshot 14" },
        { url: "images/astral-engine/astral-engine15.png", caption: "Screenshot 15" },
        { url: "images/astral-engine/astral-engine16.png", caption: "Screenshot 16" },
        { url: "images/astral-engine/astral-engine17.png", caption: "Screenshot 17" },
        { url: "images/astral-engine/astral-engine18.png", caption: "Screenshot 18" },
        { url: "images/astral-engine/astral-engine19.png", caption: "Screenshot 19" },
        { url: "images/astral-engine/astral-engine20.png", caption: "Screenshot 20" },
        { url: "images/astral-engine/astral-engine21.png", caption: "Screenshot 21" },
        { url: "images/astral-engine/astral-engine22.png", caption: "Screenshot 22" },
        { url: "images/astral-engine/astral-engine23.png", caption: "Screenshot 23" },
        { url: "images/astral-engine/astral-engine24.png", caption: "Screenshot 24" },
      ],
      tags: ["engine", "minecraft", "download"],
      md: "markdown/astral-engine.md",
      links: [{ label: "Buy via PayPal", url: "https://paypal.me/ademusman8" }],
    },
  ],
};
