import type { MenuViewerConfig } from "@/types/addon";

/**
 * ============================================================================
 *  BLOCK-BAY LIVE MENU VIEWER — this is the file you edit.
 * ============================================================================
 *
 * Block-Bay is chest-UI first: every screen except the listing prompt and the
 * setup wizard is a `ChestFormData`, so `skin: "chest"` drops the Action-form
 * window frame and lets each container draw its own chrome.
 *
 * Slot numbers below match the constants in the add-on's `menus.ts` exactly:
 *   small chest = 27 slots (9x3), large chest = 54 slots (9x6)
 *   balance 4 · buy 11 · listings 13 · sell 15 · close 22
 *   confirm 11 · preview 13 · deny 15
 *   prevPage 45 · back 49 · nextPage 53 · sellInfo 40
 *
 * See `gilded-utilities.menus.ts` for the full field reference — the shapes are
 * identical. `§` colour codes and `{player}` / `{server}` work the same way.
 */

/** The add-on's own multicoloured wordmark, copied from `menus.ts`. */
const BLOCKBAY = "§l§cbl§9oc§ek§eb§2ay";

/** Gray stained glass filler, as used by `menu.pattern(...)`. */
const FILLER = { name: " ", glyph: "▪", lore: [] as string[] };

/** Fills the given slots with the filler pane so the pattern reads correctly. */
function filler(slots: number[]) {
  return slots.map((slot) => ({ slot, ...FILLER }));
}

// shop(): pattern ["xxxx_xxxx", "x_______x", "xxxx_xxxx"] over a small chest.
const SHOP_FILLER = filler([0, 1, 2, 3, 5, 6, 7, 8, 9, 17, 18, 19, 20, 21, 23, 24, 25, 26]);

// confirm menus: pattern ["xxxxxxxxx", "x_______x", "xxxxxxxxx"].
const CONFIRM_FILLER = filler([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
]);

// Grid menus: bottom row filled — pattern ["", "", "", "", "", "xxxxxxxxx"].
const GRID_FOOTER_FILLER = filler([46, 47, 48, 50, 51, 52]);

export const BLOCKBAY_MENUS: MenuViewerConfig = {
  skin: "chest",
  headerText: "Block-Bay",
  playerName: "AdemDEV",
  serverName: "Block-Bay",
  rootMenu: "shop",

  // The add-on's own dark container skin (textures/ui/*1.png in its pack).
  chest: {
    slot: "/blockbay/ui/item_background1.png",
    panel: "#4d4d4d",
    border: "#40d140",
    title: "#ffffff",
    close: "#d8d8d8",
  },

  menus: {
    /* ===================================================================== */
    /*  Hub — /blockbay:shop                                                 */
    /* ===================================================================== */
    shop: {
      id: "shop",
      kind: "chest",
      title: BLOCKBAY,
      navLabel: "Marketplace",
      size: 27,
      titleLines: [BLOCKBAY],
      items: [
        ...SHOP_FILLER,
        {
          slot: 4,
          name: "§6§l1240",
          lore: ["§7Balance: §61240", "§7Pending: §6320"],
          glyph: "🪙",
          note: "§7Balance: §61240§7. Pending sales pay out when you next join.",
        },
        {
          slot: 11,
          name: "§a§lBuy Items",
          lore: ["§7Browse items listed for sale."],
          glyph: "📦",
          opens: "buy",
        },
        {
          slot: 13,
          name: "§b§lMy Listings",
          lore: ["§7View and cancel your listings."],
          glyph: "📘",
          opens: "listings",
        },
        {
          slot: 15,
          name: "§e§lSell Items",
          lore: ["§7List one of your items for sale."],
          glyph: "💚",
          opens: "sell",
        },
        { slot: 22, name: "§c§lClose", lore: [], glyph: "🚫", note: "§7Menu closed." },
      ],
    },

    /* ===================================================================== */
    /*  Buy — paged grid of every active listing                             */
    /* ===================================================================== */
    buy: {
      id: "buy",
      kind: "chest",
      title: `${BLOCKBAY} §7(1/1)`,
      navLabel: "Buy Items",
      back: "shop",
      size: 54,
      titleLines: [`${BLOCKBAY} §7(1/1)`],
      items: [
        ...GRID_FOOTER_FILLER,
        {
          slot: 0,
          name: "§fNetherite Sword",
          lore: ["§7Price: §612000", "§7Amount: §f1", "§7Seller: §fSteve", "§9sharpness 5", "§9unbreaking 3"],
          glyph: "🗡️",
          enchanted: true,
          opens: "buy.confirm",
        },
        {
          slot: 1,
          name: "§fElytra",
          lore: ["§7Price: §625000", "§7Amount: §f1", "§7Seller: §fAlex", "§9mending 1"],
          glyph: "🪽",
          enchanted: true,
          opens: "buy.confirm",
        },
        {
          slot: 2,
          name: "§fDiamond",
          lore: ["§7Price: §6900", "§7Amount: §f32", "§7Seller: §fAdemDEV"],
          glyph: "💎",
          stack: 32,
          opens: "buy.confirm",
        },
        {
          slot: 3,
          name: "§fEnchanted Golden Apple",
          lore: ["§7Price: §64500", "§7Amount: §f2", "§7Seller: §fSteve"],
          glyph: "🍎",
          stack: 2,
          enchanted: true,
          opens: "buy.confirm",
        },
        {
          slot: 4,
          name: "§fOak Log",
          lore: ["§7Price: §6250", "§7Amount: §f64", "§7Seller: §fAlex"],
          glyph: "🪵",
          stack: 64,
          opens: "buy.confirm",
        },
        { slot: 49, name: "§cBack", lore: [], glyph: "🚫", opens: "shop" },
      ],
    },

    "buy.confirm": {
      id: "buy.confirm",
      kind: "chest",
      title: BLOCKBAY,
      back: "buy",
      size: 27,
      titleLines: [BLOCKBAY],
      items: [
        ...CONFIRM_FILLER,
        {
          slot: 13,
          name: "§fNetherite Sword",
          lore: ["§7Price: §612000", "§7Amount: §f1", "§7Seller: §fSteve", "§9sharpness 5"],
          glyph: "🗡️",
          enchanted: true,
        },
        {
          slot: 11,
          name: "§a§lBuy",
          lore: ["§7Cost: §612000", "§7Balance after: §60"],
          glyph: "🟩",
          note: "§aBought §f1x Netherite Sword§a for §612000§a.",
        },
        { slot: 15, name: "§c§lCancel", lore: [], glyph: "🟥", opens: "buy" },
      ],
    },

    /* ===================================================================== */
    /*  My Listings                                                          */
    /* ===================================================================== */
    listings: {
      id: "listings",
      kind: "chest",
      title: `${BLOCKBAY} §7(1/1)`,
      navLabel: "My Listings",
      back: "shop",
      size: 54,
      titleLines: [`${BLOCKBAY} §7(1/1)`],
      items: [
        ...GRID_FOOTER_FILLER,
        {
          slot: 0,
          name: "§fDiamond",
          lore: ["§7Price: §6900", "§7Amount: §f32", "§7Seller: §fAdemDEV"],
          glyph: "💎",
          stack: 32,
          opens: "listings.confirm",
        },
        {
          slot: 1,
          name: "§fBeacon",
          lore: ["§7Price: §618000", "§7Amount: §f1", "§7Seller: §fAdemDEV"],
          glyph: "🔷",
          opens: "listings.confirm",
        },
        { slot: 49, name: "§cBack", lore: [], glyph: "🚫", opens: "shop" },
      ],
    },

    "listings.confirm": {
      id: "listings.confirm",
      kind: "chest",
      title: BLOCKBAY,
      back: "listings",
      size: 27,
      titleLines: [BLOCKBAY],
      items: [
        ...CONFIRM_FILLER,
        {
          slot: 13,
          name: "§fDiamond",
          lore: ["§7Price: §6900", "§7Amount: §f32", "§7Seller: §fAdemDEV"],
          glyph: "💎",
          stack: 32,
        },
        {
          slot: 11,
          name: "§a§lTake Back",
          lore: ["§7Return this item to your inventory."],
          glyph: "🟩",
          note: "§aReturned §f32x Diamond§a to your inventory.",
        },
        { slot: 15, name: "§c§lKeep Listed", lore: [], glyph: "🟥", opens: "listings" },
      ],
    },

    /* ===================================================================== */
    /*  Sell — your live inventory, mapped into the top four rows            */
    /* ===================================================================== */
    sell: {
      id: "sell",
      kind: "chest",
      title: BLOCKBAY,
      navLabel: "Sell Items",
      back: "shop",
      size: 54,
      titleLines: [BLOCKBAY],
      items: [
        ...filler([
          36, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53,
        ]),
        {
          slot: 0,
          name: "§fDiamond",
          lore: ["§7Amount: §f32", "§eClick to list this item"],
          glyph: "💎",
          stack: 32,
          opens: "sell.prompt",
        },
        {
          slot: 1,
          name: "§fNetherite Sword",
          lore: ["§7Amount: §f1", "§eClick to list this item"],
          glyph: "🗡️",
          enchanted: true,
          opens: "sell.prompt",
        },
        {
          slot: 2,
          name: "§8Shulker Box",
          lore: [
            "§7Amount: §f1",
            "§cCannot be listed",
            "§8Bundles and shulker boxes may hold",
            "§8items that would be lost.",
          ],
          glyph: "🟪",
          note: "§cBundles and shulker boxes cannot be listed.",
        },
        {
          slot: 3,
          name: "§fOak Log",
          lore: ["§7Amount: §f64", "§eClick to list this item"],
          glyph: "🪵",
          stack: 64,
          opens: "sell.prompt",
        },
        {
          slot: 40,
          name: "§e§lSelect an Item",
          lore: ["§7Click one of your items above.", "§7Listings: §f2§7/§f15"],
          glyph: "💚",
        },
        { slot: 49, name: "§cBack", lore: [], glyph: "🚫", opens: "shop" },
      ],
    },

    "sell.prompt": {
      id: "sell.prompt",
      kind: "modal",
      title: BLOCKBAY,
      back: "sell",
      fields: [
        { type: "slider", label: "Amount (you have 32)", min: 1, max: 32, step: 1, value: 32 },
        { type: "textField", label: "Total price (1 - 1000000)", placeholder: "100", value: "100" },
      ],
      submitLabel: "List Item",
      note: "§aListed §f32x Diamond§a for §6100§a.",
    },

    /* ===================================================================== */
    /*  Setup wizard — /blockbay:setup                                       */
    /* ===================================================================== */
    setup: {
      id: "setup",
      kind: "modal",
      title: "Block-Bay Setup Wizard",
      navLabel: "Setup Wizard",
      back: "shop",
      fields: [
        { type: "textField", label: "Money Scoreboard", placeholder: "blockbucks", value: "blockbucks" },
      ],
      submitLabel: "Save",
      note: "§aBlock-Bay setup complete. Money scoreboard: §fblockbucks",
    },
  },
};
