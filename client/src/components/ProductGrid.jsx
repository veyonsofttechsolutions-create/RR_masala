import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products = [] }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="empty productEmpty">
        <PackageSearch />
        <h3>No products available</h3>
        <p>
          Products will appear here once they are added
          to the catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="productGrid">
      {products.map((product) => (
        <ProductCard
          key={product?._id || product?.id || product?.slug}
          product={product}
        />
      ))}
    </div>
  );
}
