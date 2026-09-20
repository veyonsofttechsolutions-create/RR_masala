# RR MASALA  Image Mapping

The project ships with **local, lightweight SVG product artwork** so the catalogue never renders blank image areas when the original source photos are not present. These SVGs are safe local assets and can be replaced by real product photographs without changing the product UI.

## Built-in product assets

| Product | Local image |
|---|---|
| Kulambu Powder | `client/public/products/kulambu-powder.svg` |
| Mutton Kulambu Powder | `client/public/products/mutton-kulambu-powder.svg` |
| Fish Kulambu Powder | `client/public/products/fish-kulambu-powder.svg` |
| Briyani Masala Powder | `client/public/products/biryani-masala.svg` |
| Rasam Powder | `client/public/products/rasam-powder.svg` |
| Sambar Powder | `client/public/products/sambar-powder.svg` |
| Idly Podi | `client/public/products/idly-podi.svg` |
| Paruppu Podi | `client/public/products/paruppu-podi.svg` |
| Perungayam | `client/public/products/perungayam.svg` |
| Chicken Fry Corn Powder | `client/public/products/chicken-fry-corn-powder.svg` |
| Puliyotharai Paste | `client/public/products/puliyotharai-paste.svg` |
| Lemon Pickle | `client/public/products/lemon-pickle.svg` |
| Mango Pickle | `client/public/products/mango-pickle.svg` |
| Garlic Pickle | `client/public/products/garlic-pickle.svg` |
| Narthangai Pickle | `client/public/products/narthangai-pickle.svg` |
| Kolumichangai Pickle | `client/public/products/kolumichangai-pickle.svg` |
| Arisi Vadagam | `client/public/products/arisi-vadagam.svg` |
| Javarisi Vadagam | `client/public/products/javarisi-vadagam.svg` |
| Onion Vadagam | `client/public/products/onion-vadagam.svg` |
| Papad Items | `client/public/products/papad-items.svg` |
| Shikkai Powder | `client/public/products/shikkai-powder.svg` |
| Mullu Murungai ReadyMix | `client/public/products/mullu-murungai-readymix.svg` |
| Coconut ReadyMix | `client/public/products/coconut-readymix.svg` |
| Uppukandam | `client/public/products/uppukandam.svg` |
| Uppukandam Stick | `client/public/products/uppukandam-stick.svg` |
| Aruvadu | `client/public/products/aruvadu.svg` |
| Adai Dosai Ready Mix | `client/public/products/adai-dosai-readymix.svg` |
| Rava Dosai Ready Mix | `client/public/products/rava-dosai-readymix.svg` |
| Murukku Ready Mix | `client/public/products/murukku-readymix.svg` |
| Idiyappam Ready Mix | `client/public/products/idiyappam-readymix.svg` |
| Puttu Ready Mix | `client/public/products/puttu-readymix.svg` |

## Original supplied filenames

The requested source-image filenames included Unicode, spaces, parentheses and multilingual text. When those original files are available, normalize them to safe names and update `client/src/constants/productImageMap.js` while preserving the original filename-to-product relationship here.

Examples:

- `2-Minute Idli Podi Recipe _ Spicy South Indian Chutney Powder 🌶️.jpg` → Idly Podi → `client/public/products/idly-podi.jpg`
- `Biryani Masala.jpg` → Briyani Masala Powder → `client/public/products/biryani-masala.jpg`
- `Delhi Jama Masjid Style Chicken Fry _ दिल्ली जैसा फ्राइड चिकन _ Shaadi Wala Chicken Fry.jpg` → Chicken fry Corn Powder → `client/public/products/chicken-fry-corn-powder.jpg`
- `15 Platos de Sri Lanka_ Sabores y Recetas Emblemáticas.jpg` → product mapping to be confirmed when the source asset is supplied
- `Ari unda.jpg` → product mapping to be confirmed when the source asset is supplied
- `download (1).jpg`, `download (2).jpg`, `download (3).jpg` → product mapping to be confirmed when the source assets are supplied

## Replacement rule

If a real photograph exists, put it under `client/public/products/`, then change the product mapping to that filename. The UI automatically falls back to `placeholder.svg` if an image fails to load.
