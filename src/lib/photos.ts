/**
 * Food and interior photos. All are free photos from Unsplash
 * (https://unsplash.com/license), credited on the gallery page and in the README.
 * Swap these for the client's own photos when reusing the project.
 */

export type Photo = {
  src: string;
  alt: string;
  credit: string;
  /** Photographer's Unsplash profile handle, without the @. */
  handle: string;
  /** Unsplash photo page. */
  page: string;
};

/** Sizing is added per screen by src/lib/image-loader.ts. */
function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}`;
}

export const photos = {
  thali: {
    src: unsplash("1742281258189-3b933879867a"),
    alt: "A full Indian thali with curries, rice and breads, seen from above",
    credit: "Zoshua Colah",
    handle: "zoshuacolah",
    page: "https://unsplash.com/photos/delicious-indian-meal-served-on-a-platter-4pT9e68P_mU",
  },
  butterChicken: {
    src: unsplash("1603894584373-5ac82b2ae398"),
    alt: "Butter chicken in a rich orange gravy, topped with cream and coriander",
    credit: "Raman",
    handle: "potofgold07",
    page: "https://unsplash.com/photos/brown-and-green-dish-on-brown-wooden-bowl-sqcH2q7lkvo",
  },
  biryani: {
    src: unsplash("1563379091339-03b21ab4a4f8"),
    alt: "Two plates of chicken biryani on a dark table",
    credit: "Omkar Jadhav",
    handle: "jadhav24omkar",
    page: "https://unsplash.com/photos/two-plates-of-food-on-a-black-table-o5XB6XwTb1I",
  },
  paneerTikka: {
    src: unsplash("1567188040759-fb8a883dc6d8"),
    alt: "Paneer tikka with charred peppers and onions on a sizzler plate",
    credit: "Viktor Forgacs",
    handle: "sonance",
    page: "https://unsplash.com/photos/cooked-foods-WmKXu-bzygo",
  },
  naan: {
    src: unsplash("1640625314547-aee9a7696589"),
    alt: "A stack of freshly baked naan on a wooden board",
    credit: "Sweetyoga Justine",
    handle: "sweetyogajustine",
    page: "https://unsplash.com/photos/a-pile-of-pita-bread-sitting-on-top-of-a-wooden-cutting-board--C93EET79kU",
  },
  rotis: {
    src: unsplash("1655979284091-eea0e93405ee"),
    alt: "Soft rotis stacked on a plate",
    credit: "Ajeet Panesar",
    handle: "ajeetpanesarphotography",
    page: "https://unsplash.com/photos/a-plate-of-food-WrE3ruckrwI",
  },
  tandooriChicken: {
    src: unsplash("1727280376746-b89107a5b0df"),
    alt: "Tandoori chicken pieces on a slate with mint chutney and onion rings",
    credit: "Madhurima Basak",
    handle: "bskmadhu_15",
    page: "https://unsplash.com/photos/a-tray-of-chicken-wings-with-a-side-of-dipping-sauce-R25pvpErlsI",
  },
  chai: {
    src: unsplash("1761483281417-778013dc0177"),
    alt: "Masala chai being poured into small clay cups",
    credit: "Ajoy Das",
    handle: "champsara",
    page: "https://unsplash.com/photos/person-pouring-tea-into-small-clay-cups-gXYwwTQ_tZw",
  },
  dalMakhani: {
    src: unsplash("1789983665266-f1a6ea13b311"),
    alt: "Dal makhani in a black pot with a swirl of cream",
    credit: "Chetanya Sharma",
    handle: "chetanya_designs",
    page: "https://unsplash.com/photos/dal-makhani-in-black-pot-WR13Tw8gmsA",
  },
  seekhKebab: {
    src: unsplash("1633436375795-12b3b339712f"),
    alt: "Seekh kebabs on a plate with grilled tomatoes and fresh herbs",
    credit: "Parnis Azimi",
    handle: "parnissazimi",
    page: "https://unsplash.com/photos/a-plate-of-meat-and-vegetables-on-a-table-dIbPZcftpL8",
  },
  phirni: {
    src: unsplash("1707387312816-112e5ca3c145"),
    alt: "Saffron phirni served in a clay pot",
    credit: "Ashraful Islam",
    handle: "ashraful25",
    page: "https://unsplash.com/photos/a-close-up-of-a-bowl-of-soup-on-a-table-j1ZG-vIiApI",
  },
  tableSpread: {
    src: unsplash("1547573854-74d2a71d0826"),
    alt: "A table spread with small plates of Indian dishes, seen from above",
    credit: "Stefan Vladimirov",
    handle: "skv_creates",
    page: "https://unsplash.com/photos/white-plates-with-assorted-foods-Q_Moi2xjieU",
  },
  diningRoom: {
    src: unsplash("1517248135467-4c7edcad34c4"),
    alt: "Dining room with wooden tables, soft lamps and a long bar",
    credit: "Jason Leung",
    handle: "ninjason",
    page: "https://unsplash.com/photos/photo-of-pub-set-in-room-during-daytime-poI7DelFiVA",
  },
  stringLights: {
    src: unsplash("1729394405518-eaf2a0203aa7"),
    alt: "Restaurant interior with warm string lights over the tables",
    credit: "Mustafa Fatemi",
    handle: "solaticace",
    page: "https://unsplash.com/photos/a-restaurant-with-a-lot-of-tables-and-chairs-ZEfHrVDF3NM",
  },
  warmRoom: {
    src: unsplash("1667388969250-1c7220bf3f37"),
    alt: "A warm, wood-panelled dining room laid for dinner",
    credit: "Glenov Brankovic",
    handle: "glenovbrankovic",
    page: "https://unsplash.com/photos/a-room-with-tables-and-chairs-e4B5AvA7Jqo",
  },
  chefFlame: {
    src: unsplash("1620641606872-f9641b65adab"),
    alt: "A chef cooking over a tall flame in a busy kitchen",
    credit: "Charanjeet Dhiman",
    handle: "charanjeet_dhiman",
    page: "https://unsplash.com/photos/man-in-black-shirt-wearing-white-mask-12xmsDaAO6I",
  },
  chefPlating: {
    src: unsplash("1616734755909-bb016ce64930"),
    alt: "A chef in whites finishing a dish at the pass",
    credit: "Charanjeet Dhiman",
    handle: "charanjeet_dhiman",
    page: "https://unsplash.com/photos/man-in-white-chef-uniform-cooking-9xObRZdEN7g",
  },
  tandoor: {
    src: unsplash("1791601033912-e62d1a33f564"),
    alt: "Breads baking on the wall of a clay tandoor",
    credit: "Bernd Dittrich",
    handle: "hdbernd",
    page: "https://unsplash.com/photos/tandoor-oven-interior-with-charred-spots-D3bA0xwSWus",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Order and captions for the gallery page. */
export const gallery: { key: PhotoKey; caption: string }[] = [
  { key: "tableSpread", caption: "Small plates for the table" },
  { key: "stringLights", caption: "The dining room after dark" },
  { key: "chefFlame", caption: "Dinner service in the kitchen" },
  { key: "thali", caption: "The Saffron Table thali" },
  { key: "chai", caption: "Masala chai, poured to order" },
  { key: "tandoor", caption: "Breads straight off the tandoor wall" },
  { key: "butterChicken", caption: "Murgh makhani" },
  { key: "warmRoom", caption: "Tables set for the evening" },
  { key: "seekhKebab", caption: "Mutton seekh kebab" },
  { key: "chefPlating", caption: "Finishing touches at the pass" },
  { key: "biryani", caption: "Hyderabadi dum biryani" },
  { key: "diningRoom", caption: "Bar seating and the long room" },
  { key: "paneerTikka", caption: "Paneer tikka on the sizzler" },
  { key: "dalMakhani", caption: "Dal makhani, cooked overnight" },
];
