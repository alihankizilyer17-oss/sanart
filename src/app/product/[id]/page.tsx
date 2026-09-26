import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return [
    { id: "DL638soVhdacFRaNLEb4" },
    { id: "NZIYltONUasXUPG4mI1J" },
    { id: "hVfabYMfN5jpiXUN7DpB" },
  ];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductClient id={id} />;
}