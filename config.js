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
  email: "ademdev@nethergate.llc",
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
  // - slug (custom URL slug, example: "CrabSMP-Engine")
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
      icon: "🔥",
      title: "NetherGate LLC",
      desc: "NetherGate is a Minecraft network built around communities, projects, and creators working toward a shared goal. We connect servers, developers, builders, content creators, and players under one ecosystem.",
      tags: ["Free Public Resources", "Opportunities for Creators", "Minecraft Network"],
      status: "wip",
      color: "#F44336",
      links: [{ label: "Join the Discord", url: "https://discord.gg/nethergate" }, { label: "Visit the Website", url: "https://nethergate.llc" }],
    },
    {
      icon: "🧩",
      title: "Octane Skygen",
      desc: "The Shop System for Octane Skygen, additionally featuring customisable NPCs which can be used to open Shops via Chest UI menus.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#42A5F5",
    },
    {
      icon: "💫",
      title: "Realm Transfer",
      desc: "An add-on which transfers players from a Realm to a server, via the @minecraft/server-admin Scripting API. (Mojang has now patched this)",
      tags: ["TypeScript", "Scripting API"],
      status: "archived",
      color: "#9E9E9E",
    },
    {
      icon: "⚔️",
      title: "Kits System",
      desc: "A completely customisable Kits Add-on. Featuring a GUI menu, Custom Commands, and a Chest UI menu for easy kit selection. Also featuring cooldowns, tag requirements, and more.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#F5C518",
    },
    {
      icon: "🛒",
      title: "Blaze Network",
      desc: "Another fully customisable Shop Add-on, featuring a Donut SMP like Chest UI menu for buying / selling items for money.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
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
      gallery: [
        { url: "images/pixel-badge/red.png", caption: "Red Badge" },
        { url: "images/pixel-badge/orange.png", caption: "Orange Badge" },
        { url: "images/pixel-badge/yellow.png", caption: "Yellow Badge" },
        { url: "images/pixel-badge/lime.png", caption: "Lime Badge" },
        {
          url: "images/pixel-badge/lightgreen.png",
          caption: "Light Green Badge",
        },
        { url: "images/pixel-badge/cyan.png", caption: "Cyan Badge" },
        { url: "images/pixel-badge/blue.png", caption: "Blue Badge" },
        { url: "images/pixel-badge/purple.png", caption: "Purple Badge" },
        { url: "images/pixel-badge/pink.png", caption: "Pink Badge" },
      ],
    },
    {
      icon: "🌐",
      title: "Realm Explorer",
      desc: "A discovery platform for Minecraft Bedrock Realms & Servers. Featuring RE Hub which allows you to join Bedrock servers on console. (I am no longer the owner of this network)",
      tags: ["Python Bot", "Discord Setup", "Discovery Realm Platform"],
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
    showStoreSection: true,
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
  //   slug: "AstralCraft-Engine",
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
      price: "$100 USD",
      cover: "images/cover-art/AstralCraft.png",
      images: [
        { url: "images/astral-engine/mainmenu.png", caption: "Main Menu" },
        { url: "images/astral-engine/othermenu.png", caption: "Other Menu" },
        { url: "images/astral-engine/auction.png", caption: "Auction" },
        { url: "images/astral-engine/shop.png", caption: "Shop" },
        { url: "images/astral-engine/factions.png", caption: "Factions" },
        { url: "images/astral-engine/warps.png", caption: "Warps" },
        { url: "images/astral-engine/donator.png", caption: "Donator" },
        { url: "images/astral-engine/settings.png", caption: "Settings" },
        { url: "images/astral-engine/stats.png", caption: "Stats" },
        { url: "images/astral-engine/guide.png", caption: "Guide" },
        { url: "images/astral-engine/crate.png", caption: "Crate" },
        { url: "images/astral-engine/claim.png", caption: "Claim" },
        { url: "images/astral-engine/logs.png", caption: "Logs" },
        { url: "images/astral-engine/pause.png", caption: "Pause" },
        { url: "images/astral-engine/hud.png", caption: "HUD" },
        { url: "images/astral-engine/relay.png", caption: "Relay" },
        { url: "images/astral-engine/log.png", caption: "Log" },
        { url: "images/astral-engine/discord.png", caption: "Discord" },
        { url: "images/astral-engine/codeconfig.png", caption: "Config" },
        { url: "images/astral-engine/codelayout.png", caption: "Code Layout" },
        { url: "images/astral-engine/codereadme.png", caption: "README" },
      ],
      tags: ["engine", "minecraft", "download"],
      md: "markdown/astral-engine.md",
      links: [{ label: "Contact to Purchase", url: "https://discord.gg/jJT58SFTEy" }],
    },
    {
      id: "plots-system",
      title: "Plots System",
      price: "$20 USD",
      cover: "images/cover-art/PlotsSystem.png",
      images: [
        { url: "images/plots-system/plots.mov", caption: "Video Example" },
      ],
      tags: ["addon", "minecraft", "download"],
      md: "markdown/plots-system.md",
      links: [{ label: "Contact to Purchase", url: "https://discord.gg/jJT58SFTEy" }],
    }
  ],

  // ---------------------------------------------------------------------------
  // Profile menu (markdown modal)
  // ---------------------------------------------------------------------------
  profileMenu: {
    enabled: true,
    navLabel: "Profile",
    title: "AdemDEV Profile",
    markdownUrl: "https://raw.githubusercontent.com/AdemonG1tHub/AdemonG1tHub/main/README.md",
    buttons: [
      { label: "GitHub", url: "https://github.com/AdemonG1tHub" },
      { label: "Website", url: "https://ademdev.xyz" },
      { label: "Join Discord", url: "https://discord.gg/jJT58SFTEy" },
    ],
  },
};
