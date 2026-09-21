import { useEffect, useMemo, useState } from "react";
import { API } from "../api/http.js";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  Tags,
  TicketPercent,
  Users,
  X,
  Trash2,
} from "lucide-react";

const configs = {
  products: {
    title: "Products",
    endpoint: "/products/admin/all",
    fields: ["name", "sku", "price", "stock"],
    icon: Package,
  },
  orders: {
    title: "Orders",
    endpoint: "/orders/admin/all",
    fields: ["orderNumber", "orderStatus", "grandTotal"],
    icon: ShoppingBag,
  },
  customers: {
    title: "Customers",
    endpoint: "/users/admin/all",
    fields: ["name", "email", "mobile", "role"],
    icon: Users,
  },
  categories: {
    title: "Categories",
    endpoint: "/categories/admin/all",
    fields: ["name", "slug", "isActive"],
    icon: Tags,
  },
  banners: {
    title: "Banners",
    endpoint: "/admin/banners",
    fields: ["title", "active", "displayOrder"],
    icon: ImageIcon,
  },
  coupons: {
    title: "Coupons",
    endpoint: "/admin/coupons",
    fields: ["code", "type", "value", "isActive"],
    icon: TicketPercent,
  },
  returns: {
    title: "Returns",
    endpoint: "/orders/admin/all",
    fields: ["orderNumber", "returnStatus", "orderStatus"],
    icon: RotateCcw,
  },
};

const labels = {
  orderNumber: "Order",
  orderStatus: "Order status",
  grandTotal: "Total",
  isActive: "Status",
  active: "Status",
  displayOrder: "Order",
  returnStatus: "Return status",
};

function prettyLabel(field) {
  return (
    labels[field] ||
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
  );
}

function formatValue(value, field) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Active" : "Inactive";
  }

  if (field === "price" || field === "grandTotal") {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (field === "createdAt") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function statusField(field) {
  return [
    "orderStatus",
    "returnStatus",
    "role",
    "isActive",
    "active",
  ].includes(field);
}

function getImage(item) {
  if (!item) return "";
  return (
    item.thumbnail ||
    item.images?.[0] ||
    item.image ||
    item.imageUrl ||
    ""
  );
}

function StatusBadge({ value }) {
  if (typeof value === "boolean") {
    return (
      <span className={`managerStatus ${value ? "success" : "muted"}`}>
        <i /> {value ? "Active" : "Inactive"}
      </span>
    );
  }

  const text = String(value ?? "");
  if (!text) return <span>—</span>;

  const normalized = text.toLowerCase();
  let tone = "neutral";

  if (
    normalized.includes("delivered") ||
    normalized.includes("approved") ||
    normalized.includes("active") ||
    normalized === "admin"
  ) {
    tone = "success";
  } else if (
    normalized.includes("cancel") ||
    normalized.includes("reject") ||
    normalized.includes("return")
  ) {
    tone = "danger";
  } else if (
    normalized.includes("pending") ||
    normalized.includes("processing") ||
    normalized.includes("packed") ||
    normalized.includes("confirmed")
  ) {
    tone = "warning";
  } else if (normalized === "staff") {
    tone = "info";
  }

  return (
    <span className={`managerStatus ${tone}`}>
      <i />
      {text.replaceAll("_", " ")}
    </span>
  );
}

export default function AdminManager({ type }) {
  const config = configs[type] || configs.products;
  const Icon = config.icon;

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async (refresh = false) => {
    try {
      setError("");
      refresh ? setRefreshing(true) : setLoading(true);

      const response = await API.get(
        `${config.endpoint}${
          type === "products" ? "?page=1&limit=100" : ""
        }`
      );

      const payload =
        response?.data?.data || response?.data || {};

      setItems(
        payload.items ||
          payload.products ||
          payload.orders ||
          payload.users ||
          payload.categories ||
          payload.banners ||
          payload.coupons ||
          []
      );

      if (type === "products") {
        try {
          const categoryResponse = await API.get(
            "/categories/admin/all"
          );
          const categoryPayload =
            categoryResponse?.data?.data ||
            categoryResponse?.data ||
            {};
          setCategories(categoryPayload.items || []);
        } catch {
          setCategories([]);
        }
      }
    } catch (requestError) {
      console.error("ADMIN MANAGER ERROR:", requestError);
      setError(
        requestError?.response?.data?.message ||
          `Unable to load ${config.title.toLowerCase()}.`
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setSearch("");
    setStatusFilter("all");
    load();
  }, [type]);

  const categoryName = (product) => {
    const category = product?.category;
    if (typeof category === "object") {
      return category?.name || category?.slug || "—";
    }

    const found = categories.find(
      (item) =>
        String(item?._id) === String(category)
    );

    return found?.name || product?.subCategory || "—";
  };

  const filterOptions = useMemo(() => {
    if (type === "products") {
      return ["all", "active", "inactive", "low-stock"];
    }

    if (type === "orders") {
      return [
        "all",
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ];
    }

    return ["all"];
  }, [type]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        config.fields.some((field) =>
          String(item?.[field] ?? "")
            .toLowerCase()
            .includes(query)
        ) ||
        (type === "products" &&
          categoryName(item).toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (statusFilter === "all") return true;

      if (type === "products") {
        if (statusFilter === "active") return item.isActive !== false;
        if (statusFilter === "inactive") return item.isActive === false;
        if (statusFilter === "low-stock") {
          return (
            Number(item.stock || 0) <=
            Number(item.lowStockThreshold || 10)
          );
        }
      }

      if (type === "orders") {
        return (
          String(item.orderStatus || "").toLowerCase() ===
          statusFilter
        );
      }

      return true;
    });
  }, [
    items,
    search,
    statusFilter,
    config.fields,
    type,
    categories,
  ]);

  const deleteProduct = async (item) => {
    if (type !== "products") return;
    const name = item?.name || "this product";
    const confirmed = window.confirm(
      `Deactivate ${name}? It will be removed from the storefront but retained in the admin database.`
    );
    if (!confirmed) return;

    try {
      await API.delete(`/products/${item._id}`);
      setItems((current) =>
        current.map((product) =>
          String(product._id) === String(item._id)
            ? { ...product, isActive: false }
            : product
        )
      );
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Could not deactivate the product."
      );
    }
  };

  const getViewPath = (item) => {
    if (type === "orders") {
      return `/admin/orders/${item._id}`;
    }

    if (type === "products") {
      return `/admin/products/${item._id}/edit`;
    }

    return "#";
  };

  return (
    <main className="adminManagerV2">
      <style>{`
        .adminManagerV2 {
          min-height: 100vh;
          background: #f5f6f8;
          color: #18181b;
          padding: 27px clamp(15px, 3.5vw, 48px) 60px;
        }

        .managerShell {
          max-width: 1480px;
          margin: 0 auto;
        }

        .managerHeaderV2 {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 18px;
        }

        .managerBackV2 {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #85888d;
          font-size: 8px;
          font-weight: 850;
          text-decoration: none;
          margin-bottom: 12px;
        }

        .managerBackV2:hover {
          color: #18181b;
        }

        .managerHeadingV2 {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .managerTitleIconV2 {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #fff4d7;
          color: #986800;
          flex: 0 0 auto;
        }

        .managerEyebrowV2 {
          color: #96999e;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .managerHeadingV2 h1 {
          margin: 4px 0 3px;
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: -.7px;
        }

        .managerHeadingV2 p {
          margin: 0;
          color: #85888d;
          font-size: 9px;
        }

        .managerAddV2 {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 38px;
          padding: 0 12px;
          border-radius: 9px;
          background: #18181b;
          color: #fff;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }

        .managerToolbarV2 {
          background: #fff;
          border: 1px solid #e5e7ea;
          border-radius: 13px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 11px;
          box-shadow: 0 2px 8px rgba(20,20,20,.025);
        }

        .managerSearchV2 {
          height: 39px;
          flex: 1;
          min-width: 180px;
          max-width: 480px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 11px;
          background: #f7f8f9;
          border: 1px solid #e6e8eb;
          border-radius: 9px;
        }

        .managerSearchV2 svg {
          color: #96999e;
          flex: 0 0 auto;
        }

        .managerSearchV2 input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          font: inherit;
          font-size: 9px;
        }

        .managerSearchV2 button {
          border: 0;
          background: transparent;
          color: #898c91;
          cursor: pointer;
        }

        .managerFiltersV2 {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filterChipV2 {
          height: 33px;
          padding: 0 10px;
          border: 1px solid #e4e6e9;
          border-radius: 8px;
          background: #fff;
          color: #71747a;
          cursor: pointer;
          font: inherit;
          font-size: 8px;
          font-weight: 800;
          text-transform: capitalize;
        }

        .filterChipV2.active {
          background: #18181b;
          border-color: #18181b;
          color: #fff;
        }

        .managerToolsRightV2 {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .managerCountV2 {
          color: #85888d;
          font-size: 8px;
          font-weight: 750;
        }

        .managerRefreshV2 {
          height: 33px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #e4e6e9;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          font: inherit;
          font-size: 8px;
          font-weight: 800;
        }

        .refreshSpin {
          animation: managerSpin .7s linear infinite;
        }

        @keyframes managerSpin {
          to { transform: rotate(360deg); }
        }

        .managerErrorV2 {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          margin-bottom: 10px;
          border: 1px solid #f0d0cb;
          background: #fff1ef;
          color: #a34238;
          border-radius: 10px;
        }

        .managerErrorV2 span {
          flex: 1;
          font-size: 8px;
        }

        .managerErrorV2 button {
          border: 0;
          background: #fff;
          border-radius: 6px;
          padding: 6px 8px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 800;
        }

        .managerPanelV2 {
          background: #fff;
          border: 1px solid #e5e7ea;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(20,20,20,.025);
        }

        .managerTableWrapV2 {
          overflow-x: auto;
        }

        .managerTableV2 {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        .managerTableV2 th {
          padding: 12px 15px;
          text-align: left;
          background: #fafbfc;
          color: #888b90;
          border-bottom: 1px solid #eceef0;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .8px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .managerTableV2 td {
          padding: 11px 15px;
          border-bottom: 1px solid #eef0f2;
          color: #484b50;
          font-size: 8px;
          vertical-align: middle;
        }

        .managerTableV2 tbody tr:hover {
          background: #fcfcfd;
        }

        .productCellV2 {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 210px;
        }

        .productThumbV2 {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          border-radius: 9px;
          overflow: hidden;
          border: 1px solid #ece6de;
          background: #faf7f1;
          display: grid;
          place-items: center;
        }

        .productThumbV2 img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .productThumbFallbackV2 {
          color: #a08b72;
        }

        .productCellV2 strong {
          display: block;
          color: #232428;
          font-size: 9px;
          max-width: 270px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .productCellV2 span {
          display: block;
          margin-top: 3px;
          color: #96999e;
          font-size: 7px;
        }

        .skuV2 {
          background: #f3f4f5;
          padding: 4px 6px;
          border-radius: 5px;
          font-size: 7px;
        }

        .managerStatus {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 7px;
          border-radius: 6px;
          text-transform: capitalize;
          white-space: nowrap;
          font-size: 7px;
          font-weight: 850;
        }

        .managerStatus i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .managerStatus.success { background: #edf8f1; color: #2b8050; }
        .managerStatus.warning { background: #fff6df; color: #9a6900; }
        .managerStatus.danger { background: #fff0ee; color: #a43d34; }
        .managerStatus.info { background: #edf4ff; color: #466f9f; }
        .managerStatus.neutral,
        .managerStatus.muted { background: #f0f1f2; color: #777a80; }

        .managerActionGroupV2 { display:flex; align-items:center; gap:6px; }
        .deleteButtonV2 { width:32px; height:32px; border:1px solid #f0d7d7; border-radius:8px; background:#fff7f7; color:#b42318; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
        .deleteButtonV2:hover { background:#feecec; border-color:#efb8b8; }
        .viewButtonV2 {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          border-radius: 7px;
          background: #f6f3e5;
          color: #292a2d;
          text-decoration: none;
          font-size: 7px;
          font-weight: 850;
        }

        .viewButtonV2:hover {
          background: #eee9d2;
        }

        .managerEmptyV2 {
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          gap: 7px;
          padding: 30px;
        }

        .managerEmptyIconV2 {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          background: #fff4d7;
          color: #9a6900;
        }

        .managerEmptyV2 h3 {
          margin: 4px 0 0;
          font-size: 13px;
        }

        .managerEmptyV2 p {
          max-width: 330px;
          margin: 0 0 9px;
          color: #8c8f94;
          font-size: 8px;
          line-height: 1.5;
        }

        .managerMobileV2 {
          display: none;
        }

        .managerLoadingV2 {
          min-height: 330px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 9px;
          color: #898c91;
          font-size: 8px;
        }

        @media (max-width: 900px) {
          .managerHeaderV2 {
            align-items: flex-start;
            flex-direction: column;
          }

          .managerAddV2 {
            width: 100%;
          }

          .managerToolbarV2 {
            align-items: stretch;
            flex-direction: column;
          }

          .managerSearchV2 {
            width: 100%;
            max-width: none;
          }

          .managerToolsRightV2 {
            width: 100%;
            margin-left: 0;
            justify-content: space-between;
          }
        }

        @media (max-width: 700px) {
          .managerTableWrapV2 {
            display: none;
          }

          .managerPanelV2 {
            background: transparent;
            border: 0;
            box-shadow: none;
            overflow: visible;
          }

          .managerMobileV2 {
            display: grid;
            gap: 9px;
            padding: 9px;
          }

          .managerMobileCardV2 {
            background: #fff;
            border: 1px solid #e5e7ea;
            border-radius: 12px;
            padding: 13px;
          }

          .mobileTopV2 {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding-bottom: 11px;
            border-bottom: 1px solid #eceef0;
          }

          .mobileTopV2 .productThumbV2 {
            width: 45px;
            height: 45px;
            flex-basis: 45px;
          }

          .mobileTopV2 > div:nth-child(2) {
            min-width: 0;
            flex: 1;
          }

          .mobileTopV2 strong {
            display: block;
            font-size: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobileTopV2 span {
            display: block;
            color: #8e9196;
            font-size: 7px;
            margin-top: 4px;
          }

          .mobileFieldsV2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 12px 0;
          }

          .mobileFieldV2 label {
            display: block;
            color: #999ca1;
            font-size: 7px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }

          .mobileFieldV2 strong {
            font-size: 8px;
          }

          .mobileActionV2 {
            width: 100%;
            justify-content: center;
          }

          .filterChipV2 {
            flex: 1;
            min-width: 60px;
          }
        }
      `}</style>

      <div className="managerShell">
        <header className="managerHeaderV2">
          <div>
            <Link to="/admin" className="managerBackV2">
              <ArrowLeft size={13} /> Dashboard
            </Link>

            <div className="managerHeadingV2">
              <div className="managerTitleIconV2">
                <Icon size={19} />
              </div>
              <div>
                <span className="managerEyebrowV2">
                  ADMIN / {config.title.toUpperCase()}
                </span>
                <h1>{config.title}</h1>
                <p>
                  Manage your {config.title.toLowerCase()} with a clean
                  commerce workspace.
                </p>
              </div>
            </div>
          </div>

          {type === "products" && (
            <Link
              className="managerAddV2"
              to="/admin/products/new"
            >
              <Plus size={14} /> Add product
            </Link>
          )}
        </header>

        <section className="managerToolbarV2">
          <div className="managerSearchV2">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}...`}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="managerFiltersV2">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`filterChipV2 ${
                  statusFilter === option ? "active" : ""
                }`}
                onClick={() => setStatusFilter(option)}
              >
                {option.replaceAll("_", " ")}
              </button>
            ))}
          </div>

          <div className="managerToolsRightV2">
            <span className="managerCountV2">
              {search || statusFilter !== "all"
                ? `${filteredItems.length} of ${items.length}`
                : `${items.length} total`}
            </span>

            <button
              className="managerRefreshV2"
              onClick={() => load(true)}
              disabled={refreshing}
            >
              <RefreshCw
                size={13}
                className={refreshing ? "refreshSpin" : ""}
              />
              Refresh
            </button>
          </div>
        </section>

        {error && (
          <div className="managerErrorV2">
            <AlertCircle size={15} />
            <span>{error}</span>
            <button onClick={() => load()}>Retry</button>
          </div>
        )}

        <section className="managerPanelV2">
          {loading ? (
            <div className="managerLoadingV2">
              <div className="spinner" />
              Loading {config.title.toLowerCase()}…
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="managerEmptyV2">
              <div className="managerEmptyIconV2">
                <Icon size={24} />
              </div>
              <h3>
                {search || statusFilter !== "all"
                  ? `No matching ${config.title.toLowerCase()}`
                  : `No ${config.title.toLowerCase()} yet`}
              </h3>
              <p>
                {search || statusFilter !== "all"
                  ? "Try another search or filter."
                  : `Records created in ${config.title.toLowerCase()} will appear here.`}
              </p>

              {type === "products" && (
                <Link className="managerAddV2" to="/admin/products/new">
                  <Plus size={14} /> Add product
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="managerTableWrapV2">
                <table className="managerTableV2">
                  <thead>
                    <tr>
                      {type === "products" && <th>Product</th>}
                      {config.fields
                        .filter(
                          (field) =>
                            !(type === "products" && field === "name")
                        )
                        .map((field) => (
                          <th key={field}>{prettyLabel(field)}</th>
                        ))}
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id}>
                        {type === "products" && (
                          <td>
                            <div className="productCellV2">
                              <div className="productThumbV2">
                                {getImage(item) ? (
                                  <img
                                    src={getImage(item)}
                                    alt=""
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="productThumbFallbackV2">
                                    <Package size={17} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <strong>{item.name || "Untitled product"}</strong>
                                <span>{categoryName(item)}</span>
                              </div>
                            </div>
                          </td>
                        )}

                        {config.fields
                          .filter(
                            (field) =>
                              !(type === "products" && field === "name")
                          )
                          .map((field) => (
                            <td key={field}>
                              {statusField(field) ? (
                                <StatusBadge value={item[field]} />
                              ) : field === "sku" ? (
                                <code className="skuV2">
                                  {formatValue(item[field], field)}
                                </code>
                              ) : (
                                formatValue(item[field], field)
                              )}
                            </td>
                          ))}

                        <td>
                          {getViewPath(item) !== "#" ? (
                            <div className="managerActionGroupV2">
                              <Link
                                className="viewButtonV2"
                                to={getViewPath(item)}
                              >
                                <Eye size={12} /> Edit <ArrowRight size={11} />
                              </Link>
                              {type === "products" && (
                                <button
                                  type="button"
                                  className="deleteButtonV2"
                                  onClick={() => deleteProduct(item)}
                                  title="Deactivate product"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="managerMobileV2">
                {filteredItems.map((item) => {
                  const primary =
                    type === "products"
                      ? item.name
                      : item[config.fields[0]];

                  return (
                    <article
                      className="managerMobileCardV2"
                      key={item._id}
                    >
                      <div className="mobileTopV2">
                        {type === "products" && (
                          <div className="productThumbV2">
                            {getImage(item) ? (
                              <img
                                src={getImage(item)}
                                alt=""
                                loading="lazy"
                              />
                            ) : (
                              <Package size={17} />
                            )}
                          </div>
                        )}

                        <div>
                          <strong>{formatValue(primary, config.fields[0])}</strong>
                          <span>
                            {type === "products"
                              ? categoryName(item)
                              : config.title}
                          </span>
                        </div>

                        {type !== "products" &&
                          statusField(config.fields[1]) && (
                            <StatusBadge
                              value={item[config.fields[1]]}
                            />
                          )}
                      </div>

                      <div className="mobileFieldsV2">
                        {config.fields
                          .filter(
                            (field) =>
                              field !== config.fields[0] &&
                              !(
                                type === "products" &&
                                field === "name"
                              )
                          )
                          .map((field) => (
                            <div
                              className="mobileFieldV2"
                              key={field}
                            >
                              <label>{prettyLabel(field)}</label>
                              {statusField(field) ? (
                                <StatusBadge value={item[field]} />
                              ) : (
                                <strong>
                                  {formatValue(item[field], field)}
                                </strong>
                              )}
                            </div>
                          ))}
                      </div>

                      {getViewPath(item) !== "#" && (
                        <div className="managerActionGroupV2 mobileActionV2">
                          <Link
                            className="viewButtonV2"
                            to={getViewPath(item)}
                          >
                            <Eye size={12} /> Edit <ArrowRight size={11} />
                          </Link>
                          {type === "products" && (
                            <button
                              type="button"
                              className="deleteButtonV2"
                              onClick={() => deleteProduct(item)}
                            >
                              <Trash2 size={12} /> Deactivate
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
