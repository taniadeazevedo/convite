import ProductPageView, { productMetadata } from "@/components/site/ProductPageView";
import { getProductPage } from "@/lib/content/product-pages";

// El texto de esta página está en src/lib/content/product-pages.ts
const page = getProductPage("invitaciones-boda-originales")!;

export const metadata = productMetadata(page);

export default function Page() {
  return <ProductPageView page={page} />;
}
