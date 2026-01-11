'use client';

import { Button } from '@/components/ui/button';
import { CircleCheck, Star, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: 'basic' | 'popular' | 'premium';
}

interface PriceCardProps {
  plan: PricingPlan;
  index?: number;
}

const iconMap = {
  basic: Zap,
  popular: Star,
  premium: Crown,
};

const PriceCard = ({ plan, index = 0 }: PriceCardProps) => {
  const Icon = iconMap[plan.icon];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: plan.isPopular ? -12 : -8 }}
      className={cn(
        'relative flex w-full max-w-[380px] flex-col rounded-3xl border-2 transition-shadow duration-300',
        plan.isPopular
          ? 'border-primary bg-background-secondary shadow-2xl shadow-primary/20'
          : 'border-background-secondary/30 bg-white shadow-lg hover:shadow-xl'
      )}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="bg-primary absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full px-6 py-2 shadow-lg">
          <span className="text-sm font-bold whitespace-nowrap text-white">
            🔥 Phổ biến nhất
          </span>
        </div>
      )}

      {/* Header */}
      <div
        className={cn(
          'flex flex-col items-center gap-4 rounded-t-3xl px-6 pt-8 pb-6',
          plan.isPopular ? 'bg-background-secondary' : 'bg-gray-50'
        )}
      >
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl',
            plan.isPopular
              ? 'bg-primary text-white'
              : 'bg-background-secondary text-white'
          )}
        >
          <Icon className="h-8 w-8" />
        </motion.div>

        {/* Plan Name */}
        <span
          className={cn(
            'text-xl font-bold',
            plan.isPopular ? 'text-white' : 'text-background-secondary'
          )}
        >
          {plan.name}
        </span>

        {/* Description */}
        <p
          className={cn(
            'text-center text-sm',
            plan.isPopular ? 'text-white/80' : 'text-gray-500'
          )}
        >
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div
        className={cn(
          'flex flex-col items-center gap-1 border-b py-6',
          plan.isPopular
            ? 'border-white/20 bg-background-secondary'
            : 'border-gray-100 bg-white'
        )}
      >
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-4xl font-bold',
              plan.isPopular ? 'text-primary' : 'text-background-secondary'
            )}
          >
            {formatPrice(plan.price)}
          </span>
          <span
            className={cn(
              'text-xl',
              plan.isPopular ? 'text-white/70' : 'text-gray-400'
            )}
          >
            đ
          </span>
        </div>
        <span
          className={cn(
            'text-sm',
            plan.isPopular ? 'text-white/60' : 'text-gray-400'
          )}
        >
          / dự án
        </span>
      </div>

      {/* Features */}
      <div
        className={cn(
          'flex flex-1 flex-col gap-4 px-6 py-6',
          plan.isPopular ? 'bg-background-secondary' : 'bg-white'
        )}
      >
        {plan.features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
            className="flex items-start gap-3"
          >
            <div
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                plan.isPopular ? 'bg-primary/20' : 'bg-green-100'
              )}
            >
              <CircleCheck
                className={cn(
                  'h-4 w-4',
                  plan.isPopular ? 'text-primary' : 'text-green-600'
                )}
              />
            </div>
            <span
              className={cn(
                'text-sm leading-relaxed',
                plan.isPopular ? 'text-white/90' : 'text-gray-600'
              )}
            >
              {feature}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <div
        className={cn(
          'rounded-b-3xl px-6 pb-8 pt-2',
          plan.isPopular ? 'bg-background-secondary' : 'bg-white'
        )}
      >
        <Button
          className={cn(
            'w-full py-6 text-base font-semibold transition-all duration-300',
            plan.isPopular
              ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
              : 'bg-background-secondary hover:bg-background-secondary/90 text-white'
          )}
        >
          {plan.isPopular ? 'Bắt đầu ngay' : 'Tư vấn miễn phí'}
        </Button>
      </div>
    </motion.div>
  );
};

export default PriceCard;
