import { getProducts } from '@/lib/shopify';
import Header from '@/components/Header';
import CategoryProducts from '@/components/CategoryProducts';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop All Handcrafted Gifts | Phases Handcrafted',
  description: 'Explore our full range of handcrafted soy candles, decorative candles, soft toys, keychains, and premium gift sets.',
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main style={{ backgroundColor: '#faf9f5', minHeight: '100vh' }}>
      <Header />
      <div style={{ paddingTop: '80px' }}>
        <CategoryProducts products={products} />
      </div>
    </main>
  );
}
