import type { SiteConfig } from "@/types/site";

/**
 * Everything shown on the portfolio page.
 *
 * Edit this file to add or update content — no HTML/TS changes needed. The
 * `SiteConfig` type is enforced at build time, so a bad `status` or `color`
 * key fails `npm run build` instead of silently rendering nothing.
 *
 * Conventions:
 * - External links are absolute (https://...).
 * - Local paths are root-absolute and live under `public/` (e.g. /images/foo.png).
 * - `md` fields take inline markdown or a path such as /markdown/astral-engine.md.
 */
export const SITE: SiteConfig = {
  // ---------------------------------------------------------------------------
  // Identity / hero
  // ---------------------------------------------------------------------------
  name: "AdemDEV",
  // Overrides the top-bar logo text only; falls back to `name`.
  // brandText: "AdemDEV.xyz",
  tagline: "Minecraft & Discord Development",
  subtitle:
    "A developer specialising in MC Bedrock Scripting, Discord bots, and Endstone Plugins. Creating new projects every month.",

  email: "ademdev@skyrosmc.com",
  github: "https://github.com/AdemonG1tHub",
  discord: "ademondiscrd",

  FOOTER: {
    tagLine: "Not affiliated with Mojang Studios.",
  },

  // ---------------------------------------------------------------------------
  // Defaults
  // ---------------------------------------------------------------------------
  defaults: {
    // Used by link buttons that don't set a colour of their own.
    linkColor: "gold",
  },

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------
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
  // Required: title, desc. Everything else is optional.
  // `cover` looks best at 1000x400. `gallery` entries may be images or videos.
  projects: [
    {
      icon: "🍌",
      title: "Arkadia",
      desc: "A custom add-on for Arkadia, featuring land claiming, teams, God affinity system, external DB backup system, a bedrock-protocol bot, and much more!",
      tags: ["TypeScript", "JSON UI", "MongoDB", "Node.js"],
      status: "active",
      color: "#ee7905",
      cover: "/images/cover-art/Arkadia.png",
      links: [{ label: "Join the Discord", url: "https://discord.gg/vGJUTEWjUM", color: "blue" }],
      gallery: [
        { url: "/images/arkadia/mainmenu.png", caption: "Main Menu" },
        { url: "/images/arkadia/teammenu.png", caption: "Team Menu" },
        { url: "/images/arkadia/claimchunk.png", caption: "Claiming Land" },
        { url: "/images/arkadia/raids.png", caption: "Raid a Team" },
        { url: "/images/arkadia/choosegod.png", caption: "Choose a God" },
        { url: "/images/arkadia/challenge.png", caption: "Confirmation Screen" },
        { url: "/images/arkadia/god.png", caption: "God Menu" },
        { url: "/images/arkadia/admin.png", caption: "Admin Panel" },
      ],
    },
    {
      icon: "🔥",
      title: "Blaze Network",
      desc: "A fully custom DonutSMP Shop like add-on for MCBE, but featuring other content like Stats, Warps, /pay, a custom sidebar, and even fully configurable modules inside a /admin command.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#eeab18",
      cover: "/images/cover-art/BlazeNetwork.png",
      links: [{ label: "Join the Discord", url: "https://discord.gg/6bQ2JXeVE", color: "blue" }],
      gallery: [
        { url: "/images/blaze/mainmenu.png", caption: "Main Menu" },
        { url: "/images/blaze/scoreboard.png", caption: "Scoreboard" },
        { url: "/images/blaze/buyshop.png", caption: "Buy Shop" },
        { url: "/images/blaze/buyshopconfirm.png", caption: "Amount Selection" },
        { url: "/images/blaze/sellshop.png", caption: "Sell Shop" },
        { url: "/images/blaze/stats.png", caption: "Stats" },
        { url: "/images/blaze/admin.png", caption: "Admin Menu" },
        { url: "/images/blaze/payuser.png", caption: "/pay" },
      ],
    },/*
    {
      icon: "🪙",
      title: "Gilded Utilities",
      desc: "A free MCBE Realm / Server Utility Add-on. Featuring many configurable modules, including: Warps, Homes, Mailbox, Shop System, Ranks, and more!",
      tags: ["TypeScript", "JSON UI", "Free Add-on"],
      status: "wip",
      color: "#fde799",
      cover: "/images/cover-art/GildedUtilities.png",
      links: [
        { label: "View Add-on Page", url: "/gilded-utilities", color: "gold" },
        { label: "Follow the Development", url: "https://discord.gg/CN4U5kkfTm", color: "blue" },
      ],
      gallery: [],
    },
    {
      icon: "🧿",
      title: "Block-Bay",
      desc: "A recreation of ebay but in Minecraft Bedrock. Featuring a custom textured ChestUI menu, a bidding system, and admin commands for managing listings.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#0a87e6",
      cover: "/images/cover-art/BlockBay.png",
      links: [{ label: "View Add-on Page:", url: "/blockbay", color: "gold" }],
      gallery: [],
    },*/
    {
      title: "AstralCraft Engine",
      desc: "A custom Minecraft Bedrock Engine Add-on, featuring a custom GUI, Auction System, Shop System, Factions, Warps, Donator Perks, and much more!",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#ee0dee",
      cover: "/images/cover-art/AstralCraft.png",
      gallery: [
        { url: "/images/astral-engine/mainmenu.png", caption: "Main Menu" },
        { url: "/images/astral-engine/othermenu.png", caption: "Other Menu" },
        { url: "/images/astral-engine/auction.png", caption: "Auction" },
        { url: "/images/astral-engine/shop.png", caption: "Shop" },
        { url: "/images/astral-engine/factions.png", caption: "Factions" },
        { url: "/images/astral-engine/warps.png", caption: "Warps" },
        { url: "/images/astral-engine/donator.png", caption: "Donator" },
        { url: "/images/astral-engine/settings.png", caption: "Settings" },
        { url: "/images/astral-engine/stats.png", caption: "Stats" },
        { url: "/images/astral-engine/guide.png", caption: "Guide" },
        { url: "/images/astral-engine/crate.png", caption: "Crate" },
        { url: "/images/astral-engine/claim.png", caption: "Claim" },
        { url: "/images/astral-engine/logs.png", caption: "Logs" },
        { url: "/images/astral-engine/pause.png", caption: "Pause" },
        { url: "/images/astral-engine/hud.png", caption: "HUD" },
        { url: "/images/astral-engine/relay.png", caption: "Relay" },
        { url: "/images/astral-engine/log.png", caption: "Log" },
        { url: "/images/astral-engine/discord.png", caption: "Discord" },
        { url: "/images/astral-engine/codeconfig.png", caption: "Config" },
        { url: "/images/astral-engine/codelayout.png", caption: "Code Layout" },
        { url: "/images/astral-engine/codereadme.png", caption: "README" },
      ],
      md: "/markdown/astral-engine.md",
      links: [{ label: "Contact to Purchase", url: "https://discord.gg/CN4U5kkfTm", color: "white" }],
    },
    
    {
      icon: "🍃",
      title: "MongoDB-MCBE-Bridge",
      desc: "A Minecraft Scripting API library for MongoDB integration. Designed for better storage saving / access.",
      tags: ["Open-sourced", "MongoDB", "Node.js", "TypeScript"],
      status: "active",
      color: "#4CAF50",
      cover: "/images/cover-art/MongoDB.png",
      links: [
        { label: "GitHub", url: "https://github.com/AdemonG1tHub/MCBE-MongoDB-API", color: "green" },
      ],
    },
    {
      title: "Plots System",
      desc: "A custom plots system for Minecraft Bedrock servers. Featuring a GUI menu, plot claiming, and plot management.",
      status: "active",
      color: "#299c10",
      cover: "/images/cover-art/PlotsSystem.png",
      gallery: [{ url: "/images/plots-system/plots.mov", caption: "Video Example" }],
      tags: ["addon", "minecraft", "download"],
      md: "/markdown/plots-system.md",
      links: [{ label: "Contact to Purchase", url: "https://discord.gg/CN4U5kkfTm", color: "white" }],
    },
    {
      icon: "🧩",
      title: "Octane Skygen",
      desc: "The Shop System for Octane Skygen, additionally featuring customisable NPCs which can be used to open Shops via Chest UI menus.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#42A5F5",
      cover: "/images/cover-art/OctaneSkygen.png",
      links: [{ label: "Join the Discord", url: "https://discord.gg/3wfj3DWB3", color: "blue" }],
      gallery: [
        { url: "/images/octane/npc.png", caption: "NPC" },
        { url: "/images/octane/shopmenu.png", caption: "Shop Menu Example" },
        { url: "/images/octane/admin.png", caption: "Admin Menu" },
        { url: "/images/octane/createshop.png", caption: "Create Shop" },
        { url: "/images/octane/createnpc.png", caption: "Create NPC" },
      ],
    },
    {
      icon: "⚔️",
      title: "Kits System",
      desc: "A completely customisable Kits Add-on. Featuring a GUI menu, Custom Commands, and a Chest UI menu for easy kit selection. Also featuring cooldowns, tag requirements, and more.",
      tags: ["TypeScript", "JSON UI", "Chest UI"],
      status: "active",
      color: "#9b9b99",
      cover: "/images/cover-art/Kits.png",
      gallery: [
        { url: "/images/kits/kitspage.png", caption: "Kits Menu" },
        { url: "/images/kits/admin.png", caption: "Configuration Menu" },
        { url: "/images/kits/commands.png", caption: "Commands" },
      ],
    },
    {
      icon: "🛡️",
      title: "Pixel Badge Icon Pack",
      desc: "A collection of 9 pixel art badge like icons for Discord bots, Minecraft servers, or any other project. Free to use with attribution.",
      tags: ["Pixel Art", "Free Resource"],
      status: "active",
      color: "#E91E63",
      cover: "/images/cover-art/PixelBadgePack.png",
      links: [{ label: "Download on Discord", url: "https://discord.gg/CN4U5kkfTm", color: "blue" }],
      gallery: [
        { url: "/images/pixel-badge/red.png", caption: "Red Badge" },
        { url: "/images/pixel-badge/orange.png", caption: "Orange Badge" },
        { url: "/images/pixel-badge/yellow.png", caption: "Yellow Badge" },
        { url: "/images/pixel-badge/lime.png", caption: "Lime Badge" },
        { url: "/images/pixel-badge/lightgreen.png", caption: "Light Green Badge" },
        { url: "/images/pixel-badge/cyan.png", caption: "Cyan Badge" },
        { url: "/images/pixel-badge/blue.png", caption: "Blue Badge" },
        { url: "/images/pixel-badge/purple.png", caption: "Purple Badge" },
        { url: "/images/pixel-badge/pink.png", caption: "Pink Badge" },
      ],
    },
    {
      icon: "🌐",
      title: "Realm Explorer",
      desc: "A discovery platform for Minecraft Bedrock Realms & Servers. Featuring RE Hub which allows you to join Bedrock servers on console. (I am no longer the owner of this network)",
      tags: ["Python Bot", "Discord Setup", "Discovery Realm Platform"],
      status: "active",
      color: "#4CAF50",
      cover: "/images/cover-art/RealmExplorer.png",
      links: [{ label: "Join the Discord", url: "https://discord.gg/realmexplorer", color: "blue" }],
      gallery: [],
    },
    {
      icon: "💫",
      title: "Realm Transfer",
      desc: "An add-on which transfers players from a Realm to a server, via the @minecraft/server-admin Scripting API. (Mojang has now patched this)",
      tags: ["TypeScript", "Scripting API"],
      status: "archived",
      color: "#fd09f9",
      cover: "/images/cover-art/RealmTransfer.png",
    },
  ],

  // ---------------------------------------------------------------------------
  // Team — leave `members` empty and the section plus its nav link disappear.
  // ---------------------------------------------------------------------------
  team: {
    label: "TEAM",
    heading: "The Crew",
    members: [],
  },

  // ---------------------------------------------------------------------------
  // Services
  // ---------------------------------------------------------------------------
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
  featureFlags: {
    showStoreSection: false,
  },

  // Used for the hero's second button only when the store section is hidden.
  storeHiddenCta: {
    action: "url",
    label: "Join Discord ↩",
    copyText: "ademondiscrd",
    url: "https://discord.gg/CN4U5kkfTm",
  },

  // ---------------------------------------------------------------------------
  // Store
  // ---------------------------------------------------------------------------
  currentlySelling: [
    
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
      { label: "GitHub", url: "https://github.com/AdemonG1tHub", color: "dark" },
      { label: "Website", url: "https://ademdev.xyz", color: "gold" },
      { label: "Join Discord", url: "https://discord.gg/CN4U5kkfTm", color: "blue" },
    ],
  },

  // ---------------------------------------------------------------------------
  // Card chip labels
  // ---------------------------------------------------------------------------
  labels: {
    sellingCardLabel: "STORE ITEM",
    projectCardLabel: "PROJECT",
  },
};
