import { useEffect, useMemo, useRef, useState } from "react";
import { API } from "../api/http.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  Info,
  Link2,
  Loader2,
  Package,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  sku: "",
  category: "",
  subCategory: "",
  brand: "RR MASALA",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  discountPercentage: "",
  taxPercentage: 0,
  stock: 0,
  lowStockThreshold: 10,
  weight: 100,
  weightUnit: "g",
  images: [],
  thumbnail: "",
  tags: "",
  ingredients: "",
  allergens: "",
  nutrition: "",
  howToUse: "",
  storageInstructions:
    "Store in a cool, dry place away from direct sunlight. Keep the pack tightly closed after opening.",
  shelfLife: "Refer to product packaging.",
  manufacturingInfo: "",
  origin: "Tamil Nadu, India",
  packagingType: "Food-grade sealed pack",
  countryOfOrigin: "India", hsnCode: "", fssaiLicenseNo: "", manufacturerName: "", manufacturerAddress: "", packerName: "", packerAddress: "", importerName: "", importerAddress: "", netQuantity: "", consumerCareEmail: "", consumerCarePhone: "", legalMetrologyDeclaration: "", exportNotes: "", isExportable: true,
  variants: [],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  slug: "",
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: true,
  isActive: true,
};

function unwrap(response) {
  return response?.data?.data || response?.data || {};
}

function arrayValue(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function productToForm(product) {
  return {
    ...EMPTY_FORM,
    ...product,
    category:
      typeof product?.category === "object"
        ? product.category?._id || ""
        : product?.category || "",
    images: arrayValue(product?.images),
    tags: arrayValue(product?.tags).join(", "),
    ingredients: arrayValue(product?.ingredients).join(", "),
    allergens: arrayValue(product?.allergens).join(", "),
    nutrition:
      typeof product?.nutrition === "string"
        ? product.nutrition
        : product?.nutrition
        ? JSON.stringify(product.nutrition, null, 2)
        : "",
    seoTitle: product?.seo?.title || "",
    seoDescription: product?.seo?.description || "",
    seoKeywords: arrayValue(product?.seo?.keywords).join(", "),
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function dataUrlToFileName(dataUrl, index) {
  const mime =
    dataUrl.match(/^data:([^;]+);/)?.[1] ||
    "image/jpeg";
  const ext =
    mime.includes("webp")
      ? "webp"
      : mime.includes("png")
      ? "png"
      : "jpg";

  return `rr-masala-${index + 1}.${ext}`;
}

async function compressImage(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Only image files are supported.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Please choose an image smaller than 8 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(
    1,
    maxSide / Math.max(bitmap.width, bitmap.height)
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");
  context.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height
  );

  bitmap.close?.();

  return canvas.toDataURL("image/webp", 0.82);
}

export default function AdminProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(Boolean(id));

        const categoryPromise = API.get(
          "/categories/admin/all"
        );

        const productPromise = id
          ? API.get("/products/admin/all")
          : Promise.resolve(null);

        const [categoryResponse, productResponse] =
          await Promise.all([
            categoryPromise.catch(() => null),
            productPromise,
          ]);

        if (!active) return;

        const categoryPayload = categoryResponse
          ? unwrap(categoryResponse)
          : {};

        setCategories(categoryPayload.items || []);

        if (id) {
          const payload = unwrap(productResponse);
          const product = (payload.items || []).find(
            (item) => String(item._id) === String(id)
          );

          if (!product) {
            throw new Error("Product not found.");
          }

          setForm(productToForm(product));
        }
      } catch (requestError) {
        console.error("PRODUCT FORM LOAD ERROR:", requestError);
        if (active) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load product."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id]);

  const setField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
    setMessage("");
  };

  const calculatedDiscount = useMemo(() => {
    const price = Number(form.price);
    const mrp = Number(form.compareAtPrice);

    if (!price || !mrp || mrp <= price) return 0;

    return Math.round(((mrp - price) / mrp) * 100);
  }, [form.price, form.compareAtPrice]);

  const addImage = (value) => {
    const image = String(value || "").trim();
    if (!image) return;

    setForm((current) => {
      if (current.images.includes(image)) return current;

      return {
        ...current,
        images: [...current.images, image],
        thumbnail: current.thumbnail || image,
      };
    });

    setMessage("Image added.");
    setError("");
  };

  const removeImage = (index) => {
    setForm((current) => {
      const images = current.images.filter(
        (_, imageIndex) => imageIndex !== index
      );

      const removed =
        current.images[index];

      return {
        ...current,
        images,
        thumbnail:
          current.thumbnail === removed
            ? images[0] || ""
            : current.thumbnail,
      };
    });
  };

  const makeThumbnail = (index) => {
    setForm((current) => ({
      ...current,
      thumbnail: current.images[index] || "",
    }));
    setMessage("Thumbnail updated.");
  };

  const addUrlImage = () => {
    if (!urlInput.trim()) {
      setError("Paste an image URL first.");
      return;
    }

    try {
      new URL(urlInput.trim());
    } catch {
      setError("Please enter a valid image URL.");
      return;
    }

    addImage(urlInput);
    setUrlInput("");
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(
      (file) => file.type?.startsWith("image/")
    );

    if (!files.length) {
      setError("Please select JPG, PNG, WEBP or another image file.");
      return;
    }

    try {
      setError("");
      setMessage(`Processing ${files.length} image${files.length > 1 ? "s" : ""}…`);

      for (const file of files.slice(0, 6)) {
        const dataUrl = await compressImage(file);
        addImage(dataUrl);
      }

      setMessage("Device image(s) added successfully.");
    } catch (fileError) {
      setError(
        fileError?.message ||
          "Could not process the selected image."
      );
    }
  };

  const onFileChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const moveImage = (index, direction) => {
    setForm((current) => {
      const images = [...current.images];
      const next = index + direction;

      if (
        next < 0 ||
        next >= images.length
      ) {
        return current;
      }

      [images[index], images[next]] = [
        images[next],
        images[index],
      ];

      return {
        ...current,
        images,
        thumbnail:
          current.thumbnail === current.images[index]
            ? images[index]
            : current.thumbnail,
      };
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const name = form.name.trim();
    const sku = form.sku.trim();
    const price = Number(form.price);
    const mrp = Number(form.compareAtPrice || 0);
    const stock = Number(form.stock);

    if (!name) {
      setError("Product name is required.");
      return;
    }

    if (!sku) {
      setError("SKU is required.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (mrp && mrp < price) {
      setError("MRP / compare price cannot be lower than selling price.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError("Enter a valid stock quantity.");
      return;
    }

    if (!form.category) {
      setError("Please select a product category.");
      return;
    }

    if (!form.images.length) {
      setError("Add at least one product image.");
      return;
    }

    let nutrition = {};
    if (form.nutrition.trim()) {
      try {
        nutrition = JSON.parse(form.nutrition);
      } catch {
        nutrition = { notes: form.nutrition.trim() };
      }
    }

    const generatedSlug =
      form.slug.trim() ||
      slugify(`${name}-${sku}`);

    const payload = {
      name,
      slug: generatedSlug,
      sku,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      category: form.category,
      subCategory: form.subCategory.trim(),
      brand: form.brand.trim() || "RR MASALA",

      images: form.images,
      thumbnail:
        form.thumbnail ||
        form.images[0],

      price,
      compareAtPrice: mrp,
      discountPercentage:
        Number(form.discountPercentage) ||
        calculatedDiscount,
      taxPercentage:
        Number(form.taxPercentage) || 0,

      weight: Number(form.weight) || 0,
      weightUnit: form.weightUnit || "g",

      stock,
      lowStockThreshold:
        Number(form.lowStockThreshold) || 10,

      tags: arrayValue(form.tags),
      ingredients: arrayValue(form.ingredients),
      allergens: arrayValue(form.allergens),
      nutrition,

      howToUse: form.howToUse.trim(),
      storageInstructions:
        form.storageInstructions.trim(),
      shelfLife: form.shelfLife.trim(),
      manufacturingInfo:
        form.manufacturingInfo.trim(),
      origin: form.origin.trim(),
      packagingType:
        form.packagingType.trim(),

      variants: Array.isArray(form.variants)
        ? form.variants
        : [],

      seo: {
        title:
          form.seoTitle.trim() ||
          `${name} | RR MASALA`,
        description:
          form.seoDescription.trim() ||
          form.shortDescription.trim(),
        keywords: arrayValue(form.seoKeywords),
      },

      isFeatured: Boolean(form.isFeatured),
      isBestSeller: Boolean(form.isBestSeller),
      isNewArrival: Boolean(form.isNewArrival),
      isActive: Boolean(form.isActive),
    };

    try {
      setSaving(true);

      if (id) {
        await API.put(
          `/products/${id}`,
          payload
        );
      } else {
        await API.post(
          "/products",
          payload
        );
      }

      nav("/admin/products");
    } catch (requestError) {
      console.error("PRODUCT SAVE ERROR:", requestError);
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Could not save the product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="productEditorLoading">
        <div>
          <Loader2 className="spinEditor" size={25} />
          Loading product…
        </div>
      </main>
    );
  }

  return (
    <main className="productEditorV2">
      <style>{`
        .productEditorV2 {
          min-height: 100vh;
          background: #f5f6f8;
          color: #18181b;
          padding: 27px clamp(15px, 4vw, 55px) 70px;
        }

        .productEditorShell {
          max-width: 1180px;
          margin: 0 auto;
        }

        .editorTop {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 19px;
        }

        .editorBack {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #85888d;
          font-size: 8px;
          font-weight: 850;
          text-decoration: none;
          margin-bottom: 11px;
        }

        .editorBack:hover {
          color: #18181b;
        }

        .editorTop h1 {
          margin: 4px 0;
          font-size: clamp(25px, 3.5vw, 36px);
          letter-spacing: -.8px;
        }

        .editorTop p {
          margin: 0;
          color: #85888d;
          font-size: 9px;
        }

        .editorPreviewLink {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 37px;
          padding: 0 11px;
          border: 1px solid #e3e5e8;
          border-radius: 8px;
          background: #fff;
          color: #34363a;
          text-decoration: none;
          font-size: 8px;
          font-weight: 800;
        }

        .editorForm {
          display: grid;
          gap: 12px;
        }

        .editorSection {
          background: #fff;
          border: 1px solid #e5e7ea;
          border-radius: 14px;
          padding: 19px;
          box-shadow: 0 2px 9px rgba(20,20,20,.025);
        }

        .editorSectionHead {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .editorSectionIcon {
          width: 33px;
          height: 33px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: #fff4d7;
          color: #976800;
        }

        .editorSectionHead strong {
          display: block;
          font-size: 12px;
        }

        .editorSectionHead span {
          display: block;
          color: #909398;
          font-size: 7px;
          margin-top: 3px;
        }

        .editorGrid2,
        .editorGrid3 {
          display: grid;
          gap: 12px;
        }

        .editorGrid2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .editorGrid3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .editorLabel {
          display: grid;
          gap: 6px;
          margin-bottom: 12px;
          color: #66696f;
          font-size: 8px;
          font-weight: 800;
        }

        .editorLabel:last-child {
          margin-bottom: 0;
        }

        .editorInput,
        .editorTextarea,
        .editorSelect {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          border: 1px solid #dfe2e6;
          background: #fff;
          color: #202125;
          border-radius: 8px;
          outline: 0;
          padding: 10px 11px;
          font: inherit;
          font-size: 9px;
          font-weight: 500;
        }

        .editorInput,
        .editorSelect {
          min-height: 38px;
        }

        .editorTextarea {
          min-height: 94px;
          resize: vertical;
          line-height: 1.55;
        }

        .editorInput:focus,
        .editorTextarea:focus,
        .editorSelect:focus {
          border-color: #c89118;
          box-shadow: 0 0 0 3px rgba(200,145,24,.09);
        }

        .fieldHint {
          color: #999ca1;
          font-size: 7px;
          font-weight: 500;
          line-height: 1.45;
        }

        .mediaLayout {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(270px, .8fr);
          gap: 16px;
        }

        .dropZone {
          min-height: 180px;
          border: 1.5px dashed #d6c9b7;
          border-radius: 13px;
          background: #fffaf2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 20px;
          cursor: pointer;
          transition: .18s ease;
        }

        .dropZone:hover,
        .dropZone.dragging {
          border-color: #c18a19;
          background: #fff7e6;
          transform: translateY(-1px);
        }

        .dropIcon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #fff0c8;
          color: #936400;
          margin-bottom: 11px;
        }

        .dropZone strong {
          font-size: 10px;
        }

        .dropZone span {
          max-width: 300px;
          color: #8c8f94;
          font-size: 8px;
          line-height: 1.5;
          margin-top: 5px;
        }

        .urlBox {
          padding: 13px;
          border: 1px solid #eceef0;
          border-radius: 11px;
          background: #fafbfc;
        }

        .urlBoxTitle {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
          font-size: 9px;
          font-weight: 850;
        }

        .urlRow {
          display: flex;
          gap: 7px;
        }

        .urlRow .editorInput {
          flex: 1;
        }

        .smallPrimary {
          flex: 0 0 auto;
          min-height: 38px;
          padding: 0 11px;
          border: 0;
          border-radius: 8px;
          background: #18181b;
          color: #fff;
          cursor: pointer;
          font-size: 8px;
          font-weight: 850;
        }

        .imageList {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin-top: 13px;
        }

        .imageCard {
          min-width: 0;
          border: 1px solid #e4e6e9;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
        }

        .imagePreview {
          position: relative;
          height: 120px;
          background: #f8f7f4;
        }

        .imagePreview img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .imageIndex {
          position: absolute;
          left: 6px;
          top: 6px;
          padding: 4px 6px;
          border-radius: 5px;
          background: rgba(24,24,27,.78);
          color: #fff;
          font-size: 7px;
          font-weight: 850;
        }

        .thumbnailBadge {
          position: absolute;
          right: 6px;
          top: 6px;
          padding: 4px 6px;
          border-radius: 5px;
          background: #f6b71c;
          color: #21170c;
          font-size: 6px;
          font-weight: 950;
        }

        .imageActions {
          display: flex;
          gap: 4px;
          padding: 7px;
        }

        .imageAction {
          flex: 1;
          min-width: 0;
          min-height: 27px;
          border: 1px solid #e4e6e9;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          color: #66696f;
          font-size: 6px;
          font-weight: 800;
        }

        .imageAction.delete {
          color: #aa3d34;
        }

        .imageAction:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .checksGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .checkCard {
          min-height: 51px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px;
          border: 1px solid #e4e6e9;
          border-radius: 9px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 750;
        }

        .checkCard input {
          accent-color: #18181b;
        }

        .editorError,
        .editorMessage {
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 8px;
          font-weight: 700;
        }

        .editorError {
          border: 1px solid #f0d0cb;
          background: #fff1ef;
          color: #a34238;
        }

        .editorMessage {
          border: 1px solid #cfe7d7;
          background: #effaf3;
          color: #2d7d4e;
        }

        .editorFooter {
          position: sticky;
          bottom: 12px;
          z-index: 5;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 10px;
          border: 1px solid #e5e7ea;
          border-radius: 12px;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 35px rgba(20,20,20,.10);
        }

        .editorCancel,
        .editorSave {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 8px;
          padding: 0 15px;
          font-size: 9px;
          font-weight: 850;
          text-decoration: none;
          cursor: pointer;
        }

        .editorCancel {
          border: 1px solid #e1e3e6;
          background: #fff;
          color: #45474c;
        }

        .editorSave {
          border: 0;
          background: #18181b;
          color: #fff;
        }

        .editorSave:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .productEditorLoading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f5f6f8;
          color: #6d7075;
          font-size: 10px;
        }

        .productEditorLoading > div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spinEditor {
          animation: spinEditor .7s linear infinite;
        }

        @keyframes spinEditor {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 850px) {
          .mediaLayout {
            grid-template-columns: 1fr;
          }
          .imageList {
            grid-template-columns: repeat(3, 1fr);
          }
          .checksGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .editorTop {
            align-items: flex-start;
            flex-direction: column;
          }
          .editorPreviewLink {
            width: 100%;
            justify-content: center;
          }
          .editorGrid2,
          .editorGrid3 {
            grid-template-columns: 1fr;
          }
          .imageList {
            grid-template-columns: repeat(2, 1fr);
          }
          .editorSection {
            padding: 14px;
          }
          .urlRow {
            flex-direction: column;
          }
          .smallPrimary {
            width: 100%;
          }
          .editorFooter {
            bottom: 5px;
          }
          .editorCancel,
          .editorSave {
            flex: 1;
          }
        }

        @media (max-width: 390px) {
          .checksGrid {
            grid-template-columns: 1fr;
          }
          .imageList {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="productEditorShell">
        <header className="editorTop">
          <div>
            <Link to="/admin/products" className="editorBack">
              <ArrowLeft size={13} /> Products
            </Link>
            <h1>{id ? "Edit product" : "Add product"}</h1>
            <p>
              Create a complete catalogue record with pricing, stock, food
              details, SEO and product media.
            </p>
          </div>

          {id && (
            <Link
              className="editorPreviewLink"
              to={`/product/${form.slug}`}
              target="_blank"
            >
              <ExternalLink size={13} /> Preview storefront
            </Link>
          )}
        </header>

        {error && (
          <div className="editorError" style={{ marginBottom: 10 }}>
            {error}
          </div>
        )}

        {message && (
          <div className="editorMessage" style={{ marginBottom: 10 }}>
            {message}
          </div>
        )}

        <form className="editorForm" onSubmit={save}>
          <section className="editorSection">
            <div className="editorSectionHead">
              <div className="editorSectionIcon">
                <Package size={16} />
              </div>
              <div>
                <strong>General information</strong>
                <span>Core catalogue identity</span>
              </div>
            </div>

            <div className="editorGrid2">
              <label className="editorLabel">
                Product name *
                <input
                  className="editorInput"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setField("name", e.target.value)
                  }
                  placeholder="Example: Premium Sambar Powder"
                />
              </label>

              <label className="editorLabel">
                SKU *
                <input
                  className="editorInput"
                  required
                  value={form.sku}
                  onChange={(e) =>
                    setField(
                      "sku",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="RRM-001"
                />
              </label>
            </div>

            <div className="editorGrid3">
              <label className="editorLabel">
                Category *
                <select
                  className="editorSelect"
                  value={form.category}
                  onChange={(e) =>
                    setField("category", e.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="editorLabel">
                Subcategory
                <input
                  className="editorInput"
                  value={form.subCategory}
                  onChange={(e) =>
                    setField("subCategory", e.target.value)
                  }
                  placeholder="South Indian powders"
                />
              </label>

              <label className="editorLabel">
                Brand
                <input
                  className="editorInput"
                  value={form.brand}
                  onChange={(e) =>
                    setField("brand", e.target.value)
                  }
                />
              </label>
            </div>

            <label className="editorLabel">
              Tags
              <input
                className="editorInput"
                value={form.tags}
                onChange={(e) =>
                  setField("tags", e.target.value)
                }
                placeholder="sambar, masala, tamil, traditional"
              />
              <span className="fieldHint">
                Separate tags with commas.
              </span>
            </label>
          </section>

          <section className="editorSection">
            <div className="editorSectionHead">
              <div className="editorSectionIcon">
                <Info size={16} />
              </div>
              <div>
                <strong>Description</strong>
                <span>Customer-facing product copy</span>
              </div>
            </div>

            <label className="editorLabel">
              Short description
              <textarea
                className="editorTextarea"
                value={form.shortDescription}
                onChange={(e) =>
                  setField(
                    "shortDescription",
                    e.target.value
                  )
                }
                placeholder="A concise product description..."
              />
            </label>

            <label className="editorLabel">
              Full description
              <textarea
                className="editorTextarea"
                style={{ minHeight: 140 }}
                value={form.description}
                onChange={(e) =>
                  setField(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Detailed product information..."
              />
            </label>
          </section>

          <section className="editorSection">
            <div className="editorSectionHead">
              <div className="editorSectionIcon">
                <Package size={16} />
              </div>
              <div>
                <strong>Pricing & inventory</strong>
                <span>Commercial and stock controls</span>
              </div>
            </div>

            <div className="editorGrid3">
              <label className="editorLabel">
                Selling price *
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) =>
                    setField("price", e.target.value)
                  }
                />
              </label>

              <label className="editorLabel">
                MRP / Compare price
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(e) =>
                    setField(
                      "compareAtPrice",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="editorLabel">
                Discount %
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  max="100"
                  value={
                    form.discountPercentage ||
                    calculatedDiscount
                  }
                  onChange={(e) =>
                    setField(
                      "discountPercentage",
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <div className="editorGrid3">
              <label className="editorLabel">
                Stock
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setField("stock", e.target.value)
                  }
                />
              </label>

              <label className="editorLabel">
                Low stock threshold
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setField(
                      "lowStockThreshold",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="editorLabel">
                Tax %
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  max="100"
                  value={form.taxPercentage}
                  onChange={(e) =>
                    setField(
                      "taxPercentage",
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <div className="editorGrid2">
              <label className="editorLabel">
                Weight
                <input
                  className="editorInput"
                  type="number"
                  min="0"
                  value={form.weight}
                  onChange={(e) =>
                    setField("weight", e.target.value)
                  }
                />
              </label>

              <label className="editorLabel">
                Weight unit
                <select
                  className="editorSelect"
                  value={form.weightUnit}
                  onChange={(e) =>
                    setField("weightUnit", e.target.value)
                  }
                >
                  <option value="g">Gram (g)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="ml">Millilitre (ml)</option>
                  <option value="l">Litre (l)</option>
                  <option value="pcs">Pieces</option>
                </select>
              </label>
            </div>
          </section>

          <section className="editorSection">
            <div className="editorSectionHead">
              <div className="editorSectionIcon">
                <UploadCloud size={16} />
              </div>
              <div>
                <strong>Product media</strong>
                <span>
                  Two input methods: device upload or direct image URL
                </span>
              </div>
            </div>

            <div className="mediaLayout">
              <div>
                <div
                  className={`dropZone ${
                    dragging ? "dragging" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      fileRef.current?.click();
                    }
                  }}
                >
                  <div className="dropIcon">
                    <UploadCloud size={22} />
                  </div>
                  <strong>
                    Drop product images here
                  </strong>
                  <span>
                    Or click to choose from your device. Up to 6 images
                    at a time. Images are resized/compressed in the browser.
                  </span>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={onFileChange}
                  />
                </div>

                <div className="imageList">
                  {form.images.map((image, index) => (
                    <div className="imageCard" key={`${image}-${index}`}>
                      <div className="imagePreview">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          onError={(e) => {
                            e.currentTarget.style.opacity = "0.15";
                          }}
                        />
                        <span className="imageIndex">
                          #{index + 1}
                        </span>

                        {form.thumbnail === image && (
                          <span className="thumbnailBadge">
                            THUMBNAIL
                          </span>
                        )}
                      </div>

                      <div className="imageActions">
                        <button
                          type="button"
                          className="imageAction"
                          disabled={
                            form.thumbnail === image
                          }
                          onClick={() =>
                            makeThumbnail(index)
                          }
                        >
                          Thumbnail
                        </button>

                        <button
                          type="button"
                          className="imageAction"
                          disabled={index === 0}
                          onClick={() =>
                            moveImage(index, -1)
                          }
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          className="imageAction"
                          disabled={
                            index === form.images.length - 1
                          }
                          onClick={() =>
                            moveImage(index, 1)
                          }
                        >
                          →
                        </button>

                        <button
                          type="button"
                          className="imageAction delete"
                          onClick={() =>
                            removeImage(index)
                          }
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="urlBox">
                  <div className="urlBoxTitle">
                    <Link2 size={14} />
                    Add image by URL
                  </div>

                  <div className="urlRow">
                    <input
                      className="editorInput"
                      value={urlInput}
                      onChange={(e) =>
                        setUrlInput(e.target.value)
                      }
                      placeholder="https://cdn.example.com/product.jpg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addUrlImage();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="smallPrimary"
                      onClick={addUrlImage}
                    >
                      Add URL
                    </button>
                  </div>

                  <p className="fieldHint" style={{ margin: "9px 0 0" }}>
                    Use a direct public image URL. The URL must be
                    accessible by the storefront.
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    padding: 13,
                    borderRadius: 11,
                    background: "#f8f9fa",
                    border: "1px solid #eceef0",
                    color: "#7e8186",
                    fontSize: 8,
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ color: "#414348" }}>
                    Production note
                  </strong>
                  <br />
                  Device images are compressed to WebP data URLs so the
                  current JSON product API can accept them without a new
                  upload endpoint. For large-scale production, connect the
                  same UI to Cloudinary/S3 and store the returned CDN URL.
                </div>
              </div>
            </div>
          </section>

          <section className="editorSection">
            <div className="editorSectionHead">
              <div className="editorSectionIcon">
                <Info size={16} />
              </div>
              <div>
                <strong>Food details</strong>
                <span>Information customers need before purchase</span>
              </div>
            </div>

            <label className="editorLabel">
              Ingredients
              <input
                className="editorInput"
                value={form.ingredients}
                onChange={(e) =>
                  setField("ingredients", e.target.value)
                }
                placeholder="Coriander, cumin, chilli, pepper..."
              />
            </label>

            <label className="editorLabel">
              Allergens
              <input
                className="editorInput"
                value={form.allergens}
                onChange={(e) =>
                  setField("allergens", e.target.value)
                }
                placeholder="Milk, nuts, gluten (if applicable)"
              />
            </label>

            <label className="editorLabel">
              Nutrition
              <textarea
                className="editorTextarea"
                value={form.nutrition}
                onChange={(e) =>
                  setField("nutrition", e.target.value)
                }
                placeholder='Optional JSON: {"energy":"120 kcal","protein":"5g"}'
              />
            </label>

            <div className="editorGrid2">
              <label className="editorLabel">
                How to use / preparation
                <textarea
                  className="editorTextarea"
                  value={form.howToUse}
                  onChange={(e) =>
                    setField("howToUse", e.target.value)
                  }
                />
              </label>

              <label className="editorLabel">
                Storage instructions
                <textarea
                  className="editorTextarea"
                  value={form.storageInstructions}
                  onChange={(e) =>
                    setField(
                      "storageInstructions",
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <div className="editorGrid3">
              <label className="editorLabel">
                Shelf life
                <input
                  className="editorInput"
                  value={form.shelfLife}
                  onChange={(e) =>
                    setField("shelfLife", e.target.value)
                  }
                />
              </label>

              <label className="editorLabel">
                Origin
                <input
                  className="editorInput"
                  value={form.origin}
                  onChange={(e) =>
                    setField("origin", e.target.value)
                  }
                />
              </label>

              <label className="editorLabel">
                Packaging type
                <input
                  className="editorInput"
                  value={form.packagingType}
                  onChange={(e) =>
                    setField("packagingType", e.target.value)
                  }
                />
              </label>
            </div>

            <label className="editorLabel">
              Manufacturing / packing information
              <input
                className="editorInput"
                value={form.manufacturingInfo}
                onChange={(e) =>
                  setField(
                    "manufacturingInfo",
                    e.target.value
                  )
                }
              />
            </label>
          </section>

          <section className="editorSection">
            <div className="editorSectionHead">
              <div className="editorSectionIcon">
                <Link2 size={16} />
              </div>
              <div>
                <strong>SEO & storefront</strong>
                <span>Search-friendly product presentation</span>
              </div>
            </div>

            <div className="editorGrid2">
              <label className="editorLabel">
                Slug
                <input
                  className="editorInput"
                  value={form.slug}
                  onChange={(e) =>
                    setField(
                      "slug",
                      slugify(e.target.value)
                    )
                  }
                  placeholder="premium-sambar-powder"
                />
              </label>

              <label className="editorLabel">
                SEO title
                <input
                  className="editorInput"
                  value={form.seoTitle}
                  onChange={(e) =>
                    setField(
                      "seoTitle",
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <label className="editorLabel">
              SEO description
              <textarea
                className="editorTextarea"
                value={form.seoDescription}
                onChange={(e) =>
                  setField(
                    "seoDescription",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="editorLabel">
              SEO keywords
              <input
                className="editorInput"
                value={form.seoKeywords}
                onChange={(e) =>
                  setField(
                    "seoKeywords",
                    e.target.value
                  )
                }
                placeholder="sambar powder, masala, south indian"
              />
            </label>

            <div className="checksGrid">
              {[
                ["isFeatured", "Featured"],
                ["isBestSeller", "Best seller"],
                ["isNewArrival", "New arrival"],
                ["isActive", "Active"],
              ].map(([field, label]) => (
                <label className="checkCard" key={field}>
                  <input
                    type="checkbox"
                    checked={Boolean(form[field])}
                    onChange={(e) =>
                      setField(
                        field,
                        e.target.checked
                      )
                    }
                  />
                  {Boolean(form[field]) && (
                    <Check size={12} />
                  )}
                  {label}
                </label>
              ))}
            </div>
          </section>

          <div className="editorFooter">
            <Link
              className="editorCancel"
              to="/admin/products"
            >
              Cancel
            </Link>

            <button
              className="editorSave"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="spinEditor" size={14} />
              ) : (
                <Save size={14} />
              )}
              {saving
                ? "Saving..."
                : id
                ? "Update product"
                : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
