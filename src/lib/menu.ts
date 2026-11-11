import type { PhotoKey } from "./photos";

/**
 * The full menu. Prices are in rupees and include GST.
 * Edit this file to change dishes, prices or categories.
 */

export type Diet = "veg" | "non-veg";

export type Dish = {
  name: string;
  description: string;
  price: number;
  diet: Diet;
  spicy?: boolean;
  signature?: boolean;
  photo?: PhotoKey;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  dishes: Dish[];
};

export const menu: MenuCategory[] = [
  {
    id: "small-plates",
    title: "Small plates",
    dishes: [
      { name: "Masala papad basket", description: "Roasted and fried papad with onion, tomato and chaat masala.", price: 129, diet: "veg" },
      { name: "Samosa chaat", description: "Crushed Punjabi samosa, chole, tamarind and mint chutney, sev.", price: 189, diet: "veg" },
      { name: "Gunpowder podi idli", description: "Mini idlis tossed in ghee and spiced lentil podi.", price: 219, diet: "veg" },
      { name: "Dahi ke kebab", description: "Hung-curd patties with ginger and green chilli, beetroot chutney.", price: 259, diet: "veg" },
      { name: "Chicken 65", description: "Bengaluru's favourite bar snack: curry leaves, red chilli, lots of crunch.", price: 319, diet: "non-veg", spicy: true },
      { name: "Prawn koliwada", description: "Batter-fried prawns, Mumbai fishing-village style, with lime.", price: 389, diet: "non-veg" },
    ],
  },
  {
    id: "tandoor",
    title: "From the tandoor",
    note: "Cooked to order in our clay oven. Allow 20 minutes.",
    dishes: [
      { name: "Paneer tikka", description: "Malai-marinated paneer, peppers and onion, charred on the skewer.", price: 329, diet: "veg", signature: true, photo: "paneerTikka" },
      { name: "Malai broccoli", description: "Broccoli in a cream cheese and cardamom marinade.", price: 299, diet: "veg" },
      { name: "Tandoori chicken", description: "Half bird in a 24-hour yoghurt and Kashmiri chilli marinade.", price: 379, diet: "non-veg", photo: "tandooriChicken" },
      { name: "Mutton seekh kebab", description: "Hand-minced mutton with ginger, mint and garam masala.", price: 449, diet: "non-veg", photo: "seekhKebab" },
      { name: "Ajwaini fish tikka", description: "Basa fillet with carom seeds, mustard oil and lemon.", price: 469, diet: "non-veg" },
    ],
  },
  {
    id: "curries",
    title: "Curries",
    note: "Best with a bread or rice from below.",
    dishes: [
      { name: "Dal makhani", description: "Black lentils simmered overnight on the tandoor's embers, finished with butter.", price: 299, diet: "veg", signature: true, photo: "dalMakhani" },
      { name: "Palak paneer", description: "Fresh spinach, garlic and soft paneer.", price: 319, diet: "veg" },
      { name: "Kadai mushroom and corn", description: "Tossed with peppers and freshly pounded kadai masala.", price: 289, diet: "veg" },
      { name: "Murgh makhani", description: "Our butter chicken: tandoori chicken in a tomato, butter and fenugreek gravy.", price: 419, diet: "non-veg", signature: true, photo: "butterChicken" },
      { name: "Laal maas", description: "Rajasthani mutton curry with mathania chillies. Properly hot.", price: 489, diet: "non-veg", spicy: true },
      { name: "Kerala prawn curry", description: "Coconut milk, kokum and curry leaves.", price: 499, diet: "non-veg" },
    ],
  },
  {
    id: "biryani",
    title: "Biryani and rice",
    dishes: [
      { name: "Hyderabadi chicken dum biryani", description: "Sealed and slow-cooked with saffron and fried onions. Comes with raita and salan.", price: 399, diet: "non-veg", signature: true, photo: "biryani" },
      { name: "Mutton dum biryani", description: "Bone-in mutton, aged basmati, rose water and saffron.", price: 479, diet: "non-veg" },
      { name: "Subz dum biryani", description: "Seasonal vegetables and paneer, cooked dum style.", price: 319, diet: "veg" },
      { name: "Jeera rice", description: "Basmati tempered with cumin and ghee.", price: 169, diet: "veg" },
    ],
  },
  {
    id: "thalis",
    title: "Thalis",
    note: "Lunch only, 12 pm to 3 pm.",
    dishes: [
      { name: "Saffron Table veg thali", description: "Five curries, dal, rice, two breads, raita, salad and a dessert.", price: 449, diet: "veg", photo: "thali" },
      { name: "Saffron Table non-veg thali", description: "Butter chicken, mutton curry, dal, rice, two breads, raita and a dessert.", price: 549, diet: "non-veg" },
    ],
  },
  {
    id: "breads",
    title: "Breads",
    dishes: [
      { name: "Tandoori roti", description: "Whole wheat, from the tandoor.", price: 49, diet: "veg" },
      { name: "Butter naan", description: "Soft and blistered, brushed with butter.", price: 69, diet: "veg", photo: "naan" },
      { name: "Laccha paratha", description: "Flaky, layered whole-wheat bread.", price: 79, diet: "veg" },
      { name: "Garlic naan", description: "With garlic, coriander and butter.", price: 89, diet: "veg" },
      { name: "Cheese kulcha", description: "Stuffed with cheese and green chilli.", price: 129, diet: "veg" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    dishes: [
      { name: "Gulab jamun", description: "Two warm khoya dumplings in cardamom syrup.", price: 149, diet: "veg" },
      { name: "Kesar phirni", description: "Ground rice and saffron, set in a clay pot.", price: 169, diet: "veg", photo: "phirni" },
      { name: "Rasmalai", description: "Soft chhena discs in saffron milk with pistachio.", price: 179, diet: "veg" },
      { name: "Gajar halwa", description: "Winter only: slow-cooked carrots, khoya and ghee.", price: 189, diet: "veg" },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    dishes: [
      { name: "Masala chai", description: "Brewed with ginger and cardamom, served in a kulhad.", price: 79, diet: "veg", photo: "chai" },
      { name: "Filter coffee", description: "Chicory blend, served in a davara.", price: 89, diet: "veg" },
      { name: "Fresh lime soda", description: "Sweet, salted or mixed.", price: 99, diet: "veg" },
      { name: "Sweet or salted lassi", description: "Thick, chilled and made in-house.", price: 119, diet: "veg" },
      { name: "Mango lassi", description: "Alphonso mango pulp and yoghurt.", price: 149, diet: "veg" },
    ],
  },
];

export const signatureDishes: Dish[] = menu.flatMap((c) => c.dishes).filter((d) => d.signature);

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
