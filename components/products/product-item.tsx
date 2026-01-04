import { Play } from 'lucide-react';
import Image from 'next/image';

interface ProductItemProps {
  type: 'image' | 'video';
  handleActiveProductView: () => void;
}

const ProductItem = ({ type, handleActiveProductView }: ProductItemProps) => {
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
          className="absolute top-1 left-2 opacity-40"
        />
        <Image
          src="https://img.youtube.com/vi/LIKOvbJ-DZg/maxresdefault.jpg"
          width={150}
          height={150}
          loading="lazy"
          unoptimized
          className="aspect-video w-full"
          alt="Video Image"
        />
        {type === 'video' && (
          <div className="border-foreground absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 p-2">
            <Play className="text-foreground fill-foreground h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex flex-col bg-[#F1F2F9] p-3 py-2">
        {/* TODO: Product Name ? */}
        <span className="text-background-secondary text-base font-medium lg:text-lg">
          Lorem ipsum dolor sit amet
        </span>
        {/* TODO: Client Name ? */}
        <span className="text-xs text-[#444444] lg:text-sm">
          Client: Lorem ipsum dolor sit amet
        </span>
      </div>
    </div>
  );
};

export default ProductItem;
