'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import ProductFilterSection from '@/components/products/product-filter-section';
import ProductItem, { type ProductImage } from '@/components/products/product-item';
import ProductView from '@/components/products/product-view';

// Mapping từ filter type sang service name
// Chỉ filter có trong map này mới fetch từ API
const FILTER_SERVICE_MAP: Record<string, string> = {
  'ẢNH EVENT': 'Chụp ảnh sự kiện',
  // Thêm các mapping khác sau
};

type LandingImage = {
  id: string;
  title: string | null;
  format: string | null;
  url: string | null;
  publicId: string | null;
  createdAt: string;
  updatedAt: string;
  type: 'image';
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
      ease: 'easeOut',
    },
  },
};

const ITEMS_PER_PAGE = 6;

const ProductList = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ẢNH EVENT');
  const [activeProductView, setActiveProductView] = useState<boolean>(false);
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);
  
  // State for API fetched data
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Fetch images from API
  const fetchImages = useCallback(async (filterType: string, pageNum: number, append = false) => {
    const serviceName = FILTER_SERVICE_MAP[filterType];
    
    // Nếu filter không có trong map, sử dụng placeholder data
    if (!serviceName) {
      const placeholderData: ProductItem[] = Array.from({ length: 6 }, (_, i) => ({
        id: `placeholder-${i}`,
        type: 'image' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setProducts(placeholderData);
      setHasMore(false);
      setTotal(6);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        serviceName,
        page: pageNum.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/landing/images?${params}`);
      const data = await response.json();

      if (data.success) {
        const newImages: ProductItem[] = data.images.map((img: LandingImage) => ({
          id: img.id,
          type: 'image' as const,
          title: img.title,
          format: img.format,
          url: img.url,
          publicId: img.publicId,
          eventName: img.event.title,
          eventClient: img.event.client,
          createdAt: new Date(img.createdAt),
          updatedAt: new Date(img.updatedAt),
        }));

        if (append) {
          setProducts((prev) => [...prev, ...newImages]);
        } else {
          setProducts(newImages);
        }
        
        setHasMore(data.pagination.hasMore);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on filter change
  useEffect(() => {
    setPage(1);
    fetchImages(selectedFilter, 1, false);
  }, [selectedFilter, fetchImages]);

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
    fetchImages(selectedFilter, nextPage, true);
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
                    variants={itemVariants as any}
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
                      handleActiveProductView={() => handleActiveProductView(index)}
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

