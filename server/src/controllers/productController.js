import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { slugify } from "../utils/slug.js";

const MAX_LIMIT = 100;

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const cleanArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((x) => String(x).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
};

/**
 * Product payload normalisation.
 *
 * RR MASALA pricing rule:
 * - INR only
 * - No country-wise pricing
 * - No regional pricing
 */
const clean = (body = {}) => {
  const b = { ...body };

  // Never allow country/regional pricing.
  delete b.regionalPrices;
  delete b.countryPrices;
  delete b.pricesByCountry;
  delete b.currencyCode;

  // Force INR.
  b.currency = "INR";

  // Numeric fields.
  if (b.price !== undefined) {
    b.price = Math.max(0, toNumber(b.price));
  }

  if (b.compareAtPrice !== undefined) {
    b.compareAtPrice = Math.max(0, toNumber(b.compareAtPrice));
  }

  if (b.stock !== undefined) {
    b.stock = Math.max(0, Math.floor(toNumber(b.stock)));
  }

  if (b.lowStockThreshold !== undefined) {
    b.lowStockThreshold = Math.max(
      0,
      Math.floor(toNumber(b.lowStockThreshold, 10))
    );
  }

  if (b.weight !== undefined) {
    b.weight = Math.max(0, toNumber(b.weight));
  }

  // Arrays.
  if (b.tags !== undefined) {
    b.tags = cleanArray(b.tags);
  }

  if (b.ingredients !== undefined) {
    b.ingredients = cleanArray(b.ingredients);
  }

  if (b.allergens !== undefined) {
    b.allergens = cleanArray(b.allergens);
  }

  // Images.
  if (b.images !== undefined) {
    b.images = Array.isArray(b.images)
      ? b.images.map((x) => String(x).trim()).filter(Boolean)
      : [];
  }

  if (b.thumbnail !== undefined) {
    b.thumbnail = String(b.thumbnail || "").trim();
  }

  // Keep thumbnail aligned with the first product image.
  if (!b.thumbnail && b.images?.length) {
    b.thumbnail = b.images[0];
  }

  // SEO.
  if (b.seoTitle || b.seoDescription || b.seoKeywords) {
    b.seo = {
      title: String(b.seoTitle || "").trim(),
      description: String(b.seoDescription || "").trim(),
      keywords: cleanArray(b.seoKeywords),
    };
  }

  delete b.seoTitle;
  delete b.seoDescription;
  delete b.seoKeywords;

  // Never allow clients to modify system fields.
  delete b._id;
  delete b.__v;
  delete b.createdAt;
  delete b.updatedAt;

  return b;
};

const validateProductPayload = (b) => {
  const errors = [];

  if (!b.name?.trim()) {
    errors.push("Product name is required");
  }

  if (b.price !== undefined && b.price < 0) {
    errors.push("Product price cannot be negative");
  }

  if (b.compareAtPrice !== undefined && b.compareAtPrice < 0) {
    errors.push("MRP cannot be negative");
  }

  if (
    b.compareAtPrice !== undefined &&
    b.price !== undefined &&
    b.compareAtPrice > 0 &&
    b.compareAtPrice < b.price
  ) {
    errors.push("MRP cannot be lower than selling price");
  }

  if (b.stock !== undefined && b.stock < 0) {
    errors.push("Stock cannot be negative");
  }

  if (b.images && b.images.length > 20) {
    errors.push("Maximum 20 product images are allowed");
  }

  if (b.images?.some((url) => String(url).startsWith("data:"))) {
    errors.push("Product images must be stored as hosted image URLs, not base64 data");
  }

  if (b.returnWindowDays !== undefined && Number(b.returnWindowDays) < 0) {
    errors.push("Return window cannot be negative");
  }

  if (b.cancellationWindowHours !== undefined && Number(b.cancellationWindowHours) < 0) {
    errors.push("Cancellation window cannot be negative");
  }

  return errors;
};

/**
 * Public product listing.
 */
export async function list(req, res, next) {
  try {
    const {
      q,
      category,
      sort = "newest",
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      inStock,
      featured,
      bestSeller,
      newArrival,
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const requestedLimit = Math.max(1, Number(limit) || 20);
    const currentLimit = Math.min(requestedLimit, MAX_LIMIT);

    const filter = {
      isActive: true,
    };

    // Search.
    if (q?.trim()) {
      filter.$text = {
        $search: q.trim(),
      };
    }

    // Category.
    if (category?.trim()) {
      const c = await Category.findOne({
        $or: [
          { slug: category.trim() },
          { name: category.trim() },
        ],
      }).lean();

      if (!c) {
        return res.json({
          success: true,
          data: {
            items: [],
            page: currentPage,
            limit: currentLimit,
            total: 0,
            totalPages: 0,
          },
        });
      }

      filter.category = c._id;
    }

    // Price.
    const hasMin = minPrice !== undefined && minPrice !== "";
    const hasMax = maxPrice !== undefined && maxPrice !== "";

    if (hasMin || hasMax) {
      const priceFilter = {};

      if (hasMin) {
        priceFilter.$gte = Math.max(0, toNumber(minPrice));
      }

      if (hasMax) {
        priceFilter.$lte = Math.max(0, toNumber(maxPrice, 1e9));
      }

      filter.price = priceFilter;
    }

    // Availability.
    if (inStock === "true") {
      filter.stock = {
        $gt: 0,
      };
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (bestSeller === "true") {
      filter.isBestSeller = true;
    }

    if (newArrival === "true") {
      filter.isNewArrival = true;
    }

    const sortMap = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      name: { name: 1 },
      newest: { createdAt: -1 },
      popular: {
        purchaseCount: -1,
        isBestSeller: -1,
        createdAt: -1,
      },
    };

    const skip = (currentPage - 1) * currentLimit;

    const query = Product.find(filter);

    if (q?.trim()) {
      query.sort({
        score: {
          $meta: "textScore",
        },
      });
    } else {
      query.sort(sortMap[sort] || sortMap.newest);
    }

    const [items, total] = await Promise.all([
      query
        .skip(skip)
        .limit(currentLimit)
        .populate("category", "name slug")
        .lean(),

      Product.countDocuments(filter),
    ]);

    /*
     * Customer-facing stock rule:
     *
     * Never expose exact inventory count.
     * Only expose:
     *   In Stock
     *   Out of Stock
     */
    const publicItems = items.map((product) => {
      const {
        stock,
        purchaseCount,
        ...safeProduct
      } = product;

      return {
        ...safeProduct,
        inStock: Number(stock || 0) > 0,
        stockStatus: Number(stock || 0) > 0
          ? "in_stock"
          : "out_of_stock",
      };
    });

    return res.json({
      success: true,
      data: {
        items: publicItems,
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Public product details.
 */
export async function get(req, res, next) {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      stock,
      purchaseCount,
      ...safeProduct
    } = product;

    return res.json({
      success: true,
      data: {
        product: {
          ...safeProduct,
          inStock: Number(stock || 0) > 0,
          stockStatus: Number(stock || 0) > 0
            ? "in_stock"
            : "out_of_stock",
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin product list.
 *
 * Admin can see actual stock quantity.
 */
export async function adminList(req, res, next) {
  try {
    const items = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        items,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create product.
 */
export async function create(req, res, next) {
  try {
    const body = clean(req.body);

    const errors = validateProductPayload(body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
        errors,
      });
    }

    if (!body.slug && body.name) {
      body.slug = slugify(body.name);
    }

    body.currency = "INR";

    body.images = body.images || [];

    body.thumbnail =
      body.thumbnail ||
      body.images[0] ||
      "";

    /*
     * Product starts with zero purchases.
     * Actual purchaseCount must be incremented only
     * after successful order/payment.
     */
    if (body.purchaseCount === undefined) {
      body.purchaseCount = 0;
    }

    const product = await Product.create(body);

    return res.status(201).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update product.
 */
export async function update(req, res, next) {
  try {
    const body = clean(req.body);

    const errors = validateProductPayload(body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
        errors,
      });
    }

    body.currency = "INR";

    /*
     * Don't allow an arbitrary purchaseCount update
     * from the product form.
     */
    delete body.purchaseCount;

    /*
     * Don't allow the admin form to change the existing
     * purchase counter.
     */

    if (body.name && !body.slug) {
      body.slug = slugify(body.name);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Soft delete / deactivate product.
 */
export async function remove(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}