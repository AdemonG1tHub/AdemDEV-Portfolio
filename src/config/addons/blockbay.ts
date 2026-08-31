import type { AddonPageConfig } from "@/types/addon";
import { BLOCKBAY_MENUS } from "./blockbay.menus";

/**
 * Everything on ademdev.xyz/blockbay.
 *
 * Same shape as `gilded-utilities.ts` — see that file for the field reference.
 * Feature icons here are emoji rather than image paths because Block-Bay's
 * resource pack ships UI textures only; it uses vanilla item icons in game.
 */
export const BLOCKBAY: AddonPageConfig = {
  name: "Block-Bay",
  slug: "blockbay",

  // Straight from the add-on's own container texture: the green frame in
  // dialog_background_opaque1.png runs #6DF06C -> #40D140.
  theme: {
    accent: "#40d140",
    accentBright: "#6df06c",
    accentSoft: "#59df58",
    accentLight: "#64e563",
    accentDeep: "#2ba52b",
    accentLine: "#1d7a1d",
    accentInk: "#12660f",
    accentLink: "#6df06c",
    surface: "#232725",
    surfaceAlt: "#2b302d",
    surfaceDark: "#1c201e",
    surfaceCard: "#1f2321",
    line: "#414a44",
    lineSoft: "#556059",
    themeColor: "#40d140",
  },

  tagline: "A player marketplace for Minecraft Bedrock",
  subtitle:
    "eBay, rebuilt inside Minecraft Bedrock. Players list their own items — enchantments, custom names and lore intact — and buy from everyone else through a custom-textured chest UI. Sellers get paid even while they're offline.",
  version: "v0.1.0-alpha",
  minEngineVersion: "1.26.0",
  heroBackground: "/images/crosshair_backgrounds/13.webp",

  heroLinks: [
    { label: "Explore Features", url: "#features", color: "green" },
    { label: "Try the Live Menu", url: "#preview", color: "dark" },
  ],

  // ---------------------------------------------------------------------------
  // Download band — swap or remove buttons as the distribution route firms up.
  // ---------------------------------------------------------------------------
  download: {
    heading: "Get Block-Bay (coming soon)",
    note: "Import the .mcaddon, enable both packs on your world, then have an operator run /blockbay:setup once. Requires Minecraft Bedrock 26.0 or newer with the Beta APIs experiment enabled.",
    fileName: "blockbay.mcaddon",
    buttons: [
      { label: "Follow the Development", url: "https://discord.gg/CN4U5kkfTm", color: "blue" },
    ],
  },

  stats: [
    { num: "120", label: "Listing slots" },
    { num: "15", label: "Per player" },
    { num: "7", label: "Custom commands" },
    { num: "1.26.0+", label: "Bedrock engine" },
  ],

  // ---------------------------------------------------------------------------
  // Features
  // ---------------------------------------------------------------------------
  demoButtonColor: "green",

  features: [
    {
      id: "setup",
      name: "Setup Wizard",
      icon: "⚙️",
      summary: "One field: pick the scoreboard Block-Bay uses as money.",
      tags: ["First run", "Operator"],
      status: "stable",
      overview:
        "Block-Bay refuses to open any menu until an operator has run setup, so it can never trade against the wrong scoreboard. The wizard writes a single world config and creates the objective for you if it doesn't exist yet.",
      steps: [
        {
          title: "Run the wizard as an operator",
          text: "Non-operators are refused. It is the only gate on the whole add-on.",
          code: "/blockbay:setup",
        },
        {
          title: "Name your money scoreboard",
          text: "Defaults to blockbucks. Letters, numbers, dots, dashes and underscores only, up to 16 characters — anything else is rejected rather than silently mangled.",
        },
        {
          title: "The objective is created automatically",
          text: "On world load Block-Bay ensures the objective exists, so you don't have to add it by hand. Point it at an existing economy objective and it will use that instead.",
          code: "/scoreboard objectives add blockbucks dummy",
        },
        {
          title: "Re-run it any time",
          text: "Running setup again just updates the config. Existing listings and balances are untouched.",
        },
      ],
      commands: [
        { command: "/blockbay:setup", desc: "Runs the setup wizard.", permission: "Operator" },
      ],
      requires: ["Operator permission level"],
      options: [
        { name: "Money Scoreboard", desc: "Objective used for every balance, price and payout. Default blockbucks." },
      ],
      demoMenu: "setup",
    },
    {
      id: "shop",
      name: "The Marketplace",
      icon: "🏪",
      summary: "A chest-UI hub: balance, buy, your listings, sell.",
      tags: ["Players", "UI"],
      status: "stable",
      overview:
        "The hub every player starts from. It is a 27-slot chest form dressed in Block-Bay's own dark container texture, with gray glass panes framing four controls and a live balance readout.",
      steps: [
        { title: "Open the shop", text: "Any player can run this — no permissions, no items to hold.", code: "/blockbay:shop" },
        {
          title: "Check your balance",
          text: "The gold ingot in the top row shows your balance, plus anything still pending from sales made while you were offline.",
        },
        {
          title: "Pick a direction",
          text: "Buy Items browses everything on the market, My Listings manages what you're selling, and Sell Items lists something new.",
        },
      ],
      commands: [{ command: "/blockbay:shop", desc: "Opens the marketplace hub.", permission: "Any" }],
      demoMenu: "shop",
    },
    {
      id: "buying",
      name: "Buying",
      icon: "📦",
      summary: "Paged grid of every listing, with a confirmation step.",
      tags: ["Players", "Economy"],
      status: "stable",
      overview:
        "45 listings per page across a double chest, with arrows appearing only when there is somewhere to go. Every purchase passes through a confirm screen showing the cost and what your balance will be afterwards.",
      steps: [
        { title: "Open Buy Items from the hub", text: "The page counter in the title shows where you are, e.g. (1/3)." },
        {
          title: "Hover to inspect",
          text: "Each item's tooltip carries its price, amount, seller, and any enchantments or custom lore it was listed with.",
        },
        {
          title: "Click to confirm",
          text: "The confirm screen previews the item alongside the cost and your balance after the purchase. Nothing is charged until you press Buy.",
        },
        {
          title: "Everything is checked before money moves",
          text: "You can't buy your own listing, buy without inventory space, or buy what you can't afford. If delivery fails at the last step you are refunded and the listing is restored.",
        },
      ],
      requires: ["Enough balance", "A free inventory slot"],
      demoMenu: "buy",
    },
    {
      id: "selling",
      name: "Selling",
      icon: "🏷️",
      summary: "List straight from your inventory, priced how you like.",
      tags: ["Players", "Economy"],
      status: "stable",
      overview:
        "The sell screen mirrors your real inventory into the chest UI — main slots on top, hotbar below — so you list by clicking the item you already hold. Items that can't be safely listed are greyed out with the reason.",
      steps: [
        { title: "Open Sell Items", text: "Your inventory is drawn into the top four rows, in the layout you already know." },
        {
          title: "Click the item to list",
          text: "The footer shows how many of your listing slots are used. Greyed-out items can't be listed and say why.",
        },
        {
          title: "Set amount and price",
          text: "Stacks get an amount slider; single items skip it. Price is the total for the whole listing, from 1 to 1,000,000.",
        },
        {
          title: "The item leaves your inventory",
          text: "It is held by the market until it sells or you take it back. If saving the listing fails, nothing is taken.",
        },
      ],
      requires: ["A listable item", "Fewer than 15 active listings"],
      options: [
        { name: "Amount", desc: "1 to the size of the stack you clicked." },
        { name: "Total price", desc: "Whole number, 1 to 1,000,000, for the entire listing." },
      ],
      demoMenu: "sell",
    },
    {
      id: "listings",
      name: "Your Listings",
      icon: "📘",
      summary: "See what you have on the market and pull it back.",
      tags: ["Players"],
      status: "stable",
      overview:
        "The same paged grid as the buy screen, filtered to your own listings, with a confirm step before anything is returned. Capped at 15 per player so no one can wall off the market.",
      steps: [
        { title: "Open My Listings", text: "From the hub, or jump straight there with the command.", code: "/blockbay:listings" },
        { title: "Click a listing", text: "Take Back returns it to your inventory; Keep Listed backs out." },
        {
          title: "Make room first",
          text: "Cancelling needs a free inventory slot. If the return fails the listing is put straight back, so an item can never vanish.",
        },
      ],
      commands: [{ command: "/blockbay:listings", desc: "Opens your listings.", permission: "Any" }],
      options: [
        { name: "Per-player cap", desc: "15 active listings." },
        { name: "Market cap", desc: "120 listings in total across the server." },
      ],
      demoMenu: "listings",
    },
    {
      id: "items",
      name: "Item Fidelity",
      icon: "✨",
      summary: "Enchantments, custom names and lore survive the round trip.",
      tags: ["Technical"],
      status: "stable",
      overview:
        "A listing stores far more than an item ID. Names, lore lines and every enchantment with its level are recorded when the item is listed and rebuilt when it is bought or reclaimed — so an enchanted sword is still that exact sword on the other side.",
      steps: [
        {
          title: "Listing captures the details",
          text: "Custom name tag, lore lines and the full enchantment list are read off the stack and stored with the listing.",
        },
        {
          title: "Tooltips show them",
          text: "Enchantments render in blue and lore in dark grey underneath the price, amount and seller, so buyers see what they're paying for.",
        },
        {
          title: "Rebuilt on delivery",
          text: "Buying or reclaiming reconstructs the stack with everything reapplied. Enchantments the world no longer recognises are skipped rather than failing the trade.",
        },
        {
          title: "Containers are blocked",
          text: "Bundles and shulker boxes can't be listed — they can hold items that the listing format wouldn't preserve, so they'd be lost.",
        },
      ],
      demoMenu: "buy",
    },
    {
      id: "payouts",
      name: "Offline Payouts",
      icon: "💰",
      summary: "Sell while you sleep — the money is waiting when you log in.",
      tags: ["Economy"],
      status: "stable",
      overview:
        "A scoreboard can only be written for an online player, so a sale to an offline seller queues the amount instead. The next time they join, it is paid out and they're told how much they earned.",
      steps: [
        { title: "Someone buys your listing", text: "If you're online the money lands immediately." },
        {
          title: "If you're offline it queues",
          text: "The amount is added to your pending balance in world storage rather than being dropped.",
        },
        {
          title: "Paid on your next join",
          text: "You get a message on spawn: \"You earned 12000 from Block-Bay sales while you were away.\"",
        },
        {
          title: "Check pending any time",
          text: "The hub's balance tooltip and the balance command both show what's still owed to you.",
          code: "/blockbay:balance",
        },
      ],
      demoMenu: "shop",
    },
    {
      id: "money",
      name: "Money Commands",
      icon: "🪙",
      summary: "Check balances, and grant or take money as an operator.",
      tags: ["Players", "Admin"],
      status: "stable",
      overview:
        "Balances live on the scoreboard objective you chose at setup, so any economy add-on writing to the same objective stays in sync. Operators can adjust balances directly, and every change notifies the player.",
      steps: [
        { title: "Check your own balance", text: "Shows pending payouts alongside it when you have any.", code: "/blockbay:balance" },
        {
          title: "Check someone else's",
          text: "Operator only. Accepts a player selector, so it works across several players at once.",
          code: "/blockbay:balance @a",
        },
        {
          title: "Grant money",
          text: "Whole numbers of at least 1. Each target is told what changed and what their new balance is.",
          code: "/blockbay:addmoney @p 5000",
        },
        { title: "Take money", text: "Same rules; balances are floored at zero.", code: "/blockbay:removemoney @p 500" },
      ],
      commands: [
        { command: "/blockbay:balance [target]", desc: "Your balance, or another player's.", permission: "Any / Operator" },
        { command: "/blockbay:addmoney <target> <amount>", desc: "Adds to a balance.", permission: "Admin" },
        { command: "/blockbay:removemoney <target> <amount>", desc: "Removes from a balance.", permission: "Admin" },
      ],
      requires: ["Operator permission level for other players"],
    },
    {
      id: "calibration",
      name: "Icon Calibration",
      icon: "🎯",
      summary: "Keeps item icons correct alongside other add-ons.",
      tags: ["Operator", "Technical"],
      status: "stable",
      overview:
        "Chest UIs address item icons by network ID, and any add-on that adds custom items shifts those IDs. Calibration finds the offset for your pack stack so Block-Bay keeps drawing the right icon for every item.",
      steps: [
        { title: "Open the calibration screen", text: "Operator only.", code: "/blockbay:calibrate" },
        {
          title: "Compare against the reference row",
          text: "Sixteen known vanilla items are drawn with their expected IDs. If the icons match their labels, your offset is right.",
        },
        {
          title: "Nudge the offset until it lines up",
          text: "Step by one or five in either direction, scan, or reset to zero. The preview updates as you go.",
        },
        { title: "Save", text: "The offset is stored in world data and reapplied on every world load." },
      ],
      commands: [
        { command: "/blockbay:calibrate", desc: "Opens icon calibration.", permission: "Operator" },
      ],
      requires: ["Operator permission level"],
      options: [{ name: "Custom item offset", desc: "0 to 512. Applied at world load." }],
    },
    {
      id: "storage",
      name: "World Storage",
      icon: "💾",
      summary: "Listings and payouts live in the world. No server needed.",
      tags: ["Technical"],
      status: "stable",
      overview:
        "Every listing, pending payout and setting is JSON in world dynamic properties under blockbay: keys. Nothing external to host, and reads that hit corrupt data are ignored rather than taking the add-on down.",
      steps: [
        {
          title: "Nothing to install",
          text: "No database, no web service. Works the same on a Realm, a dedicated server or a local world.",
        },
        { title: "Backed up with your world", text: "Copying the world copies the entire market with it." },
        {
          title: "Failures are contained",
          text: "Unreadable data is logged and skipped, and every trade rolls back on failure so items and money can't be lost.",
        },
      ],
      options: [
        { name: "blockbay:shopItems", desc: "Every active listing, keyed by listing ID." },
        { name: "blockbay:pendingPayouts", desc: "Money owed to offline sellers." },
        { name: "blockbay:config", desc: "The money scoreboard name." },
        { name: "blockbay:customItemOffset", desc: "Saved icon calibration offset." },
      ],
    },
  ],

  viewer: BLOCKBAY_MENUS,

  footer: {
    tagLine: "Block-Bay is not affiliated with Mojang Studios or eBay Inc.",
  },
};
