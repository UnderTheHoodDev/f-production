'use client';

import PriceCard, { PricingPlan } from '@/components/price/price-card';
import { motion } from 'motion/react';

const pricingPlans: PricingPlan[] = [
  {
    name: 'Gói Cơ Bản',
    price: 4990000,
    description: 'Phù hợp cho sự kiện nhỏ và doanh nghiệp mới bắt đầu',
    icon: 'basic',
    features: [
      '1 Photographer chuyên nghiệp',
      'Thời lượng chụp: 4 giờ',
      '50 ảnh đã chỉnh sửa',
      'Giao ảnh trong 5 ngày làm việc',
      'Hỗ trợ tư vấn concept',
      'Áp dụng tại Hà Nội',
    ],
  },
  {
    name: 'Gói Chuyên Nghiệp',
    price: 9990000,
    description: 'Lựa chọn tốt nhất cho sự kiện doanh nghiệp',
    icon: 'popular',
    isPopular: true,
    features: [
      '2 Photographer chuyên nghiệp',
      'Thời lượng chụp: 8 giờ',
      '150 ảnh đã chỉnh sửa',
      'Giao ảnh trong 3 ngày làm việc',
      'Quay video highlight 1 phút',
      'Hỗ trợ setup ánh sáng chuyên nghiệp',
      'Tư vấn concept và kịch bản',
      'Áp dụng toàn quốc',
    ],
  },
  {
    name: 'Gói Cao Cấp',
    price: 19990000,
    description: 'Trọn gói cho sự kiện lớn và yêu cầu đặc biệt',
    icon: 'premium',
    features: [
      '3 Photographer + 1 Videographer',
      'Thời lượng chụp: Cả ngày',
      'Không giới hạn số ảnh',
      'Giao ảnh trong 24 giờ',
      'Video highlight 3 phút',
      'Livestream sự kiện',
      'Thiết kế album cao cấp',
      'Tư vấn toàn diện',
      'Hỗ trợ đi các tỉnh',
    ],
  },
];

const PriceList = () => {
  return (
    <div className="layout-padding flex flex-col items-center gap-8 py-12 md:gap-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-background-secondary text-3xl font-bold md:text-4xl lg:text-5xl"
        >
          Bảng giá dịch vụ
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="max-w-2xl text-gray-500 md:text-lg"
        >
          Chọn gói dịch vụ phù hợp với nhu cầu của bạn. Tất cả các gói đều bao
          gồm tư vấn miễn phí và cam kết chất lượng.
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="flex w-full flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        {pricingPlans.map((plan, index) => (
          <PriceCard key={plan.name} plan={plan} index={index} />
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <p className="text-sm text-gray-400">
          * Giá trên chưa bao gồm VAT. Liên hệ để nhận báo giá chi tiết cho dự
          án của bạn.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="bg-primary h-2 w-2 rounded-full"></span>
            Thanh toán linh hoạt
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-primary h-2 w-2 rounded-full"></span>
            Hỗ trợ 24/7
          </span>
          <span className="flex items-center gap-2">
            <span className="bg-primary h-2 w-2 rounded-full"></span>
            Hoàn tiền nếu không hài lòng
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default PriceList;
