import {
  Building2,
  Camera,
  Clapperboard,
  Video,
  Radio,
  Film,
  UserCircle,
  Mic,
  Newspaper,
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
    label: 'Livestream Chuyên Nghiệp',
    slug: 'livestream-chuyen-nghiep',
    icon: Radio,
    description: 'Dịch vụ livestream chuyên nghiệp cho mọi sự kiện',
  },
  {
    label: 'Chụp Ảnh Sự Kiện',
    slug: 'chup-anh-su-kien',
    icon: Camera,
    description: 'Ghi lại những khoảnh khắc đáng nhớ của sự kiện',
  },
  {
    label: 'Quay Phim Sự Kiện',
    slug: 'quay-phim-su-kien',
    icon: Video,
    description: 'Quay video chuyên nghiệp cho các sự kiện',
  },
  {
    label: 'TVC - Phim Doanh Nghiệp',
    slug: 'tvc-phim-doanh-nghiep',
    icon: Film,
    description: 'Sản xuất TVC và phim giới thiệu doanh nghiệp',
  },
  {
    label: 'Chụp Ảnh Profile, Tập Thể',
    slug: 'chup-anh-profile-tap-the',
    icon: UserCircle,
    description: 'Chụp ảnh profile cá nhân, tập thể và doanh nghiệp',
  },
  {
    label: 'Quay Phim Podcast',
    slug: 'quay-phim-podcast',
    icon: Mic,
    description: 'Quay và sản xuất podcast chuyên nghiệp',
  },
  {
    label: 'Chụp Ảnh Kiến Trúc',
    slug: 'chup-anh-kien-truc',
    icon: Building2,
    description: 'Chụp ảnh công trình, không gian và kiến trúc chuyên nghiệp',
  },
  {
    label: 'Quay Phim Kiến Trúc',
    slug: 'quay-phim-kien-truc',
    icon: Clapperboard,
    description: 'Quay video kiến trúc và không gian bằng thiết bị chuyên dụng',
  },
  {
    label: 'Truyền thông Báo chí',
    slug: 'truyen-thong-bao-chi',
    icon: Newspaper,
    description: 'Triển khai truyền thông báo chí và lan tỏa hình ảnh thương hiệu',
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
