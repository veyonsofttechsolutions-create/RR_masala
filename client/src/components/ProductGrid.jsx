import { PackageSearch, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products = [] }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="rrProductEmpty">
        <div className="rrEmptyIcon">
          <PackageSearch size={32} />
        </div>
        <span className="rrEmptyEyebrow">
          <Sparkles size={13} />
          RR MASALA COLLECTION
        </span>
        <h3>No Products Found</h3>
        <p>
          Products will appear here once they are loaded into the store catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="rrProductGrid">
      {products.map((product, index) => (
        <ProductCard
          key={product?._id || product?.id || product?.slug || index}
          product={product}
          index={index}
        />
      ))}
    </div>
  );
}