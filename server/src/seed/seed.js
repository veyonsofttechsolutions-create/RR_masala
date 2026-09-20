import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";

import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Banner from "../models/Banner.js";

import { slugify } from "../utils/slug.js";

/* =========================================================================
   ADMIN CONFIG
   ========================================================================= */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@rrmasala.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || "9999999999";

/* =========================================================================
   PRODUCT IMAGES
   ========================================================================= */

const SPICE_IMAGES = [
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
];

/* =========================================================================
   ONLY REAL PRODUCTS PROVIDED BY RR MASALA
   ========================================================================= */

const originalProducts = [
  {
    category: "Kulambu Powders",
    name: "Kulambu Powder (All Types of Gravy)",
  },
  {
    category: "Non-Veg Masala",
    name: "Mutton Kulambu Powder (All Types of Non Veg Gravy)",
  },
  {
    category: "Non-Veg Masala",
    name: "Fish Kulambu Powder (All Types of Non Veg Gravy)",
  },
  {
    category: "Biryani Masala",
    name: "Briyani Masala Powder",
  },
  {
    category: "Rasam",
    name: "Rasam Powder",
  },
  {
    category: "Sambar",
    name: "Samabr Powder",
  },
  {
    category: "Idly Podi",
    name: "Idly Podi (Ellu / Karuvepillai / Paruppu)",
  },
  {
    category: "Paruppu Podi",
    name: "Paruppu Podi",
  },
  {
    category: "Perungayam",
    name: "Perungayam Powder (Asafoetida) and Katti",
  },
  {
    category: "Fry Powders",
    name: "Chicken fry Corn Powder (Both Veg and Non veg fry Items)",
  },
  {
    category: "Puliyotharai",
    name: "Puliyotharai paste 150G (Tamarind Rice)",
  },
  {
    category: "Pickles",
    name: "Lemon Pickle",
  },
  {
    category: "Pickles",
    name: "Mango Pickle",
  },
  {
    category: "Pickles",
    name: "Garlic Pickle",
  },
  {
    category: "Pickles",
    name: "Narthangai Pickle (Citron)",
  },
  {
    category: "Pickles",
    name: "Kolumichangai Pickle (Citrus maxima)",
  },
  {
    category: "Vadagam",
    name: "Arisi Vadagam",
  },
  {
    category: "Vadagam",
    name: "Javarisi Vadagam (Green chilli / Red chilli / Garlic / Cumin-Jeera)",
  },
  {
    category: "Vadagam",
    name: "Onion Vadagam",
  },
  {
    category: "Papad",
    name: "Papad Items",
  },
  {
    category: "Traditional Powders",
    name: "Shikkai Powder",
  },
  {
    category: "Ready Mix",
    name: "Mullu Murungai Readymix Powder (Pankarapam Bhairi)",
  },
  {
    category: "Ready Mix",
    name: "Coconut ReadyMix Powder (Nalar Bhairi)",
  },
  {
    category: "Other Traditional Products",
    name: "Uppukandam",
  },
  {
    category: "Other Traditional Products",
    name: "Uppukandam stick (kudal)",
  },
  {
    category: "Other Traditional Products",
    name: "Aruvadu",
  },
  {
    category: "Ready Mix",
    name: "Adai dosai Ready Mix Powder",
  },
  {
    category: "Ready Mix",
    name: "Rava dosai Ready Mix Powder",
  },
  {
    category: "Ready Mix",
    name: "Murukku Ready Mix Powder",
  },
  {
    category: "Ready Mix",
    name: "Idiyappam Ready Mix Powder",
  },
  {
    category: "Ready Mix",
    name: "Puttu Ready Mix Powder",
  },
];

/* =========================================================================
   IMAGE
   ========================================================================= */

function createImageUrl(index) {
  return SPICE_IMAGES[index % SPICE_IMAGES.length];
}

/* =========================================================================
   STOCK
   1 - 200 INITIAL STOCK
   ========================================================================= */

function createInitialStock() {
  return Math.floor(Math.random() * 200) + 1;
}

/* =========================================================================
   SEED
   ========================================================================= */

async function run() {
  try {
    await connectDB();

    console.log("MongoDB connected.");

    /* ---------------------------------------------------------------------
       ADMIN
       --------------------------------------------------------------------- */

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        name: "RR MASALA Admin",
        email: ADMIN_EMAIL,
        mobile: ADMIN_MOBILE,
        password: passwordHash,
        role: "ADMIN",
        isActive: true,
      },
      {
        upsert: true,
        new: true,
      }
    );

    /* ---------------------------------------------------------------------
       CLEAR OLD CATALOG
       --------------------------------------------------------------------- */

    await Product.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});

    console.log("Old products, categories and banners cleared.");

    /* ---------------------------------------------------------------------
       CREATE ONLY REQUIRED CATEGORIES
       --------------------------------------------------------------------- */

    const categoryNames = [
      ...new Set(originalProducts.map((product) => product.category)),
    ];

    const categoryMap = {};

    for (let i = 0; i < categoryNames.length; i++) {
      const name = categoryNames[i];

      const category = await Category.create({
        name,
        slug: slugify(name),
        displayOrder: i + 1,
        isActive: true,
      });

      categoryMap[name] = category._id;
    }

    /* ---------------------------------------------------------------------
       CREATE ONLY 31 REAL PRODUCTS
       --------------------------------------------------------------------- */

    const productDocuments = originalProducts.map((item, index) => {
      const img = createImageUrl(index);

      const sku = `RRM-${String(index + 1).padStart(4, "0")}`;

      const price = 50 + (index % 250);
      const compareAtPrice = price + 20;

      const stock = createInitialStock();

      return {
        name: item.name,

        slug: slugify(`${item.name}-${sku}`),

        sku,

        shortDescription:
          `Traditional ${item.category.toLowerCase()} from RR MASALA.`,

        description:
          `${item.name} prepared using traditional South Indian food recipes.`,

        category: categoryMap[item.category],

        subCategory: item.category,

        brand: "RR MASALA",

        images: [img],

        thumbnail: img,

        price,

        compareAtPrice,

        discountPercentage: Math.round(
          ((compareAtPrice - price) / compareAtPrice) * 100
        ),

        weight: 200,

        weightUnit: "g",

        /* IMPORTANT */
        stock,

        isActive: true,

        isFeatured: index < 8,

        tags: [
          item.category,
          "RR MASALA",
          "Indian Food",
          "South Indian",
          "Traditional Food",
        ],

        /* Export / food information */
        countryOfOrigin: "India",

        isExportable: true,

        ingredients: [],

        allergens: [],

        nutrition: {},

        howToUse: "",

        storageInstructions:
          "Store in a cool, dry place away from direct sunlight.",

        shelfLife: "",

        hsnCode: "",

        fssaiLicenseNo: "",

        manufacturerName: "",

        manufacturerAddress: "",

        packerName: "",

        packerAddress: "",

        netQuantity: "200 g",

        consumerCareEmail: "",

        consumerCarePhone: "",

        legalMetrologyDeclaration: "",
      };
    });

    await Product.insertMany(productDocuments);

    /* ---------------------------------------------------------------------
       BANNERS
       --------------------------------------------------------------------- */

    await Banner.create([
      {
        title: "Authentic Indian Masalas & Traditional Foods",

        subtitle:
          "Traditional South Indian flavours delivered across India and internationally.",

        image: SPICE_IMAGES[0],

        buttonText: "Shop Products",

        buttonLink: "/products",

        displayOrder: 1,

        active: true,
      },

      {
        title: "Pickles, Podis & Ready Mixes",

        subtitle:
          "Explore RR MASALA's traditional food collection.",

        image: SPICE_IMAGES[1],

        buttonText: "Explore Products",

        buttonLink: "/products",

        displayOrder: 2,

        active: true,
      },
    ]);

    /* ---------------------------------------------------------------------
       RESULT
       --------------------------------------------------------------------- */

    console.log(
      `Successfully seeded ${productDocuments.length} REAL RR MASALA products.`
    );

    console.log("Initial stock assigned between 1 and 200.");

    console.log("No dummy products were created.");

    process.exit(0);
  } catch (error) {
    console.error("Seed Failed:", error);

    process.exit(1);
  }
}

run();