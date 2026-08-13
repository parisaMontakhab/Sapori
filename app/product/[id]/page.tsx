import { Suspense } from "react";
import ProductPageContent from "@/components/ProductPageContent";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductPageContent productId={id} />
    </Suspense>
  );
}
