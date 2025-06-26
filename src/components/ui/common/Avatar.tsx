import Image from "next/image";

interface AvatarProps {
  src: string;
  alt?: string;
}

/**
 * Generic avatar component.
 * Keeps the ring and sizing consistent across the app.
 */
const Avatar: React.FC<AvatarProps> = ({ src, alt = "User avatar" }) => {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#008cff]/50">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="32px"
        className="object-cover"
      />
    </div>
  );
};

export default Avatar;
