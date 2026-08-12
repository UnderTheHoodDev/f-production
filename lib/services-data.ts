import {
  Building2,
  Camera,
  Clapperboard,
  Film,
  Mic,
  Newspaper,
  Radio,
  UserCircle,
  Video,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  label: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  /**
   * Đặt `true` để tạm ẩn dịch vụ khỏi toàn bộ trang public
   * (grid trang chủ, menu, footer, trang giới thiệu, sitemap)
   * và cho route /dich-vu/[slug] trả về 404.
   * Đổi lại thành `false` (hoặc xoá dòng này) để hiện lại.
   */
  hidden?: boolean;
}

const allServices: Service[] = [
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
    hidden: true,
  },
  {
    label: 'Chụp Ảnh Profile',
    slug: 'chup-anh-profile',
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
    hidden: true,
  },
  {
    label: 'Quay Phim Kiến Trúc',
    slug: 'quay-phim-kien-truc',
    icon: Clapperboard,
    description: 'Quay video kiến trúc và không gian bằng thiết bị chuyên dụng',
    hidden: true,
  },
  {
    label: 'Truyền thông Báo chí',
    slug: 'truyen-thong-bao-chi',
    icon: Newspaper,
    description: 'Triển khai truyền thông báo chí và lan tỏa hình ảnh thương hiệu',
    hidden: true,
  },
];

/** Danh sách dịch vụ đang hiển thị trên trang public. */
export const services: Service[] = allServices.filter(
  (service) => !service.hidden
);

/** Slug của các dịch vụ đang bị ẩn, dùng để lọc tab dự án ở trang chủ. */
export const hiddenServiceSlugs = new Set(
  allServices.filter((service) => service.hidden).map((service) => service.slug)
);

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
