import {
  Camera,
  Video,
  Radio,
  Film,
  UserCircle,
  Users,
  Mic,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  label: string;
  slug: string;
  icon: LucideIcon;
  description: string;
}

export const services: Service[] = [
  {
    label: 'Livestream sự kiện',
    slug: 'livestream-su-kien',
    icon: Radio,
    description: 'Dịch vụ livestream chuyên nghiệp cho mọi sự kiện',
  },
  {
    label: 'Chụp ảnh sự kiện',
    slug: 'chup-anh-su-kien',
    icon: Camera,
    description: 'Ghi lại những khoảnh khắc đáng nhớ của sự kiện',
  },
  {
    label: 'Quay phim sự kiện',
    slug: 'quay-phim-su-kien',
    icon: Video,
    description: 'Quay video chuyên nghiệp cho các sự kiện',
  },
  {
    label: 'TVC - Phim doanh nghiệp',
    slug: 'tvc-phim-doanh-nghiep',
    icon: Film,
    description: 'Sản xuất TVC và phim giới thiệu doanh nghiệp',
  },
  {
    label: 'Chụp ảnh Profile chuyên nghiệp',
    slug: 'chup-anh-profile',
    icon: UserCircle,
    description: 'Chụp ảnh profile cá nhân và doanh nghiệp',
  },
  {
    label: 'Quay phim, chụp ảnh Team Building',
    slug: 'team-building',
    icon: Users,
    description: 'Ghi lại hoạt động team building của doanh nghiệp',
  },
  {
    label: 'Quay phim Podcast',
    slug: 'quay-phim-podcast',
    icon: Mic,
    description: 'Quay và sản xuất podcast chuyên nghiệp',
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
