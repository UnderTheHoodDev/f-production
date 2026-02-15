'use client';

import ProductItem from '@/components/products/product-item';
import ProductView from '@/components/products/product-view';
import { cn } from '@/lib/utils';
import { getServiceBySlug } from '@/lib/services-data';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const INITIAL_ITEMS_PER_EVENT = 9;
const LOAD_MORE_INCREMENT = 9;

interface Product {
  id: string;
  type: 'image' | 'video';
  title?: string | null;
  url?: string;
  thumbnail?: string | null;
  youtubeUrl?: string | null;
  format?: string | null;
}

interface EventData {
  id: string;
  title: string;
  client?: string | null;
  place?: string | null;
  products: Product[];
}

interface ServiceShowBySlugProps {
  slug: string;
}

const ServiceShowBySlug = ({ slug }: ServiceShowBySlugProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineHeights, setLineHeights] = useState<number[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [activeProductView, setActiveProductView] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/services/${slug}`);
        const data = await response.json();
        if (data.success && data.events) {
          setEvents(data.events);
          const initialCounts: Record<string, number> = {};
          data.events.forEach((event: EventData) => {
            initialCounts[event.id] = INITIAL_ITEMS_PER_EVENT;
          });
          setVisibleCounts(initialCounts);
        }
      } catch (error) {
        console.error('Error fetching service data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Flatten tất cả visible products từ mọi events để dùng cho ProductView navigation
  const allVisibleProducts = useMemo(() => {
    return events.flatMap((event) => {
      const count = visibleCounts[event.id] || INITIAL_ITEMS_PER_EVENT;
      return event.products.slice(0, count).map((product) => ({
        id: product.id,
        title: product.title || event.title || null,
        type: product.type,
        format: product.format,
        url: product.url,
        youtubeUrl: product.youtubeUrl,
        thumbnail: product.thumbnail,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });
  }, [events, visibleCounts]);

  // Tính global index cho một product trong một event cụ thể
  const getGlobalIndex = useCallback((eventId: string, localIndex: number) => {
    let globalIdx = 0;
    for (const event of events) {
      if (event.id === eventId) {
        return globalIdx + localIndex;
      }
      const count = visibleCounts[event.id] || INITIAL_ITEMS_PER_EVENT;
      globalIdx += Math.min(event.products.length, count);
    }
    return globalIdx;
  }, [events, visibleCounts]);

  // const calculateLineHeights = useCallback(() => {
  //     if (!containerRef.current) return;
  const handleLoadMore = (eventId: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [eventId]:
        (prev[eventId] || INITIAL_ITEMS_PER_EVENT) + LOAD_MORE_INCREMENT,
    }));
  };

  const calculateLineHeights = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportTrigger = window.innerHeight * 0.6;
    const containerTop = containerRect.top;
    const initialOffset = Math.max(0, containerTop - viewportTrigger);

    const newHeights: number[] = [];
    let newActiveIndex = 0;

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) {
        newHeights.push(0);
        return;
      }

      const rect = ref.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height + 16;
      const scrolledPast = viewportTrigger - sectionTop - initialOffset;

      if (scrolledPast > 0) {
        const fillHeight = Math.min(scrolledPast, sectionHeight);
        newHeights.push(Math.max(0, fillHeight));
        if (scrolledPast >= 32) {
          newActiveIndex = index;
        }
      } else {
        newHeights.push(0);
      }
    });

    setLineHeights(newHeights);
    setActiveIndex(newActiveIndex);
  }, []);

  useEffect(() => {
    requestAnimationFrame(calculateLineHeights);
    const handleScroll = () => requestAnimationFrame(calculateLineHeights);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [calculateLineHeights, events]);

  if (loading) {
    return (
      <>
        <div
          ref={containerRef}
          className="layout-padding mb-3 flex flex-col gap-4 py-6 md:py-10 lg:mb-4"
        >
          {events.map((event, index) => {
            const isActive = activeIndex === index;
            const lineHeight = lineHeights[index] || 0;
            const visibleCount = visibleCounts[event.id] || INITIAL_ITEMS_PER_EVENT;
            const visibleProducts = event.products.slice(0, visibleCount);
            const hasMoreProducts = event.products.length > visibleCount;

            return (
              <div
                key={event.id}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className={cn(
                  'relative flex flex-1 justify-center gap-2 transition-all duration-300 sm:gap-4'
                )}
              >
                <div
                  className={cn(
                    'relative flex min-w-12 flex-col items-center md:min-w-16'
                  )}
                >
                  <div
                    className={cn(
                      'absolute left-1/2 h-[calc(100%+16px)] w-[1.5px] -translate-x-1/2 bg-[#DADADA] lg:w-0.5'
                    )}
                  />
                  <div
                    className="bg-primary absolute left-1/2 w-[1.5px] -translate-x-1/2 lg:w-0.5"
                    style={{ height: `${lineHeight}px` }}
                  />
                  <div
                    className={cn(
                      'z-10 flex items-center justify-center rounded-full border-2 bg-white transition-all duration-300',
                      isActive
                        ? 'border-primary size-12 sm:size-14 lg:size-16'
                        : 'size-10 border-[#DADADA] sm:size-12 lg:size-14'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-full transition-all duration-300',
                        isActive
                          ? 'bg-primary size-8 sm:size-10 lg:size-12'
                          : 'size-6 bg-[#DADADA] sm:size-8 lg:size-10'
                      )}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    'mt-2.5 flex flex-col gap-3 md:gap-4 lg:mt-3.25 lg:gap-5'
                  )}
                >
                  <span
                    className={cn(
                      '-translate-y-px font-medium transition-all duration-300',
                      isActive
                        ? 'text-primary xsm:text-xl text-lg sm:text-2xl lg:text-3xl'
                        : 'xsm:text-lg text-base text-[#AFAFAF] sm:text-xl lg:text-2xl'
                    )}
                  >
                    {event.title}
                  </span>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-3">
                    {visibleProducts.map((product, productIndex) => (
                      <ProductItem
                        key={product.id}
                        type={product.type}
                        handleActiveProductView={() => {
                          setActiveProductIndex(getGlobalIndex(event.id, productIndex));
                          setActiveProductView(true);
                        }}
                        image={
                          product.type === 'image'
                            ? {
                              id: product.id,
                              url: product.url,
                              title: product.title,
                              format: product.format,
                            }
                            : undefined
                        }
                        thumbnail={product.thumbnail || undefined}
                        eventName={event.title}
                        eventClient={event.client || undefined}
                      />
                    ))}
                  </div>

                  {hasMoreProducts && (
                    <button
                      onClick={() => handleLoadMore(event.id)}
                      className="bg-primary/10 text-primary hover:bg-primary/20 mx-auto rounded-full px-6 py-2 font-medium transition-colors"
                    >
                      Xem thêm
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {activeProductView && allVisibleProducts.length > 0 && (
          <ProductView
            products={allVisibleProducts}
            initialIndex={activeProductIndex}
            setActiveProductView={setActiveProductView}
          />
        )}
      </>
    );
  }

  if (events.length === 0) {
    const service = getServiceBySlug(slug);
    if (!service) return null;
    const Icon = service.icon;

    return (
      <>
        <section className="layout-padding py-8 sm:py-12 2xl:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/30 text-primary mb-6 flex size-20 items-center justify-center rounded-2xl">
                <Icon className="size-10" />
              </div>
              <h1 className="text-background mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                {service.label}
              </h1>
              <p className="text-background-secondary max-w-2xl text-lg md:text-xl">
                {service.description}
              </p>
            </div>
          </div>
        </section>

        <section className="layout-padding pb-8 sm:pb-12 2xl:pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="bg-card rounded-2xl border p-8 md:p-12">
              <div className="text-muted-foreground space-y-6 text-center">
                <p className="text-lg">
                  Nội dung chi tiết về dịch vụ{' '}
                  <span className="text-primary font-semibold">
                    {service.label}
                  </span>{' '}
                  sẽ được cập nhật.
                </p>
                <div className="bg-surface-alt mx-auto h-[1.5px] w-full" />
                <p className="text-sm">
                  Liên hệ với chúng tôi để biết thêm chi tiết về dịch vụ này.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="layout-padding mb-3 flex flex-col gap-4 py-6 md:py-10 lg:mb-4"
      >
        {events.map((event, index) => {
          const isActive = activeIndex === index;
          const lineHeight = lineHeights[index] || 0;
          const visibleCount = visibleCounts[event.id] || INITIAL_ITEMS_PER_EVENT;
          const visibleProducts = event.products.slice(0, visibleCount);
          const hasMoreProducts = event.products.length > visibleCount;

          return (
            <div
              key={event.id}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className={cn(
                'relative flex flex-1 justify-center gap-2 transition-all duration-300 sm:gap-4'
              )}
            >
              <div
                className={cn(
                  'relative flex min-w-12 flex-col items-center md:min-w-16'
                )}
              >
                <div
                  className={cn(
                    'absolute left-1/2 h-[calc(100%+16px)] w-[1.5px] -translate-x-1/2 bg-[#DADADA] lg:w-0.5'
                  )}
                />
                <div
                  className="bg-primary absolute left-1/2 w-[1.5px] -translate-x-1/2 lg:w-0.5"
                  style={{ height: `${lineHeight}px` }}
                />
                <div
                  className={cn(
                    'z-10 flex items-center justify-center rounded-full border-2 bg-white transition-all duration-300',
                    isActive
                      ? 'border-primary size-12 sm:size-14 lg:size-16'
                      : 'size-10 border-[#DADADA] sm:size-12 lg:size-14'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-full transition-all duration-300',
                      isActive
                        ? 'bg-primary size-8 sm:size-10 lg:size-12'
                        : 'size-6 bg-[#DADADA] sm:size-8 lg:size-10'
                    )}
                  />
                </div>
              </div>

              <div
                className={cn(
                  'mt-2.5 flex flex-col gap-3 md:gap-4 lg:mt-3.25 lg:gap-5'
                )}
              >
                <span
                  className={cn(
                    '-translate-y-px font-medium transition-all duration-300',
                    isActive
                      ? 'text-primary xsm:text-xl text-lg sm:text-2xl lg:text-3xl'
                      : 'xsm:text-lg text-base text-[#AFAFAF] sm:text-xl lg:text-2xl'
                  )}
                >
                  {event.title}
                </span>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-3">
                  {visibleProducts.map((product, productIndex) => (
                    <ProductItem
                      key={product.id}
                      type={product.type}
                      handleActiveProductView={() => {
                        setActiveProductIndex(getGlobalIndex(event.id, productIndex));
                        setActiveProductView(true);
                      }}
                      image={
                        product.type === 'image'
                          ? {
                            id: product.id,
                            url: product.url,
                            title: product.title,
                            format: product.format,
                          }
                          : undefined
                      }
                      thumbnail={product.thumbnail || undefined}
                      eventName={event.title}
                      eventClient={event.client || undefined}
                    />
                  ))}
                </div>

                {hasMoreProducts && (
                  <button
                    onClick={() => handleLoadMore(event.id)}
                    className="bg-primary/10 text-primary hover:bg-primary/20 mx-auto rounded-full px-6 py-2 font-medium transition-colors"
                  >
                    Xem thêm
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeProductView && allVisibleProducts.length > 0 && (
        <ProductView
          products={allVisibleProducts}
          initialIndex={activeProductIndex}
          setActiveProductView={setActiveProductView}
        />
      )}
    </>
  );
};

export default ServiceShowBySlug;
