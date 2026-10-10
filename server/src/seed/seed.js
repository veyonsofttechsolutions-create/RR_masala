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
   PRODUCT IMAGES COLLECTION
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
   DETAILED PRODUCTS DATA FOR RR MASALA
   ========================================================================= */

const originalProducts = [
  {
    category: "Kulambu Powders",
    name: "Kulambu Powder (All Types of Gravy)",
    shortDescription: "Authentic multi-purpose South Indian Kulambu powder crafted for flavorful, rich, and aromatic traditional gravies.",
    description: "RR MASALA Kulambu Powder is meticulously stone-ground and blended using superior quality hand-picked spices including premium turmeric, aromatic coriander seeds, fiery red chillies, fragrant fenugreek, and split pulses (Vigna mungo). Designed to elevate everyday home-cooked kuzhambu dishes, vegetable gravies, and traditional lunch menus with exceptional depth, color, and authentic village-style taste.",
    ingredients: ["Turmeric", "Coriander", "Red chilli", "Fenugreek", "Vigna mungo"],
    netQuantity: "250 g",
    price: 100,
    compareAtPrice: 120,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Sauté onions, tomatoes, and your choice of vegetables or lentils in oil. Add 2 to 3 tablespoons of RR MASALA Kulambu Powder, tamarind extract, and water. Simmer on medium heat until raw flavor departs and oil separates on top.",
  },
  {
    category: "Non-Veg Masala",
    name: "Mutton Kulambu Powder (All Types of Non Veg Gravy)",
    shortDescription: "Specialized robust spice blend crafted for rich, spicy, and authentic South Indian mutton and meat gravies.",
    description: "Bring home the authentic flavors of Dindigul-style non-vegetarian cooking with RR MASALA Mutton Kulambu Powder. Expertly roasted spices, whole peppers, cumin, and select aromatic herbs are blended to neutralize gaminess while boosting rich meat broths. Perfect for mutton, country chicken (nattu kozhi), and beef gravies.",
    ingredients: ["Turmeric", "Coriander", "Red chilli", "Fenugreek", "Vigna mungo", "Black pepper", "Cumin", "Fennel"],
    netQuantity: "250 g",
    price: 100,
    compareAtPrice: 120,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Marinate meat with turmeric and salt. Sauté ginger-garlic paste, onions, and tomatoes. Add meat and 3 spoons of Mutton Kulambu Powder, pressure cook with water until tender, then simmer with coconut paste.",
  },
  {
    category: "Non-Veg Masala",
    name: "Fish Kulambu Powder (All Types of Non Veg Gravy)",
    shortDescription: "Tangy and spicy coastal-style spice blend formulated exclusively for delicious fish and seafood kuzhambu.",
    description: "RR MASALA Fish Kulambu Powder combines the warmth of traditional spices with a hint of earthy fenugreek and coriander, perfectly calibrated to complement delicate seafood flavors. It creates a thick, glossy, and lip-smacking gravy that pairs exceptionally well with hot steamed rice and idli.",
    ingredients: ["Turmeric", "Coriander", "Red chilli", "Fenugreek", "Vigna mungo", "Mustard seeds", "Curry leaves powder"],
    netQuantity: "250 g",
    price: 100,
    compareAtPrice: 120,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Extract thick tamarind juice, mix with sliced shallots, tomatoes, sesame oil, and Fish Kulambu Powder. Boil until raw smell disappears, gently drop fresh fish pieces, cook for 5 minutes and remove from heat.",
  },
  {
    category: "Biryani Masala",
    name: "Briyani Masala Powder",
    shortDescription: "Exotic and aromatic royal spice mix for restaurant-quality dum biryani and festive rice dishes.",
    description: "Crafted from a secret heritage recipe, RR MASALA Briyani Masala Powder infuses long-grain basmati rice and tender meats with an enchanting aroma. Every batch balances warm spices like cardamom, cloves, cinnamon, star anise, and high-grade chillies to deliver an unforgettable celebratory feast experience.",
    ingredients: ["Corn flour", "Maida", "Garam masala", "Chilli", "Coriander", "Cumin seeds", "Ajwain", "Salt", "Cardamom", "Cloves", "Cinnamon"],
    netQuantity: "250 g",
    price: 75,
    compareAtPrice: 95,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Add 1-2 tablespoons of Briyani Masala during the onion-sowing and meat-searing stage along with curd and mint leaves for authentic aroma and flavor depth.",
  },
  {
    category: "Rasam",
    name: "Rasam Powder",
    shortDescription: "Traditional soothing pepper and cumin rasam powder for instant digestive comfort and classic meals.",
    description: "Experience wholesome warmth with RR MASALA Rasam Powder. Made with premium black peppercorns, aromatic cumin, sun-dried red chillies, and asafoetida, this blend provides instant relief from colds and acts as a perfect digestive accompaniment after heavy meals.",
    ingredients: ["Red chilli", "Pepper", "Cumin seeds", "Asafoetida", "Toor dal", "Coriander"],
    netQuantity: "250 g",
    price: 225,
    compareAtPrice: 250,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Boil extracted tamarind water with crushed tomatoes, garlic, salt, and 1-2 teaspoons of Rasam Powder. Temper with mustard seeds, cumin, and fresh coriander leaves in ghee.",
  },
  {
    category: "Sambar",
    name: "Samabr Powder",
    shortDescription: "Authentic traditional South Indian Sambar powder for thick, fragrant, and hotel-style sambar.",
    description: "RR MASALA Sambar Powder is the crown jewel of South Indian kitchens. Prepared by roasting whole coriander seeds, pungent red chillies, aromatic cumin, and golden fenugreek to absolute perfection, it gives your dal and vegetable sambar an irresistible fragrance and rich body.",
    ingredients: ["Coriander", "Red chilli", "Cumin seeds", "Fenugreek", "Turmeric", "Toor dal"],
    netQuantity: "250 g",
    price: 125,
    compareAtPrice: 150,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Cook boiled toor dal with vegetables of your choice. Add 2 tablespoons of Sambar Powder, tamarind pulp, and salt. Boil for 10 minutes and garnish with fresh coriander leaves and mustard tempering.",
  },
  {
    category: "Idly Podi",
    name: "Idly Podi (Ellu / Karuvepillai / Paruppu)",
    shortDescription: "Crunchy, flavorful gun powder condiment packed with roasted pulses, sesame, and curry leaves.",
    description: "Enhance your breakfast idlis and crispy dosas with RR MASALA Idly Podi. Roasted to a nutty perfection with nutrient-dense lentils, sesame seeds, and curry leaves, it creates a heavenly accompaniment when mixed generously with gingelly oil or hot ghee.",
    ingredients: ["Chana dal", "Urad dal", "Red chilli", "Curry leaves", "Sesame", "Salt", "Asafoetida"],
    netQuantity: "200 g",
    price: 90,
    compareAtPrice: 110,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Take required quantity of Idly Podi in a small bowl, pour pure sesame oil or melted ghee over it, mix into a paste, and serve alongside hot idlis or dosas.",
  },
  {
    category: "Paruppu Podi",
    name: "Paruppu Podi",
    shortDescription: "Homestyle roasted lentil powder designed for comforting hot rice meals mixed with ghee.",
    description: "RR MASALA Paruppu Podi is a comforting classic made from roasted toor dal, aromatic garlic, black pepper, and cumin. Mixed with piping hot white rice and a generous dollop of country ghee, it offers pure, nostalgic comfort food at its finest.",
    ingredients: ["Toor dal", "Cumin seeds", "Pepper", "Garlic", "Salt", "Dry red chilli"],
    netQuantity: "200 g",
    price: 85,
    compareAtPrice: 105,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix 2 tablespoons of Paruppu Podi with hot cooked rice and a teaspoon of pure cow ghee or butter. Enjoy immediately.",
  },
  {
    category: "Perungayam",
    name: "Perungayam Powder (Asafoetida) and Katti",
    shortDescription: "Pure, potent, and aromatic asafoetida powder and solid lumps for superior culinary digestion and flavor.",
    description: "RR MASALA Perungayam delivers unmatched purity and pungent aroma essential for authentic Indian tempering (tadka). It aids digestion, eliminates bloating, and elevates dals, rasams, and potato fries with traditional depth.",
    ingredients: ["Edible gum", "Asafoetida", "Maida", "Turmeric"],
    netQuantity: "100 g",
    price: 60,
    compareAtPrice: 75,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Add a pinch directly into hot oil/ghee during initial tempering or dissolve in warm water before adding to dal and rasam preparations.",
  },
  {
    category: "Fry Powders",
    name: "Chicken fry Corn Powder (Both Veg and Non veg fry Items)",
    description: "RR MASALA Chicken Fry Corn Powder is an expert formulation designed to create ultra-crispy, golden, and restaurant-style fried items for both vegetarian snacks (like gobi and mushroom) and non-vegetarian treats (chicken, fish, prawns). Corn flour base ensures a crunchy exterior while locking in internal juices.",
    ingredients: ["Corn flour", "Maida", "Garam masala", "Chilli", "Coriander", "Cumin", "Salt"],
    netQuantity: "250 g",
    price: 75,
    compareAtPrice: 90,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Coat cleaned chicken pieces or vegetables with lemon juice, ginger-garlic paste, salt, and Chicken Fry Corn Powder. Let rest for 20 minutes and deep fry in medium-hot oil until crispy.",
    shortDescription: "Crispy and spicy corn-flour based coating mix for mouth-watering vegetarian and non-vegetarian fries."
  },
  {
    category: "Puliyotharai",
    name: "Puliyotharai paste 150G (Tamarind Rice)",
    shortDescription: "Ready-to-mix traditional tamarind rice paste loaded with native spices, sesame oil, and peanuts.",
    description: "Enjoy temple-style Puliyotharai in minutes with RR MASALA Tamarind Rice Paste. Prepared by simmering aged tamarind pulp in pure gingelly oil with roasted peanuts, mustard, dried chillies, and authentic spice powders.",
    ingredients: ["Tamarind", "Turmeric", "Red chilli", "Fenugreek", "Asafoetida", "Green chilli", "Curry leaves", "Oil", "Salt", "Peanuts"],
    netQuantity: "140 g",
    price: 35,
    compareAtPrice: 45,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix 2-3 tablespoons of Puliyotharai paste thoroughly with 1 bowl of cooked, cooled rice along with a spoonful of raw sesame oil. Rest for 30 minutes before serving.",
  },
  {
    category: "Pickles",
    name: "Lemon Pickle",
    shortDescription: "Zesty, sun-ripened traditional lemon pickle crafted with aromatic spices and cold-pressed oil.",
    description: "RR MASALA Lemon Pickle is crafted from handpicked juicy lemons cured naturally under sunlight with traditional spices, fenugreek, and salt. It offers an exhilarating sour and spicy punch that transforms simple curd rice into a feast.",
    ingredients: ["Lemon", "Red chilli", "Asafoetida", "Fenugreek", "Salt", "Gingelly oil"],
    netQuantity: "100 g",
    price: 35,
    compareAtPrice: 45,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Serve as a traditional condiment side-dish with rice, chapati, rotis, and tiffin varieties using a clean, dry spoon.",
  },
  {
    category: "Pickles",
    name: "Mango Pickle",
    shortDescription: "Traditional raw mango pickle spiced with fiery red chilli powder and cold-pressed sesame oil.",
    description: "Made from crunchy raw green mangoes harvested at peak season, RR MASALA Mango Pickle brings authentic homestyle tanginess to your dining table. Preserved with natural spices and high-grade edible oils.",
    ingredients: ["Raw mango", "Red chilli powder", "Mustard", "Fenugreek", "Sesame oil", "Salt"],
    netQuantity: "100 g",
    price: 35,
    compareAtPrice: 45,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Use as an accompaniment with meals. Ensure no moisture touches the pickle to extend shelf life.",
  },
  {
    category: "Pickles",
    name: "Garlic Pickle",
    shortDescription: "Piquant and immunity-boosting garlic clove pickle marinated in rich spices and gingelly oil.",
    description: "RR MASALA Garlic Pickle features plump garlic cloves infused with rich spices, tamarind, and cold-pressed sesame oil. Known for its distinct flavor and traditional health benefits, it's a gourmet favorite.",
    ingredients: ["Garlic", "Red chilli", "Tamarind", "Gingelly oil", "Salt", "Mustard"],
    netQuantity: "100 g",
    price: 45,
    compareAtPrice: 60,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Enjoy in small portions with hot rice, idli, dosa, or paratha.",
  },
  {
    category: "Pickles",
    name: "Narthangai Pickle (Citron)",
    shortDescription: "Medicinal and aromatic wild citron (narthangai) pickle prepared in traditional South Indian style.",
    description: "RR MASALA Narthangai Pickle is prized for its unique citrus aroma and traditional digestive properties. Pickled with care using rock salt and select spices.",
    ingredients: ["Citron", "Red chilli", "Asafoetida", "Salt", "Gingelly oil"],
    netQuantity: "100 g",
    price: 35,
    compareAtPrice: 45,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Serve as a classic side dish with curd rice or meals.",
  },
  {
    category: "Pickles",
    name: "Kolumichangai Pickle (Citrus maxima)",
    shortDescription: "Exotic pomelo (kolumichangai) fruit pickle prepared with traditional spices and pure oil.",
    description: "RR MASALA Kolumichangai Pickle offers a delightful sweet-sour-spicy profile derived from premium Citrus maxima fruit segments cured with authentic spices.",
    ingredients: ["Citrus maxima", "Red Chilli", "Asafoetida", "Salt", "Gingelly oil"],
    netQuantity: "100 g",
    price: 35,
    compareAtPrice: 45,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Pair with rice dishes and traditional Indian meals.",
  },
  {
    category: "Vadagam",
    name: "Arisi Vadagam",
    shortDescription: "Crispy sun-dried rice vadagam fritters for traditional South Indian lunch accompaniments.",
    description: "Handcrafted sun-dried rice fritters made from quality rice batter, cumin, and green chillies. Expands into crispy, crunchy bites when fried.",
    ingredients: ["Rice flour", "Cumin", "Green chilli", "Salt"],
    netQuantity: "200 g",
    price: 80,
    compareAtPrice: 100,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Deep fry in hot cooking oil until golden and crispy. Serve alongside sambar rice or rasam rice.",
  },
  {
    category: "Vadagam",
    name: "Javarisi Vadagam (Green chilli / Red chilli / Garlic / Cumin-Jeera)",
    shortDescription: "Traditional sago (javarisi) sun-dried fry-ums infused with aromatic spices and chillies.",
    description: "Delicate and crunchy sago-based sun-dried vadagam prepared with natural ingredients. Melts in your mouth while delivering satisfying crispness.",
    ingredients: ["Sago (Javarisi)", "Green chilli", "Cumin", "Salt"],
    netQuantity: "200 g",
    price: 80,
    compareAtPrice: 100,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Fry in hot oil on medium heat until fluffy and crispy.",
  },
  {
    category: "Vadagam",
    name: "Onion Vadagam",
    shortDescription: "Essential seasoning sun-dried onion vadagam balls for authentic kulambu tempering.",
    description: "Traditional small onion and garlic vadagam balls sun-dried with castor oil and aromatic herbs, indispensable for authentic South Indian kuzhambu seasoning.",
    ingredients: ["Small onion", "Garlic", "Mustard", "Cumin", "Fenugreek", "Curry leaves", "Castor oil", "Salt"],
    netQuantity: "200 g",
    price: 90,
    compareAtPrice: 110,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Crack into hot oil first before pouring kuzhambu ingredients to release incredible aroma.",
  },
  {
    category: "Papad",
    name: "Papad Items",
    shortDescription: "Crispy and light traditional papad made from superior quality urad dal flour and spices.",
    description: "RR MASALA Papad items are hygienically prepared using finest urad dal flour, leavening agents, and spices. Can be roasted or fried.",
    ingredients: ["Urad dal flour", "Rice flour", "Salt", "Edible oil", "Leavening agent"],
    netQuantity: "200 g",
    price: 70,
    compareAtPrice: 85,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Roast directly over an open flame or deep fry in hot oil until crisp.",
  },
  {
    category: "Traditional Powders",
    name: "Shikkai Powder",
    shortDescription: "Natural herbal hair wash powder made with shikakai, green gram, and nourishing botanical herbs.",
    description: "RR MASALA Shikkai Powder is a 100% natural hair cleanser formulated with sun-dried shikakai pods, green gram, hibiscus, and fenugreek seeds to naturally clean and condition hair.",
    ingredients: ["Shikakai", "Green gram", "Fenugreek", "Hibiscus", "Neem leaves"],
    netQuantity: "100 g",
    price: 65,
    compareAtPrice: 80,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix powder with warm water to form a smooth paste, apply on wet hair and scalp, massage gently, and rinse thoroughly with water.",
  },
  {
    category: "Ready Mix",
    name: "Mullu Murungai Readymix Powder (Pankarapam Bhairi)",
    description: "Nutritious and medicinal drumstick leaves (mullu murungai) instant readymix powder for healthy traditional snacks.",
    ingredients: ["Rice flour", "Mullu murungai leaves extract", "Spices", "Salt", "Roasted gram"],
    netQuantity: "200 g",
    price: 95,
    compareAtPrice: 120,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix with water and chopped onions to prepare batter for nutritious traditional vadai or dosai items.",
    shortDescription: "Healthy herbal instant readymix powder infused with nutritious drumstick tree leaf extracts."
  },
  {
    category: "Ready Mix",
    name: "Coconut ReadyMix Powder (Nalar Bhairi)",
    shortDescription: "Instant coconut chutney readymix powder for fast and delicious breakfast accompaniments.",
    description: "RR MASALA Coconut Readymix powder lets you prepare fresh, aromatic coconut chutney in seconds without grating fresh coconuts.",
    ingredients: ["Desiccated coconut powder", "Roasted gram", "Green chilli", "Salt", "Asafoetida"],
    netQuantity: "200 g",
    price: 95,
    compareAtPrice: 120,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix required powder with warm water, let rest for 2 minutes, and temper with mustard seeds and curry leaves.",
  },
  {
    category: "Other Traditional Products",
    name: "Uppukandam",
    description: "Authentic sun-dried salted meat delicacy prepared in traditional rural style for rich culinary preparations.",
    ingredients: ["Mutton pieces", "Salt", "Turmeric", "Spices"],
    netQuantity: "100 g",
    price: 150,
    compareAtPrice: 180,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Soak briefly in water if required, then shallow fry in oil or use in traditional village gravies.",
    shortDescription: "Traditional sun-dried salted meat delicacy for authentic rural non-veg recipes."
  },
  {
    category: "Other Traditional Products",
    name: "Uppukandam stick (kudal)",
    shortDescription: "Specialized traditional sun-dried salted mutton intestine sticks for gourmet rural dishes.",
    description: "Authentic countryside delicacy prepared by sun-drying spiced and salted sheep intestine strips.",
    ingredients: ["Mutton intestine", "Salt", "Spices", "Turmeric"],
    netQuantity: "100 g",
    price: 160,
    compareAtPrice: 190,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Fry crisp in oil or simmer in spicy country gravies.",
  },
  {
    category: "Other Traditional Products",
    name: "Aruvadu",
    shortDescription: "Traditional heirloom artisanal food product prepared with authentic regional heritage ingredients.",
    description: "RR MASALA Aruvadu represents time-tested rural culinary heritage, carefully prepared to preserve authentic flavours and nutritional benefits.",
    ingredients: ["Traditional ingredients", "Salt", "Spices", "Edible oil"],
    netQuantity: "100 g",
    price: 110,
    compareAtPrice: 135,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Use according to traditional culinary practices.",
  },
  {
    category: "Ready Mix",
    name: "Adai dosai Ready Mix Powder",
    description: "Protein-packed multi-lentil instant Adai dosai readymix powder for wholesome, crispy traditional dinners.",
    ingredients: ["Rice", "Toor dal", "Chana dal", "Moong dal", "Dry red chillies", "Asafoetida", "Salt", "Cumin"],
    netQuantity: "500 g",
    price: 110,
    compareAtPrice: 135,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix Adai mix with water, finely chopped onions, curry leaves, and coriander to form batter. Pour thick dosas on hot tawa and cook with oil/ghee.",
    shortDescription: "Nutritious multi-dal instant adai dosai mix packed with protein and wholesome spices."
  },
  {
    category: "Ready Mix",
    name: "Rava dosai Ready Mix Powder",
    description: "Instant crispy semolina (rava) dosai mix pre-blended with spices, cumin, and pepper for quick breakfast.",
    ingredients: ["Semolina (Rava)", "Maida", "Cumin", "Pepper", "Ginger powder", "Salt", "Curry leaves"],
    netQuantity: "500 g",
    price: 100,
    compareAtPrice: 125,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix powder with adequate water to form a thin watery batter. Pour over hot seasoned tawa for lace-like crispy rava dosai.",
    shortDescription: "Quick and easy instant crispy rava dosa mix with aromatic spices."
  },
  {
    category: "Ready Mix",
    name: "Murukku Ready Mix Powder",
    shortDescription: "Instant crunchy murukku snack mix made with roasted rice flour, sesame, and butter flavor.",
    description: "Create festive-quality crunchy murukku effortlessly with RR MASALA Murukku Readymix Powder. Pre-blended with roasted gram flour, sesame, and spices.",
    ingredients: ["Rice flour", "Roasted gram flour", "Sesame", "Cumin", "Butter", "Salt", "Asafoetida"],
    netQuantity: "500 g",
    price: 105,
    compareAtPrice: 130,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Knead powder with water and hot oil into soft dough, press into murukku shapes using mould, and deep fry until golden.",
  },
  {
    category: "Ready Mix",
    name: "Idiyappam Ready Mix Powder",
    description: "Soft and smooth instant string hopper (idiyappam) flour blend made from premium roasted rice.",
    ingredients: ["Roasted rice flour", "Salt", "Edible oil"],
    netQuantity: "500 g",
    price: 95,
    compareAtPrice: 120,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Mix flour with boiling water and salt, knead into soft dough, press through idiyappam press onto plates, and steam for 8 minutes.",
    shortDescription: "Super-fine roasted rice flour blend for soft, fluffy string hoppers."
  },
  {
    category: "Ready Mix",
    name: "Puttu Ready Mix Powder",
    description: "Traditional Kerala-style cylindrical puttu breakfast flour blend for light, fluffy steamed cakes.",
    ingredients: ["Parboiled rice flour", "Salt", "Water"],
    netQuantity: "500 g",
    price: 90,
    compareAtPrice: 115,
    fssaiLicenseNo: "FSSL 22419576000063",
    howToUse: "Moisten flour evenly with water until crumbly. Layer with grated coconut in puttu maker and steam until cooked.",
    shortDescription: "Authentic roasted rice flour blend for soft, traditional breakfast puttu."
  },
];

/* =========================================================================
   IMAGE HELPER
   ========================================================================= */

function createImageUrl(index) {
  return SPICE_IMAGES[index % SPICE_IMAGES.length];
}

/* =========================================================================
   STOCK GENERATOR
   ========================================================================= */

function createInitialStock() {
  return Math.floor(Math.random() * 200) + 1;
}

/* =========================================================================
   SEED MAIN SCRIPT
   ========================================================================= */

async function run() {
  try {
    await connectDB();

    console.log("MongoDB connected successfully.");

    /* ---------------------------------------------------------------------
       ADMIN USER SETUP
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

    console.log("Old catalog cleared successfully.");

    /* ---------------------------------------------------------------------
       CREATE CATEGORIES
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
       CREATE DETAILED PRODUCTS
       --------------------------------------------------------------------- */

    const productDocuments = originalProducts.map((item, index) => {
      const img = createImageUrl(index);
      const sku = `RRM-${String(index + 1).padStart(4, "0")}`;
      const price = item.price;
      const compareAtPrice = item.compareAtPrice;
      const stock = createInitialStock();

      return {
        name: item.name,
        slug: slugify(`${item.name}-${sku}`),
        sku,
        shortDescription: item.shortDescription,
        description: item.description,
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
        stock,
        isActive: true,
        isFeatured: index < 8,
        isBestSeller: index >= 8 && index < 15,
        isNewArrival: index >= 15,
        tags: [
          item.category,
          "RR MASALA",
          "Indian Food",
          "South Indian",
          "Traditional Food",
          "Authentic Spices"
        ],
        countryOfOrigin: "India",
        isExportable: true,
        ingredients: item.ingredients || [],
        allergens: ["Processed in a facility that handles nuts and sesame seeds."],
        nutrition: {
          energy: "385 kcal",
          protein: "11.2g",
          carbohydrates: "58.4g",
          fat: "12.5g",
          dietaryFiber: "14.2g"
        },
        howToUse: item.howToUse || "Use as per traditional recipe instructions for authentic taste.",
        storageInstructions: "Store in a cool, dry place away from direct sunlight. Transfer contents into an airtight container immediately after opening.",
        shelfLife: "12 months from the date of packaging",
        hsnCode: "09109100",
        fssaiLicenseNo: item.fssaiLicenseNo || "FSSL 22419576000063",
        manufacturerName: "RR MASALA",
        manufacturerAddress: "NO 386/9 CAS NAGAR, AVANIYAPURAM, MADURAI-625012, TN, INDIA.",
        packerName: "RR MASALA",
        packerAddress: "NO 386/9 CAS NAGAR, AVANIYAPURAM, MADURAI-625012, TN, INDIA.",
        netQuantity: item.netQuantity || "200 g",
        consumerCareEmail: "support@rrmasala.com",
        consumerCarePhone: "9655812230",
        legalMetrologyDeclaration: "Packed in compliance with Legal Metrology Packaged Commodities Rules.",
        exportNotes: "Certified food-grade packaging suitable for domestic and international export standards.",
        returnable: true,
        cancellationWindowHours: 24,
        returnWindowDays: 7,
        returnShippingDeduction: true,
        returnPolicyText: "Eligible returns are accepted within 7 days of delivery in unopened original packaging.",
      };
    });

    await Product.insertMany(productDocuments);

    /* ---------------------------------------------------------------------
       BANNERS SETUP
       --------------------------------------------------------------------- */

    await Banner.create([
      {
        title: "Authentic Indian Masalas & Traditional Foods",
        subtitle: "Traditional South Indian flavours delivered across India and internationally.",
        image: SPICE_IMAGES[0],
        buttonText: "Shop Products",
        buttonLink: "/products",
        displayOrder: 1,
        active: true,
      },
      {
        title: "Pickles, Podis & Ready Mixes",
        subtitle: "Explore RR MASALA's traditional food collection.",
        image: SPICE_IMAGES[1],
        buttonText: "Explore Products",
        buttonLink: "/products",
        displayOrder: 2,
        active: true,
      },
    ]);

    console.log(
      `Successfully seeded ${productDocuments.length} detailed RR MASALA products with comprehensive descriptions.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Seed Failed:", error);
    process.exit(1);
  }
}

run();