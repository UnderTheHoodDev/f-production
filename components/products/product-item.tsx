import { Play } from 'lucide-react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

export type ProductImage = {
  id: string;
  publicId?: string | null;
  url?: string | null;
  title?: string | null;
  format?: string | null;
};

interface ProductItemProps {
  type: 'image' | 'video';
  handleActiveProductView: () => void;
  image?: ProductImage;
  eventName?: string;
  eventClient?: string;
  thumbnail?: string; // For video thumbnails
}

const ProductItem = ({
  type,
  handleActiveProductView,
  image,
  eventName,
  eventClient,
  thumbnail,
}: ProductItemProps) => {
  const hasCloudinaryImage = image?.publicId;
  const imageUrl = image?.url || thumbnail;

  return (
    <div
      className="max-w-[480px] cursor-pointer"
      onClick={handleActiveProductView}
    >
      <div className="relative">
        <Image
          src="/logo.png"
          width={32}
          height={32}
          alt="Logo copyright"
          className="absolute top-1 left-2 opacity-40 z-10"
        />
        {hasCloudinaryImage ? (
          <CldImage
            src={image.publicId!}
            width={480}
            height={270}
            alt={image.title || eventName || 'Product image'}
            className="aspect-video max-h-60 w-full object-cover"
          />
        ) : (
          <Image
            src={imageUrl || 'https://img.youtube.com/vi/LIKOvbJ-DZg/maxresdefault.jpg'}
            width={480}
            height={270}
            loading="lazy"
            unoptimized={!!imageUrl}
            className="aspect-video max-h-60 w-full object-cover"
            alt={image?.title || eventName || 'Product image'}
          />
        )}
        {type === 'video' && (
          <div className="border-foreground absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 p-2">
            <Play className="text-foreground fill-foreground h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex flex-col bg-[#F1F2F9] p-3 py-2">
        <span className="text-background-secondary text-base font-medium lg:text-lg line-clamp-1">
          {eventName || 'Chưa có tên sự kiện'}
        </span>
        <span className="text-xs text-[#444444] lg:text-sm line-clamp-1">
          {eventClient ? `Client: ${eventClient}` : 'Chưa có thông tin client'}
        </span>
      </div>
    </div>
  );
};

export default ProductItem;

