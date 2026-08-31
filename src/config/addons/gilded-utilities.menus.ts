import type { MenuViewerConfig } from "@/types/addon";

/**
 * ============================================================================
 *  LIVE MENU VIEWER — this is the file you edit.
 * ============================================================================
 *
 * Everything the visitor clicks through in the "Live Menu Preview" section is
 * defined here. Add a menu, point a button at it with `opens`, done — no code
 * changes anywhere else.
 *
 * ── The four layouts ────────────────────────────────────────────────────────
 *
 *   kind: "action-grid"   ActionFormData drawn as tiles (icon above a caption,
 *                         `columns` per row). The main menu uses this.
 *   kind: "action-list"   ActionFormData drawn as full-width rows with a
 *                         standalone icon to the left. Every other Action form.
 *   kind: "chest"         ChestFormData. 9 slots per row; `size: 54` is the
 *                         "double" chest. Items get hover tooltips.
 *   kind: "modal"         ModalFormData. textField / toggle / slider / dropdown
 *                         plus a Submit button.
 *
 * ── Wiring buttons ──────────────────────────────────────────────────────────
 *
 *   opens: "menu-id"      Clicking navigates to that menu.
 *   note:  "§aSaved."     Clicking shows a chat-style line instead (used for
 *                         actions that would need a real server).
 *   disabled: true        Greys the button out.
 *   back:  "menu-id"      Where the window's ✕ goes. Omit on the root menu.
 *
 * ── Text ────────────────────────────────────────────────────────────────────
 *
 * Labels and bodies accept Minecraft `§` colour codes, so text can be pasted
 * straight out of the add-on source and renders in the same colours.
 * `{player}` and `{server}` are replaced with `playerName` / `serverName` below.
 *
 * Icons live in `public/gilded/icons/` (copied from the add-on's resource
 * pack). Chest slots take either an `icon` path or an emoji `glyph`.
 */

const ICON = {
  warps: "/gilded/icons/set_bounty.png",
  homes: "/gilded/icons/castle.png",
  mailbox: "/gilded/icons/closed_chest.png",
  redeem: "/gilded/icons/tag.png",
  shop: "/gilded/icons/shop.png",
  admin: "/gilded/icons/sword.png",
  openChest: "/gilded/icons/open_chest.png",
  closedChest: "/gilded/icons/closed_chest.png",
  back: "/gilded/icons/back.png",
  billboard: "/gilded/icons/billboard.png",
  tag: "/gilded/icons/tag.png",
  cross: "/gilded/icons/cross.png",
  settings: "/gilded/icons/settings.png",
  money: "/gilded/icons/money.png",
  star: "/gilded/icons/star.png",
  restrict: "/gilded/icons/restrict.png",
  friends: "/gilded/icons/friends.png",
  vip: "/gilded/icons/vip_icon.png",
} as const;

/** Colour list offered by the rank editor, with each entry in its own colour. */
const RANK_COLORS = [
  "§fWhite",
  "§nDark Peach",
  "§4Dark Red",
  "§cRed",
  "§vOrange",
  "§6Light Orange",
  "§gMinecoin",
  "§eYellow",
  "§aLime",
  "§2Green",
  "§3Turquoise",
  "§bCyan",
  "§wLight Blue",
  "§9Blue",
  "§1Dark Blue",
  "§uViolet",
  "§5Purple",
  "§dPink",
  "§7Light Grey",
  "§8Dark Grey",
  "§0Black",
];

const RANK_FORMATS = ["None", "§lBold", "§oItalic", "§kObfuscated"];

export const GILDED_MENUS: MenuViewerConfig = {
  skin: "gilded",
  headerText: "Powered by Gilded Utilities",
  playerName: "AdemDEV",
  // Whatever the admin enters in the setup wizard. Use {server} in any menu text.
  serverName: "Server Name",
  rootMenu: "main",

  menus: {
    /* ===================================================================== */
    /*  Main menu — the only screen that uses the tiled grid layout.         */
    /* ===================================================================== */
    main: {
      id: "main",
      kind: "action-grid",
      title: "{server}",
      columns: 3,
      body: "Welcome, §b{player}§r to {server}§r! \n\n§7Please select an option below.§r",
      buttons: [
        { label: "§fWarps", icon: ICON.warps, opens: "warps" },
        { label: "§fHomes", icon: ICON.homes, opens: "homes" },
        { label: "§fMailbox", icon: ICON.mailbox, opens: "mailbox" },
        { label: "§fRedeem Code", icon: ICON.redeem, opens: "redeem" },
        { label: "§fServer Shop", icon: ICON.shop, opens: "shop" },
        { label: "§cAdmin Page", icon: ICON.admin, opens: "admin" },
      ],
    },

    /* ===================================================================== */
    /*  Warps                                                                */
    /* ===================================================================== */
    warps: {
      id: "warps",
      kind: "action-list",
      title: "Warps",
      back: "main",
      body: "§cNo warps have been set yet. §gUse the button below to create one.",
      buttons: [
        { label: "§bSet Warp Here", icon: ICON.openChest, opens: "warps.set" },
        { label: "§cDelete Warp", icon: ICON.closedChest, opens: "warps.delete" },
        { label: "§fBack", icon: ICON.back, opens: "main" },
      ],
    },

    "warps.set": {
      id: "warps.set",
      kind: "modal",
      title: "Set Warp",
      back: "warps",
      fields: [{ type: "textField", label: "Warp name", placeholder: "spawn" }],
      note: "[Gilded Utilities] Warp §aspawn§r saved at your current position.",
    },

    "warps.delete": {
      id: "warps.delete",
      kind: "action-list",
      title: "Delete Warp",
      back: "warps",
      body: "Choose a warp to remove.",
      buttons: [
        { label: "spawn", icon: ICON.warps, note: "[Gilded Utilities] Warp §aspawn§r deleted." },
        { label: "mines", icon: ICON.warps, note: "[Gilded Utilities] Warp §amines§r deleted." },
        { label: "Cancel", icon: ICON.back, opens: "warps" },
      ],
    },

    /* ===================================================================== */
    /*  Homes                                                                */
    /* ===================================================================== */
    homes: {
      id: "homes",
      kind: "action-list",
      title: "Homes",
      back: "main",
      body: "§fHomes: §d1/3",
      buttons: [
        { label: "§fHome: §amain", icon: ICON.homes, note: "[Gilded Utilities] Teleported to §amain§r." },
        { label: "§bSet Home Here", icon: ICON.openChest, opens: "homes.set" },
        { label: "§cDelete Home", icon: ICON.closedChest, opens: "homes.delete" },
        { label: "§fBack", icon: ICON.back, opens: "main" },
      ],
    },

    "homes.set": {
      id: "homes.set",
      kind: "modal",
      title: "Set Home",
      back: "homes",
      fields: [{ type: "textField", label: "Home name", placeholder: "main" }],
      note: "[Gilded Utilities] Home §amain§r saved at your current position.",
    },

    "homes.delete": {
      id: "homes.delete",
      kind: "action-list",
      title: "Delete Home",
      back: "homes",
      body: "Choose a home to remove.",
      buttons: [
        { label: "main", icon: ICON.homes, note: "[Gilded Utilities] Home §amain§r deleted." },
        { label: "Cancel", icon: ICON.back, opens: "homes" },
      ],
    },

    /* ===================================================================== */
    /*  Mailbox                                                              */
    /* ===================================================================== */
    mailbox: {
      id: "mailbox",
      kind: "action-list",
      title: "Mailbox",
      back: "main",
      body: "§fInbox messages: §d1",
      buttons: [
        { label: "§bCompose Message", icon: ICON.billboard, opens: "mailbox.compose" },
        { label: "§fFrom §aSteve", icon: ICON.tag, opens: "mailbox.message" },
        { label: "§fBack", icon: ICON.back, opens: "main" },
      ],
    },

    "mailbox.compose": {
      id: "mailbox.compose",
      kind: "modal",
      title: "Compose Mail",
      back: "mailbox",
      fields: [
        { type: "textField", label: "Recipient (must be online)", placeholder: "Username" },
        { type: "textField", label: "Message", placeholder: "Hello, there!" },
      ],
      note: "[Gilded Utilities] Message sent.",
    },

    "mailbox.message": {
      id: "mailbox.message",
      kind: "action-list",
      title: "From §aSteve",
      back: "mailbox",
      body: "§fMessage: §dWelcome to the server! Grab a starter kit at spawn.",
      buttons: [
        { label: "§cDelete Message", icon: ICON.cross, note: "[Gilded Utilities] Message deleted." },
        { label: "§fBack", icon: ICON.back, opens: "mailbox" },
      ],
    },

    /* ===================================================================== */
    /*  Redeem codes                                                         */
    /* ===================================================================== */
    redeem: {
      id: "redeem",
      kind: "modal",
      title: "Redeem Code",
      back: "main",
      fields: [{ type: "textField", label: "Code", placeholder: "WELCOME" }],
      note: "[Gilded Utilities] Code redeemed — §ayou received starter rewards.",
    },

    /* ===================================================================== */
    /*  Server shop — ChestFormData                                          */
    /* ===================================================================== */
    shop: {
      id: "shop",
      kind: "chest",
      title: "Server Shop",
      back: "main",
      size: 54,
      titleLines: ["§fBalance: §a1240 Coins", "§fTax: §c5%"],
      items: [
        {
          slot: 0,
          name: "§fStarter Sword §7(1x)",
          lore: ["§fPrice: §a105 Coins"],
          glyph: "🗡️",
          opens: "shop.buy",
        },
        {
          slot: 1,
          name: "§fGold Ingot §7(16x)",
          lore: ["§fPrice: §a420 Coins"],
          icon: ICON.money,
          stack: 16,
          opens: "shop.buy",
        },
        {
          slot: 2,
          name: "§fOak Log §7(64x)",
          lore: ["§fPrice: §a210 Coins"],
          glyph: "🪵",
          stack: 64,
          opens: "shop.buy",
        },
        {
          slot: 3,
          name: "§fDiamond §7(1x)",
          lore: ["§fPrice: §a800 Coins"],
          glyph: "💎",
          opens: "shop.buy",
        },
        {
          slot: 48,
          name: "§cAdmin: Manage Shop",
          lore: ["§7Configure shop items and settings"],
          glyph: "🟪",
          enchanted: true,
          opens: "shop.admin",
        },
        {
          slot: 49,
          name: "§aSell Items",
          lore: ["§7Sell items from your inventory"],
          glyph: "💚",
          opens: "shop.sell",
        },
        {
          slot: 50,
          name: "§fBack",
          lore: ["§7Return to menu"],
          icon: ICON.restrict,
          opens: "main",
        },
      ],
    },

    "shop.buy": {
      id: "shop.buy",
      kind: "modal",
      title: "Buy Starter Sword",
      back: "shop",
      fields: [{ type: "slider", label: "Quantity", min: 1, max: 64, step: 1, value: 1 }],
      note: "[Gilded Utilities] Purchased §a1x Starter Sword§r for §a105 Coins§r.",
    },

    "shop.sell": {
      id: "shop.sell",
      kind: "chest",
      title: "Sell Items",
      back: "shop",
      size: 54,
      titleLines: ["§fSell Items", "§fBalance: §a1240 Coins", "§fTax: §c5%"],
      items: [
        {
          slot: 0,
          name: "§fGold Ingot §7(1x)",
          lore: ["§fYou have: §232", "§fReceive: §a24 §fCoins each", "§fType: §fminecraft:gold_ingot"],
          icon: ICON.money,
          opens: "shop.sell.modal",
        },
        {
          slot: 1,
          name: "§fOak Log §7(1x)",
          lore: ["§fYou have: §2128", "§fReceive: §a3 §fCoins each", "§fType: §fminecraft:oak_log"],
          glyph: "🪵",
          opens: "shop.sell.modal",
        },
        { slot: 50, name: "§fBack", lore: ["§7Return to menu"], icon: ICON.restrict, opens: "shop" },
      ],
    },

    "shop.sell.modal": {
      id: "shop.sell.modal",
      kind: "modal",
      title: "Sell Gold Ingot",
      back: "shop.sell",
      fields: [{ type: "slider", label: "Quantity", min: 1, max: 32, step: 1, value: 1 }],
      note: "[Gilded Utilities] Sold §a1x Gold Ingot§r for §a24 Coins§r.",
    },

    "shop.admin": {
      id: "shop.admin",
      kind: "action-list",
      title: "Shop Admin",
      back: "shop",
      body: "§fTotal Items: §b4",
      buttons: [
        {
          label: "§2Manage Items\n§8[ §fCreate, edit, and delete shop items §8]",
          icon: ICON.openChest,
          opens: "shop.admin.item",
        },
        {
          label: "§4Delete Item\n§8[ §fRemove existing shop items §8]",
          icon: ICON.cross,
          opens: "shop.admin.delete",
        },
        {
          label: "§6Shop Settings\n§8[ §fConfigure shop behavior §8]",
          icon: ICON.settings,
          opens: "shop.admin.settings",
        },
        { label: "§7Back\n§8[ §fReturn to previous menu §8]", icon: ICON.back, opens: "shop" },
      ],
    },

    "shop.admin.item": {
      id: "shop.admin.item",
      kind: "modal",
      title: "Add or Update Shop Item",
      back: "shop.admin",
      fields: [
        { type: "textField", label: "Item id key", placeholder: "starter_sword" },
        { type: "textField", label: "Display name", placeholder: "Starter Sword" },
        { type: "textField", label: "Minecraft item type", placeholder: "minecraft:iron_sword" },
        { type: "slider", label: "Amount given", min: 1, max: 64, step: 1, value: 1 },
        { type: "slider", label: "Base price", min: 1, max: 50000, step: 1, value: 100 },
        { type: "toggle", label: "Allow players to sell this item", value: false },
        { type: "slider", label: "Sell price per unit", min: 0, max: 50000, step: 1, value: 0 },
      ],
      note: "[Gilded Utilities] Shop item saved.",
    },

    "shop.admin.delete": {
      id: "shop.admin.delete",
      kind: "action-list",
      title: "Delete Shop Item",
      back: "shop.admin",
      body: "Select item to delete.",
      buttons: [
        {
          label: '§4Remove: §7"§6Starter Sword§7"\n§8[ §f1x - minecraft:iron_sword §8]',
          icon: ICON.cross,
          note: "[Gilded Utilities] Shop item §aStarter Sword§r deleted.",
        },
        { label: "§7Back\n§8[ §fReturn to previous menu §8]", icon: ICON.back, opens: "shop.admin" },
      ],
    },

    "shop.admin.settings": {
      id: "shop.admin.settings",
      kind: "modal",
      title: "Shop Settings",
      back: "shop.admin",
      fields: [
        { type: "toggle", label: "Enable shop", value: true },
        { type: "textField", label: "Currency label", placeholder: "Coins", value: "Coins" },
        { type: "textField", label: "Scoreboard objective", placeholder: "money", value: "money" },
        { type: "slider", label: "Tax (%)", min: 0, max: 25, step: 1, value: 5 },
        { type: "toggle", label: "Enable selling to shop", value: true },
      ],
      note: "[Gilded Utilities] Shop settings updated.",
    },

    /* ===================================================================== */
    /*  Admin panel                                                          */
    /* ===================================================================== */
    admin: {
      id: "admin",
      kind: "action-list",
      title: "Admin Panel",
      back: "main",
      body: "§fUser: §b{player}§r\n§fID: §b-4294967123\n\n§7Select an option:",
      buttons: [
        {
          label: "§4Server Settings\n§8[ §fManage general server configuration §8]",
          icon: ICON.settings,
          opens: "admin.settings",
        },
        {
          label: "§6Manage Redeem Codes\n§8[ §fCreate and delete redeem codes §8]",
          icon: ICON.tag,
          opens: "admin.codes",
        },
        {
          label: "§gManage Shop\n§8[ §fManage shop items and inventory §8]",
          icon: ICON.shop,
          opens: "shop.admin",
        },
        {
          label: "§2Manage Ranks\n§8[ §fCreate and delete custom ranks §8]",
          icon: ICON.star,
          opens: "admin.ranks",
        },
        { label: "§3Logs\n§8[ §fView recent server logs §8]", icon: ICON.billboard, opens: "admin.logs" },
        { label: "§7Back\n§8[ §fReturn to main menu §8]", icon: ICON.back, opens: "main" },
      ],
    },

    "admin.settings": {
      id: "admin.settings",
      kind: "modal",
      title: "Server Settings",
      back: "admin",
      fields: [
        { type: "textField", label: "Server Name", placeholder: "My Realm", value: "BAR" },
        { type: "slider", label: "Max homes per player", min: 1, max: 10, step: 1, value: 3 },
        { type: "toggle", label: "Show Shop button", value: true },
        { type: "textField", label: "Shop currency label", placeholder: "Coins", value: "Coins" },
        { type: "textField", label: "Shop currency objective", placeholder: "money", value: "money" },
        { type: "slider", label: "Shop tax (%)", min: 0, max: 25, step: 1, value: 5 },
      ],
      note: "[Gilded Utilities] Server settings updated.",
    },

    "admin.codes": {
      id: "admin.codes",
      kind: "action-list",
      title: "Redeem Codes",
      back: "admin",
      body: "Total codes: 2",
      buttons: [
        {
          label: "§aManage Codes\n§8[ §fCreate a new code or update an existing one §8]",
          icon: ICON.openChest,
          opens: "admin.codes.create",
        },
        { label: "§4Delete §bWELCOME", icon: ICON.cross, note: "[Gilded Utilities] Code §bWELCOME§r deleted." },
        { label: "§4Delete §bLAUNCH", icon: ICON.cross, note: "[Gilded Utilities] Code §bLAUNCH§r deleted." },
        { label: "§7Back\n§8[ §fReturn to admin panel §8]", icon: ICON.back, opens: "admin" },
      ],
    },

    "admin.codes.create": {
      id: "admin.codes.create",
      kind: "modal",
      title: "Create Redeem Code",
      back: "admin.codes",
      fields: [
        { type: "textField", label: "Code", placeholder: "WELCOME" },
        { type: "textField", label: "Reward message", placeholder: "You received starter rewards." },
      ],
      note: "[Gilded Utilities] Code saved.",
    },

    "admin.ranks": {
      id: "admin.ranks",
      kind: "action-list",
      title: "Rank Manager",
      back: "admin",
      body: "Total ranks: 3",
      buttons: [
        { label: "§aCreate New Rank\n§8[ §fCreate a new rank §8]", icon: ICON.star, opens: "admin.ranks.create" },
        {
          label: "§bAssign Rank to Player\n§8[ §fAssign a rank to a player §8]",
          icon: ICON.friends,
          opens: "admin.ranks.assign",
        },
        {
          label: '§eEdit Rank: §7"§bMember§r§7" §8[§6§l0§r§8]§r\n(Server Rank - cannot be deleted)',
          icon: ICON.tag,
          opens: "admin.ranks.edit",
        },
        {
          label: '§eEdit Rank: §7"§bAdmin§r§7" §8[§6§l100§r§8]§r\n(Server Rank - cannot be deleted)',
          icon: ICON.admin,
          opens: "admin.ranks.edit",
        },
        {
          label: '§eEdit Rank: §7"§bVIP§r§7" §8[§6§l50§r§8]§r\n(Deletable Rank)',
          icon: ICON.vip,
          opens: "admin.ranks.edit",
        },
        { label: "§7Back\n§8[ §fReturn to admin panel §8]", icon: ICON.back, opens: "admin" },
      ],
    },

    "admin.ranks.create": {
      id: "admin.ranks.create",
      kind: "modal",
      title: "Create New Rank",
      back: "admin.ranks",
      fields: [
        { type: "textField", label: "Rank ID", placeholder: "vip" },
        { type: "textField", label: "Display Prefix", placeholder: "VIP" },
        { type: "textField", label: "Priority (number)", placeholder: "0" },
        { type: "textField", label: "Custom Label (optional | OVERRIDES OPTIONS ABOVE)", placeholder: "" },
        { type: "dropdown", label: "Color", options: RANK_COLORS, index: 5 },
        { type: "dropdown", label: "Formatting", options: RANK_FORMATS, index: 0 },
      ],
      note: "[Gilded Utilities] Rank created. Preview: §6VIP§r {player}",
    },

    "admin.ranks.edit": {
      id: "admin.ranks.edit",
      kind: "modal",
      title: "Edit Rank: VIP",
      back: "admin.ranks",
      fields: [
        { type: "textField", label: "Display Prefix", placeholder: "VIP", value: "VIP" },
        { type: "textField", label: "Priority (number)", placeholder: "50", value: "50" },
        { type: "textField", label: "Custom Label (optional | OVERRIDES OPTIONS ABOVE)", placeholder: "" },
        { type: "dropdown", label: "Color", options: RANK_COLORS, index: 5 },
        { type: "dropdown", label: "Formatting", options: RANK_FORMATS, index: 1 },
        { type: "toggle", label: "Delete this rank", value: false },
      ],
      note: "[Gilded Utilities] Rank updated.",
    },

    "admin.ranks.assign": {
      id: "admin.ranks.assign",
      kind: "action-list",
      title: "Assign Rank to Player",
      back: "admin.ranks",
      body: "Select a rank to assign:",
      buttons: [
        { label: "Member", icon: ICON.tag, opens: "admin.ranks.assign.player" },
        { label: "Admin", icon: ICON.admin, opens: "admin.ranks.assign.player" },
        { label: "VIP", icon: ICON.vip, opens: "admin.ranks.assign.player" },
        { label: "Cancel", icon: ICON.back, opens: "admin.ranks" },
      ],
    },

    "admin.ranks.assign.player": {
      id: "admin.ranks.assign.player",
      kind: "modal",
      title: "Assign VIP",
      back: "admin.ranks.assign",
      fields: [{ type: "textField", label: "Player Name", placeholder: "" }],
      note: "[Gilded Utilities] Rank §6VIP§r assigned.",
    },

    /* Log filters are a small chest form in the add-on, so they are here too. */
    "admin.logs": {
      id: "admin.logs",
      kind: "chest",
      title: "Logs - Filters",
      back: "admin",
      size: 27,
      titleLines: ["§fLogs - Filters"],
      items: [
        { slot: 0, name: "§fAll Logs", lore: ["§7View filtered logs"], glyph: "📕", opens: "admin.logs.list" },
        { slot: 1, name: "§fAdmin Panel", lore: ["§7View filtered logs"], glyph: "🟪", opens: "admin.logs.list" },
        { slot: 2, name: "§fRank Updates", lore: ["§7View filtered logs"], icon: ICON.tag, opens: "admin.logs.list" },
        { slot: 3, name: "§fShop Purchases", lore: ["§7View filtered logs"], glyph: "💚", opens: "admin.logs.list" },
        { slot: 4, name: "§fShop Sells", lore: ["§7View filtered logs"], icon: ICON.money, opens: "admin.logs.list" },
        { slot: 5, name: "§fShop Updates", lore: ["§7View filtered logs"], glyph: "🛢️", opens: "admin.logs.list" },
        { slot: 6, name: "§fCode Updates", lore: ["§7View filtered logs"], glyph: "📄", opens: "admin.logs.list" },
        { slot: 7, name: "§fCode Redeems", lore: ["§7View filtered logs"], glyph: "📗", opens: "admin.logs.list" },
        { slot: 8, name: "§fHome Updates", lore: ["§7View filtered logs"], icon: ICON.homes, opens: "admin.logs.list" },
        { slot: 9, name: "§fWarp Updates", lore: ["§7View filtered logs"], glyph: "🧭", opens: "admin.logs.list" },
        { slot: 10, name: "§fWarp Teleports", lore: ["§7View filtered logs"], glyph: "🔮", opens: "admin.logs.list" },
        { slot: 11, name: "§fMailbox", lore: ["§7View filtered logs"], icon: ICON.mailbox, opens: "admin.logs.list" },
        { slot: 12, name: "§fGeneral", lore: ["§7View filtered logs"], glyph: "📘", opens: "admin.logs.list" },
        { slot: 26, name: "§7Back", lore: ["§8Return to admin panel"], icon: ICON.restrict, opens: "admin" },
      ],
    },

    "admin.logs.list": {
      id: "admin.logs.list",
      kind: "action-list",
      title: "Server Logs",
      back: "admin.logs",
      body:
        "§7Filtered logs (ALL).\n\n" +
        "§aINFO§r §7[SHOP_PURCHASE]§r {player} bought 1x Starter Sword for 105 Coins.\n" +
        "§aINFO§r §7[RANK_UPDATE]§r Rank vip assigned to Steve by {player}.\n" +
        "§aINFO§r §7[WARP_UPDATE]§r Warp spawn created by {player}.\n" +
        "§eWARN§r §7[MAILBOX]§r Delivery deferred — recipient offline.\n" +
        "§aINFO§r §7[ADMIN_PANEL]§r {player} accessed the admin panel.\n\n" +
        "§fUse Back to choose another filter.",
      buttons: [{ label: "§7Back\n§8[ §fChoose another filter §8]", icon: ICON.back, opens: "admin.logs" }],
    },

    /* ===================================================================== */
    /*  First-run setup wizard                                               */
    /* ===================================================================== */
    setup: {
      id: "setup",
      kind: "modal",
      title: "Gilded Utilities Setup",
      back: "main",
      fields: [
        { type: "textField", label: "Server Name§c*§r", placeholder: "My Realm" },
        {
          type: "textField",
          label: 'Main Menu Item§c*§r(e.g. "minecraft:compass")',
          placeholder: "minecraft:compass",
        },
        { type: "slider", label: "Max homes per player", min: 1, max: 10, step: 1, value: 3 },
        { type: "toggle", label: "Enable shop button", value: false },
        { type: "textField", label: "Shop currency label", placeholder: "Coins" },
        { type: "textField", label: "Shop currency objective", placeholder: "money" },
        { type: "slider", label: "Shop tax (%)", min: 0, max: 25, step: 1, value: 0 },
      ],
      note: "[Gilded Utilities] Setup saved. §eYou have also been given Admin privileges.",
    },
  },
};
