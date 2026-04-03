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
      links: [],
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
      id: "sample-1",
      title: "Custom Minecraft Skin Pack",
      price: "$5",
      images: [
        { url: "https://i.imgur.com/8Km9tLL.jpg", caption: "Example skin 1" },
        { url: "https://i.imgur.com/6oKX4Wm.jpg", caption: "Example skin 2" }
      ],
      tags: ["skin", "minecraft", "download"],
      // Put your markdown here. It will be rendered in the preview.
      md: `# Skin Pack\n\nA set of 10 custom skins themed around fantasy rogues and mages.\n\n- High quality PNGs\n- Compatible with Bedrock & Java\n- Delivery via zip + install instructions\n\n**Includes:** 10 skins, usage license, install guide.\n\nWant changes? Reply and I can make small edits for free.`,
      links: [{ label: "Buy via PayPal", url: "https://paypal.me/ademdev" }]
    }
  ]
};
