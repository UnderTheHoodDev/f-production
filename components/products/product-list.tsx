'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import ProductFilterSection from '@/components/products/product-filter-section';
import ProductItem from '@/components/products/product-item';
import ProductView from '@/components/products/product-view';

// Mapping từ filter type sang service slug
// Chỉ filter có trong map này mới fetch từ API
const FILTER_SERVICE_SLUG_MAP: Record<string, string> = {
  Livestream: 'livestream-chuyen-nghiep',
  'Ảnh sự kiện': 'chup-anh-su-kien',
  'Video sự kiện': 'quay-phim-su-kien',
  TVC: 'tvc-phim-doanh-nghiep',
  'Ảnh Profile': 'chup-anh-profile-tap-the',
  Podcast: 'quay-phim-podcast',
  'Ảnh Kiến trúc': 'chup-anh-kien-truc',
  'Video Kiến trúc': 'quay-phim-kien-truc',
  'Đăng Báo chí': 'truyen-thong-bao-chi',
};

type LandingProduct = {
  id: string;
  title: string | null;
  type: 'image' | 'video';
  // Image fields
  format?: string | null;
  url?: string | null;
  s3Key?: string | null;
  // Video fields
  youtubeUrl?: string | null;
  thumbnail?: string | null;
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    title: string;
    client: string | null;
  };
};

type ProductItem = {
  id: string;
  type: 'image' | 'video';
  title?: string | null;
  format?: string | null;
  url?: string | null;
  publicId?: string | null;
  eventName?: string;
  eventClient?: string | null;
  // For videos
  youtubeUrl?: string | null;
  thumbnail?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const ITEMS_PER_PAGE = 6;

const ProductList = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Livestream');
  const [activeProductView, setActiveProductView] = useState<boolean>(false);
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);

  // State for API fetched data
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // Fetch products from API (images or videos depending on service type)
  const fetchProducts = useCallback(async (filterType: string, pageNum: number, append = false) => {
    const serviceSlug = FILTER_SERVICE_SLUG_MAP[filterType];

    // Nếu filter không có trong map, sử dụng placeholder data
    if (!serviceSlug) {
      const placeholderData: ProductItem[] = Array.from({ length: 6 }, (_, i) => ({
        id: `placeholder-${i}`,
        type: 'image' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setProducts(placeholderData);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        serviceSlug,
        page: pageNum.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/landing/images?${params}`);
      const data = await response.json();

      if (data.success) {
        const newProducts: ProductItem[] = data.products.map((item: LandingProduct) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          format: item.format,
          url: item.url,
          youtubeUrl: item.youtubeUrl,
          thumbnail: item.thumbnail,
          eventName: item.event.title,
          eventClient: item.event.client,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        if (append) {
          setProducts((prev) => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on filter change
  useEffect(() => {
    setPage(1);
    fetchProducts(selectedFilter, 1, false);
  }, [selectedFilter, fetchProducts]);

  const handleFilterType = (type: string) => {
    if (type !== selectedFilter) {
      setSelectedFilter(type);
    }
  };

  const handleActiveProductView = (index: number) => {
    setActiveProductIndex(index);
    setActiveProductView(true);
  };

  const handleLoadMoreProduct = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(selectedFilter, nextPage, true);
  };

  // Convert products to ProductView format
  const productViewItems = products.map((p) => ({
    id: p.id,
    title: p.eventName || p.title || null,
    type: p.type,
    format: p.format,
    url: p.url,
    publicId: p.publicId,
    youtubeUrl: p.youtubeUrl,
    thumbnail: p.thumbnail,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 md:gap-4 md:py-8 2xl:gap-8 2xl:py-12">
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-background-secondary xsm:text-3xl text-2xl font-bold lg:text-4xl"
      >
        Sản phẩm
      </motion.span>
      <div className="layout-padding flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-4 md:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <ProductFilterSection
              selectedFilter={selectedFilter}
              handleFilterType={handleFilterType}
            />
          </motion.div>

          {isLoading && products.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1B1B1B]" />
            </div>
          ) : !isLoading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-background h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-background text-lg font-medium">
                Chưa có sản phẩm nào
              </p>
              <p className="text-sm text-gray-400">
                Sản phẩm sẽ được cập nhật sớm nhất
              </p>
            </div>
          ) : (
            <motion.div
              key={selectedFilter}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2 md:gap-3 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    whileHover={{
                      y: -6,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    }}
                  >
                    <ProductItem
                      type={product.type}
                      handleActiveProductView={() =>
                        handleActiveProductView(index)
                      }
                      image={
                        product.publicId || product.url
                          ? {
                            id: product.id,
                            publicId: product.publicId,
                            url: product.url,
                            title: product.title,
                            format: product.format,
                          }
                          : undefined
                      }
                      eventName={product.eventName}
                      eventClient={product.eventClient || undefined}
                      thumbnail={product.thumbnail || undefined}
                      youtubeUrl={product.youtubeUrl || undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-foreground bg-background-secondary hover:text-primary cursor-pointer rounded-4xl px-5 py-2 text-base font-medium transition-colors duration-300 sm:text-lg lg:text-xl"
            onClick={handleLoadMoreProduct}
          >
            {isLoading ? 'Đang tải...' : `Xem thêm`}
          </motion.div>
        )}
      </div>

      {activeProductView && products.length > 0 && (
        <ProductView
          products={productViewItems}
          initialIndex={activeProductIndex}
          setActiveProductView={setActiveProductView}
        />
      )}
    </div>
  );
};

export default ProductList;
