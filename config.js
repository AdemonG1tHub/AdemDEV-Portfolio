const CONFIG = {
  name: "AdemDEV",
  tagline: "Minecraft & Discord Development",
  subtitle: "A developer specialising in MC Bedrock Scripting, Discord bots, and Endstone Plugins. Creating new projects every month.",
  email: "contact@ademdev.xyz",
  github: "https://github.com/AdemonG1tHub",
  discord: "ademondiscrd",
  stats: [
    { num: "3+", label: "Years of Experience" },
    { num: "5+", label: "Projects Built" },
    { num: "Owner", label: "of Realm Explorer" },
    { num: "Intermediate", label: "Developer" },
  ],
  skills: [
    "TypeScript", "Python", "Node.js", "Discord.js/py",
    "Bedrock Scripting API", "Endstone Plugins", "GitHub Apps",
    "HTML / CSS",
  ],
  projects: [
    {
      icon: "🌌", title: "AstralCraft Engine",
      desc: "Full-featured Minecraft Bedrock server engine — RPG levelling, factions, quest system, custom shop menu, NPC handlers, sidebar HUD, and Discord embed integration.",
      tags: ["TypeScript", "Python", "Endstone", "Discord.js"],
      status: "active", color: "#29B6F6",
      links: [{ label: "Join the Discord", url: "https://discord.gg/astralcraft" }],
      gallery: [],
    },
    {
      icon: "🌐", title: "Realm Explorer",
      desc: "A discovery platform for Minecraft Bedrock Realms & Servers. Featuring RE Hub which allows you to join Bedrock servers on console.",
      tags: ["Scripting API", "Discord"],
      status: "active", color: "#4CAF50",
      links: [{ label: "Join the Discord", url: "https://discord.gg/realmexplorer" }],
      gallery: [],
    },
    {
      icon: "⚔️", title: "Endrod Utilities",
      desc: "An open-sourced server / realm management tool for Minecraft Bedrock. Featuring Homes, Warps, Player Stats, and more planned.",
      tags: ["TypeScript", "JSON UI"],
      status: "wip", color: "#F5C518",
      links: [],
      gallery: [],
    },
    {
      icon: "📬", title: "Dev / Owner @ CrabSMP",
      desc: "CrabSMP is a Lifesteal survival server, where the goal is to essentially slay bosses, get rich, and become the best player!",
      tags: ["Python", "TypeScript", "JSON UI", "Discord"],
      status: "active", color: "#FF7043",
      links: [{ label: "Visit Website", url: "https://crabsmp.net" }, { label: "Join Discord", url: "https://discord.gg/crabsmp" }],
      gallery: [],
    },
    {
      icon: "🐍", title: "Embed Creator",
      desc: "A python script that lets you create custom Discord embeds with a live preview, and copy the resulting JSON to clipboard.",
      tags: ["Python", "discord.py"],
      status: "wip", color: "#9E9E9E",
      links: [],
      gallery: [],
    },
  ],
  services: [
    { icon: "🎮", name: "Minecraft Developer", desc: "Custom Bedrock scripting with TypeScript & Endstone. Quest systems, GUI menus, RPG mechanics, shop systems, and more." },
    { icon: "🤖", name: "Discord Bot Developer", desc: "Feature-rich bots with slash commands, admin panels, Minecraft integrations, and persistent data storage." },
    { icon: "🔧", name: "Server Infrastructure", desc: "CI/CD pipelines, GitHub Actions, SFTP deployment, Pterodactyl panel management, and process automation." },
    { icon: "🌐", name: "Web Development", desc: "Clean, functional websites and tools — full-stack JS/TS with Node.js backends and modern frontends." },
  ],

  // ── Currently Selling: paste markdown into the `md` field for each item
  currentlySelling: [
    {
      id: "astral-engine",
      title: "AstralCraft Engine",
      price: "$50 USD",
      cover: "images/astral-engine1.png",
      images: [
        { url: "images/astral-engine1.png", caption: "Screenshot 1" },
        { url: "images/astral-engine2.png", caption: "Screenshot 2" },
        { url: "images/astral-engine3.png", caption: "Screenshot 3" },
        { url: "images/astral-engine4.png", caption: "Screenshot 4" },
        { url: "images/astral-engine5.png", caption: "Screenshot 5" },
        { url: "images/astral-engine6.png", caption: "Screenshot 6" },
        { url: "images/astral-engine7.png", caption: "Screenshot 7" },
        { url: "images/astral-engine8.png", caption: "Screenshot 8" },
        { url: "images/astral-engine9.png", caption: "Screenshot 9" },
        { url: "images/astral-engine10.png", caption: "Screenshot 10" },
        { url: "images/astral-engine11.png", caption: "Screenshot 11" },
        { url: "images/astral-engine12.png", caption: "Screenshot 12" },
        { url: "images/astral-engine13.png", caption: "Screenshot 13" },
        { url: "images/astral-engine14.png", caption: "Screenshot 14" },
        { url: "images/astral-engine15.png", caption: "Screenshot 15" },
        { url: "images/astral-engine16.png", caption: "Screenshot 16" },
        { url: "images/astral-engine17.png", caption: "Screenshot 17" },
        { url: "images/astral-engine18.png", caption: "Screenshot 18" },
        { url: "images/astral-engine19.png", caption: "Screenshot 19" },
        { url: "images/astral-engine20.png", caption: "Screenshot 20" },
        { url: "images/astral-engine21.png", caption: "Screenshot 21" },
        { url: "images/astral-engine22.png", caption: "Screenshot 22" },
        { url: "images/astral-engine23.png", caption: "Screenshot 23" },
        { url: "images/astral-engine24.png", caption: "Screenshot 24" }
      ],
      tags: ["engine", "minecraft", "download"],
      // Markdown content for the item. Inlined so it displays without network requests.
      md: `# AstralCraft Engine

    A full-featured Minecraft Bedrock server engine with RPG levelling, factions, quest system, custom shop menu, NPC handlers, sidebar HUD, and Discord embed integration.

    - High quality code
    - Compatible with Bedrock & Java
    - Delivery via zip + install instructions

    **Includes:** Engine files, usage license, install guide.

    Want changes? Reply and I can make small edits for free.`,
      links: [{ label: "Buy via PayPal", url: "https://paypal.me/ademdev" }]
    }
  ]
};
