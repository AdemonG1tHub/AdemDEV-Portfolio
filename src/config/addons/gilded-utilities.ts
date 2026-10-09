import type { AddonPageConfig } from "@/types/addon";
import { GILDED_MENUS } from "./gilded-utilities.menus";

/**
 * Everything on ademdev.xyz/gilded-utilities.
 *
 * The feature list is the page's main content: each entry renders as a tile,
 * and clicking one opens a full "how to use it" panel with steps, commands,
 * required tags and configurable options. `demoMenu` wires a feature to a menu
 * in `gilded-menus.config.ts` so the panel can jump the live viewer straight to
 * the matching screen.
 *
 * The download band takes as many buttons as you want — leave the ones you
 * aren't using commented out rather than deleting them.
 */
export const GILDED_UTILITIES: AddonPageConfig = {
  name: "Gilded Utilities",
  slug: "gilded-utilities",

  // Gold / amber, from the "Gilded" name and the existing gold button skins.
  theme: {
    accent: "#f5c542",
    accentBright: "#ffd97a",
    accentSoft: "#f0c060",
    accentLight: "#ffd766",
    accentDeep: "#d99a20",
    accentLine: "#a8741a",
    accentInk: "#9a6a05",
    accentLink: "#ffd97a",
    surface: "#2b2a27",
    surfaceAlt: "#34322e",
    surfaceDark: "#232220",
    surfaceCard: "#24231f",
    line: "#524d43",
    lineSoft: "#6a6355",
    themeColor: "#f5c542",
  },

  tagline: "Server management for Minecraft Bedrock",
  subtitle:
    "A free, open-source utility add-on for Realms, dedicated servers and local worlds. Warps, homes, mailbox, redeem codes, a chest-UI shop, custom ranks and a full admin panel — all configurable in game, no config files to edit.",
  version: "v0.1.0-beta",
  minEngineVersion: "1.26.0",
  heroBackground: "/images/crosshair_backgrounds/22.webp",

  heroLinks: [
    { label: "Explore Features", url: "#features", color: "gold" },
    { label: "Try the Live Menu", url: "#preview", color: "neutral" },
  ],

  // ---------------------------------------------------------------------------
  // Download band
  // ---------------------------------------------------------------------------
  download: {
    heading: "Get Gilded Utilities",
    note: "Drop the .mcaddon onto Minecraft to import it, then run /gilded:setup in your world. Requires Minecraft Bedrock 1.26.0 or newer with the Beta APIs experiment enabled.",
    fileName: "gildedutils.mcaddon",
    buttons: [
      {
        label: "Download .mcaddon",
        url: "https://github.com/GildedStudios/Gilded-Utilities/releases/latest",
        color: "gold",
      },
      { label: "Join the Discord", url: "https://discord.gg/CN4U5kkfTm", color: "blue" },
      {
        label: "Source on GitHub",
        url: "https://github.com/GildedStudios/Gilded-Utilities",
        color: "neutral",
      },
    ],
  },

  stats: [
    { num: "Free", label: "and open source" },
    { num: "11", label: "Feature modules" },
    { num: "5", label: "Custom commands" },
    { num: "1.26+", label: "Bedrock engine" },
  ],

  // ---------------------------------------------------------------------------
  // Features — click a tile to open the walkthrough.
  // ---------------------------------------------------------------------------
  features: [
    {
      id: "setup",
      name: "Setup Wizard",
      icon: "/gilded/icons/settings.png",
      summary: "One form configures the whole add-on. No config files, no reloads.",
      tags: ["First run", "Admin"],
      status: "stable",
      overview:
        "Gilded Utilities refuses to open any menu until setup is complete — until then every player sees an action-bar prompt instead. The wizard is a single ModalFormData that writes a server config into a world dynamic property, so it survives restarts and needs no pack edits.",
      steps: [
        {
          title: "Grant yourself setup access",
          text: "The wizard is gated behind a tag so a random operator can't reconfigure your server. Run this on yourself once.",
          code: "/tag @s add gildedutils.setup",
        },
        {
          title: "Open the wizard",
          text: "Run the setup command. If you skip this, the add-on keeps nagging every player through the action bar once per second.",
          code: "/gilded:setup",
        },
        {
          title: "Fill in the required fields",
          text: "Server Name and Main Menu Item are both required — leave either blank and the form reopens. The menu item is the item players hold and use to open the menu, e.g. minecraft:compass.",
        },
        {
          title: "Set the optional limits",
          text: "Max homes per player (1-10), whether the shop button shows at all, the currency label and its scoreboard objective, and a shop tax between 0 and 25%.",
        },
        {
          title: "Submit",
          text: "Saving marks setup complete and automatically grants you the admin tag, so /gilded:admin works right away. Start over at any point with the reset command.",
          code: "/gilded:resetsetup",
        },
      ],
      commands: [
        { command: "/gilded:setup", desc: "Opens the setup wizard.", permission: "Admin + gildedutils.setup tag" },
        { command: "/gilded:resetsetup", desc: "Wipes the server config back to defaults.", permission: "Admin + gildedutils.setup tag" },
      ],
      requires: ["gildedutils.setup tag"],
      options: [
        { name: "Server Name", desc: "Shown as the main menu title and in the welcome line." },
        { name: "Main Menu Item", desc: "Item type ID that opens the menu on use. Default minecraft:compass." },
        { name: "Max homes per player", desc: "1-10. Enforced when a player tries to set a new home." },
        { name: "Enable shop button", desc: "Hides the Server Shop tile when off." },
        { name: "Shop currency label / objective", desc: "Display name and the scoreboard objective balances are read from." },
        { name: "Shop tax (%)", desc: "0-25. Added to buy prices and deducted from sell payouts." },
      ],
      demoMenu: "setup",
    },
    {
      id: "main-menu",
      name: "Main Menu",
      icon: "/gilded/icons/shop.png",
      summary: "A tiled hub reachable from a held item or a slash command.",
      tags: ["Players", "UI"],
      status: "stable",
      overview:
        "The hub every other feature hangs off. It is an ActionFormData drawn through a custom JSON UI that turns the usual button list into an icon grid. Buttons appear based on your config and your tags — the Admin Page tile only renders for players holding the admin tag.",
      steps: [
        {
          title: "Open it with the menu item",
          text: "Hold the item you picked during setup and use it. The itemUse handler fires before the item is consumed, so it works with a compass without any side effects.",
        },
        {
          title: "Or use the command",
          text: "Anyone can run this, no permissions required.",
          code: "/gilded:menu",
        },
        {
          title: "Pick a module",
          text: "Warps, Homes, Mailbox, Redeem Code and Server Shop are always available. Admin Page is appended only when you hold the admin tag.",
        },
      ],
      commands: [{ command: "/gilded:menu", desc: "Opens the main menu.", permission: "Any" }],
      options: [
        { name: "Main Menu Item", desc: "Change it any time from the admin panel's server settings." },
        { name: "Show Shop button", desc: "Toggled in server settings." },
      ],
      demoMenu: "main",
    },
    {
      id: "warps",
      name: "Warps",
      icon: "/gilded/icons/set_bounty.png",
      summary: "Server-wide teleport points that admins create and everyone uses.",
      tags: ["Players", "Admin"],
      status: "stable",
      overview:
        "Warps are global: an admin sets one, every player sees it. Each warp stores its exact position, dimension, yaw and pitch, so arriving players face the same way the admin did when they created it.",
      steps: [
        {
          title: "Stand where the warp should go",
          text: "Position and look direction are both captured, so line yourself up first.",
        },
        {
          title: "Open Warps and press Set Warp Here",
          text: "Admin-only. The button doesn't render for regular players — they only see the warp list.",
        },
        {
          title: "Name it",
          text: "Names are case-insensitive. Reusing an existing name overwrites that warp rather than creating a duplicate.",
        },
        {
          title: "Players teleport by tapping a warp",
          text: "The list is sorted alphabetically and shows as 'Warp: name'. Teleports are logged under WARP_TELEPORT.",
        },
        {
          title: "Remove one with Delete Warp",
          text: "Admin-only, and it asks which warp before removing anything.",
        },
      ],
      requires: ["gildedutils.admin tag (to create or delete)"],
      options: [{ name: "Warp name", desc: "Trimmed, and matched case-insensitively against existing warps." }],
      demoMenu: "warps",
    },
    {
      id: "homes",
      name: "Homes",
      icon: "/gilded/icons/castle.png",
      summary: "Personal teleport points, capped per player.",
      tags: ["Players"],
      status: "stable",
      overview:
        "Homes work like warps but are stored per player ID and are private. The cap comes from your server config, so raising it later immediately lets everyone save more without touching their existing homes.",
      steps: [
        { title: "Open Homes from the main menu", text: "The body line shows your current count against the server cap, e.g. 'Homes: 1/3'." },
        {
          title: "Stand where you want the home and press Set Home Here",
          text: "Like warps, position, dimension and rotation are all stored.",
        },
        {
          title: "Name it",
          text: "Reusing a name updates that home in place. Hitting the cap with a brand-new name is rejected with a chat message.",
        },
        { title: "Tap a home to travel", text: "Homes are listed alphabetically as 'Home: name'." },
        { title: "Delete Home removes one", text: "You are asked to confirm which home before anything is removed." },
      ],
      options: [{ name: "Max homes per player", desc: "1-10, set during setup or later in server settings." }],
      demoMenu: "homes",
    },
    {
      id: "mailbox",
      name: "Mailbox",
      icon: "/gilded/icons/closed_chest.png",
      summary: "Send and read messages between players, stored per recipient.",
      tags: ["Players"],
      status: "stable",
      overview:
        "A lightweight inbox. Messages persist in world storage so they survive relogs and restarts, but delivery requires the recipient to be online at the moment of sending — the add-on resolves them from the live player list.",
      steps: [
        { title: "Open Mailbox", text: "The body shows how many messages you're holding." },
        {
          title: "Press Compose Message",
          text: "Fill in the recipient's exact username and your message. Both fields are required.",
        },
        {
          title: "The recipient must be online",
          text: "If they aren't, you get an error and nothing is sent. The recipient gets a chat ping the moment it lands.",
        },
        {
          title: "Read mail from your inbox",
          text: "Each message shows as 'From <sender>'. Up to 20 are listed at once.",
        },
        { title: "Delete when you're done", text: "Open a message and press Delete Message to clear it from your inbox." },
      ],
      options: [{ name: "Inbox display limit", desc: "The list shows the 20 most recent messages." }],
      demoMenu: "mailbox",
    },
    {
      id: "redeem",
      name: "Redeem Codes",
      icon: "/gilded/icons/tag.png",
      summary: "One-per-player codes with a custom reward message.",
      tags: ["Players", "Admin"],
      status: "stable",
      overview:
        "Codes are created by admins and claimed once per player. Claims are tracked by player ID, so relogging or changing your name doesn't let you claim twice.",
      steps: [
        {
          title: "Create a code",
          text: "Admin panel → Manage Redeem Codes → Manage Codes. Enter the code and the reward message players see. Codes are normalised to uppercase.",
        },
        {
          title: "Share it with your players",
          text: "Anything works — Discord, a sign at spawn, a launch announcement.",
        },
        {
          title: "Players redeem from the main menu",
          text: "Main menu → Redeem Code, type it in, submit. Entry is case-insensitive.",
        },
        {
          title: "Reward delivery is yours to wire",
          text: "Redeeming shows the reward message and logs CODE_REDEEM. Hook your own item or command grant onto that message for anything beyond text.",
        },
        { title: "Delete codes when a promo ends", text: "The code manager lists every code with a delete button beside it." },
      ],
      requires: ["gildedutils.admin tag (to create or delete)"],
      options: [
        { name: "Code", desc: "Stored uppercase and trimmed." },
        { name: "Reward message", desc: "Shown to the player on a successful claim." },
      ],
      demoMenu: "redeem",
    },
    {
      id: "shop",
      name: "Server Shop",
      icon: "/gilded/icons/money.png",
      summary: "A chest-UI shop with buying, selling and a configurable tax.",
      tags: ["Players", "Admin", "Economy"],
      status: "stable",
      overview:
        "A double chest UI listing up to 45 items, with balances read from a scoreboard objective you choose. Buy prices have the tax added; sell payouts have it deducted. Every transaction is logged.",
      steps: [
        {
          title: "Create the currency objective",
          text: "The shop reads balances from a scoreboard objective. Create it once, then set the same name in shop settings.",
          code: "/scoreboard objectives add money dummy Coins",
        },
        {
          title: "Add items",
          text: "Shop → Admin: Manage Shop → Manage Items. Give an ID key, display name, Minecraft item type, how many the player receives, and a base price.",
        },
        {
          title: "Optionally make an item sellable",
          text: "Flip the sell toggle on the item and set a per-unit sell price. Then enable selling globally in shop settings.",
        },
        {
          title: "Players buy from the grid",
          text: "Tapping an item opens a quantity slider (1-64). The total is the taxed unit price times the quantity; insufficient funds are rejected before anything is given.",
        },
        {
          title: "Players sell from the Sell Items slot",
          text: "The sell grid shows how many of each item they're carrying and the after-tax payout per unit.",
        },
      ],
      requires: ["A scoreboard objective for currency", "gildedutils.admin tag (to manage)"],
      options: [
        { name: "Currency label", desc: "Display name shown next to amounts, e.g. Coins." },
        { name: "Scoreboard objective", desc: "Where balances are read and written." },
        { name: "Tax (%)", desc: "0-25. Added on buy, deducted on sell." },
        { name: "Enable selling", desc: "Shows or hides the Sell Items slot." },
      ],
      demoMenu: "shop",
    },
    {
      id: "ranks",
      name: "Ranks",
      icon: "/gilded/icons/star.png",
      summary: "Custom chat prefixes and nametags with colours, formatting and priority.",
      tags: ["Admin", "Chat"],
      status: "stable",
      overview:
        "Ranks are tags under a ranks: prefix. Everyone gets member automatically, and admin is granted or revoked to match the admin tag. When a player holds several, the highest priority wins and becomes their chat prefix and nametag. A background task refreshes this every half second.",
      steps: [
        {
          title: "Open the rank manager",
          text: "Admin panel → Manage Ranks. Member and Admin ship by default and can be edited but not deleted.",
        },
        {
          title: "Create a rank",
          text: "Give it an ID, a display prefix and a numeric priority. Higher priority wins when a player holds more than one.",
        },
        {
          title: "Pick a colour and formatting",
          text: "21 colours including the Bedrock material codes (Minecoin, Amethyst, Resin), plus bold, italic and obfuscated.",
        },
        {
          title: "Or override with a custom label",
          text: "Filling in Custom Label ignores the colour and formatting dropdowns entirely — write your own § codes for full control.",
        },
        {
          title: "Assign it",
          text: "Assign Rank to Player, choose the rank, then type an online player's name. Or add the tag by hand.",
          code: "/tag @p add ranks:vip",
        },
      ],
      requires: ["gildedutils.admin tag"],
      options: [
        { name: "Rank ID", desc: "The tag suffix, e.g. vip becomes ranks:vip." },
        { name: "Priority", desc: "Highest wins. Member is 0, Admin is 100." },
        { name: "Custom Label", desc: "Overrides colour and formatting when set." },
      ],
      demoMenu: "admin.ranks",
    },
    {
      id: "admin",
      name: "Admin Panel",
      icon: "/gilded/icons/sword.png",
      summary: "Every setting the add-on has, reachable in game.",
      tags: ["Admin"],
      status: "stable",
      overview:
        "The control room. Server settings, redeem codes, shop management, ranks and logs all live behind one command, gated on the admin tag. Opening it is itself logged.",
      steps: [
        {
          title: "Grant the admin tag",
          text: "Completing setup grants this automatically. Add it to anyone else by hand.",
          code: "/tag @p add gildedutils.admin",
        },
        { title: "Open the panel", text: "Either from the main menu's Admin Page tile or directly.", code: "/gilded:admin" },
        {
          title: "Server Settings",
          text: "Rename the server, change the home cap, toggle the shop button and adjust the currency and tax without leaving the world.",
        },
        { title: "The other four sections", text: "Redeem codes, shop items and settings, the rank manager, and the log viewer." },
      ],
      commands: [{ command: "/gilded:admin", desc: "Opens the admin panel.", permission: "Admin + gildedutils.admin tag" }],
      requires: ["gildedutils.admin tag"],
      demoMenu: "admin",
    },
    {
      id: "logs",
      name: "Activity Logs",
      icon: "/gilded/icons/billboard.png",
      summary: "Twelve filterable categories of everything the add-on did.",
      tags: ["Admin", "Audit"],
      status: "stable",
      overview:
        "Every meaningful action writes a log entry with a level, a type, a message and who did it. The viewer is a small chest UI of filter icons that opens a colour-coded list, so you can answer 'who deleted that warp' without leaving the game.",
      steps: [
        { title: "Open Admin Panel → Logs", text: "You get a chest grid with one icon per log category, plus All Logs." },
        {
          title: "Pick a category",
          text: "Admin panel access, rank updates, shop purchases, shop sells, shop updates, code updates, code redeems, home updates, warp updates, warp teleports, mailbox, and general.",
        },
        {
          title: "Read the entries",
          text: "The 50 most recent are shown newest first, colour-coded by level — green INFO, yellow WARN, red ERROR.",
        },
      ],
      requires: ["gildedutils.admin tag"],
      demoMenu: "admin.logs",
    },
    {
      id: "commands",
      name: "Custom Commands",
      icon: "/gilded/icons/back.png",
      summary: "Five namespaced slash commands registered at world startup.",
      tags: ["Players", "Admin"],
      status: "stable",
      overview:
        "Commands register through the startup event's custom command registry, so they appear in Minecraft's own autocomplete under the gilded: namespace and respect Bedrock's permission levels.",
      steps: [
        { title: "Everyone can open the menu", text: "Permission level Any.", code: "/gilded:menu" },
        { title: "Admins get the panel", text: "Permission level Admin, and still requires the admin tag.", code: "/gilded:admin" },
        { title: "Setup and reset", text: "Both need the setup tag on top of the Admin permission level.", code: "/gilded:setup" },
        { title: "UI examples", text: "A small preview form for testing custom UI. Admin tag required.", code: "/gilded:uiexamples" },
      ],
      commands: [
        { command: "/gilded:menu", desc: "Opens the main menu.", permission: "Any" },
        { command: "/gilded:admin", desc: "Opens the admin panel.", permission: "Admin" },
        { command: "/gilded:setup", desc: "Runs the setup wizard.", permission: "Admin" },
        { command: "/gilded:resetsetup", desc: "Resets the server config.", permission: "Admin" },
        { command: "/gilded:uiexamples", desc: "Opens the UI example form.", permission: "Any + admin tag" },
      ],
    },
    {
      id: "storage",
      name: "World Storage",
      icon: "/gilded/icons/open_chest.png",
      summary: "Everything persists in world dynamic properties. No external database.",
      tags: ["Technical"],
      status: "stable",
      overview:
        "All state — config, warps, homes, mailboxes, codes, shop items, ranks and logs — is written as JSON into world dynamic properties under gildedutils: keys. Reads and writes are wrapped so a runtime without dynamic properties degrades to defaults instead of throwing.",
      steps: [
        {
          title: "Nothing to install",
          text: "No server, no database, no external host. The data travels with the world file, so it works on a Realm exactly as it does locally.",
        },
        {
          title: "Back up by copying the world",
          text: "Because the state lives in the world, your normal world backup already covers it.",
        },
        {
          title: "Start fresh with a reset",
          text: "Resets the server config back to defaults. Warps, homes and other stores are untouched.",
          code: "/gilded:resetsetup",
        },
      ],
      options: [
        { name: "gildedutils:server_config", desc: "Server name, menu item, feature flags, shop and home settings." },
        { name: "gildedutils:warps / :homes", desc: "Global warp list and per-player home lists." },
        { name: "gildedutils:mailbox / :redeem", desc: "Inboxes keyed by player ID, and codes with their claim list." },
        { name: "gildedutils:shop / :custom_ranks / :logs", desc: "Shop items, custom ranks and the activity log." },
      ],
    },
  ],

  viewer: GILDED_MENUS,

  footer: {
    tagLine: "Gilded Utilities is not affiliated with Mojang Studios.",
  },
};
