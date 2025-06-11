interface CardProps {
  title: string;
  image: string;
  price?: string;
}

const Card = ({ title, image, price }: CardProps) => {
  return (
    <div className="min-w-[250px] bg-neutral-900 rounded-lg overflow-hidden snap-center hover:scale-[1.02] transition-transform duration-200">
      <div className="relative h-[150px] w-full">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium text-lg">{title}</h3>
        {price && <p className="text-emerald-500 mt-2">{price}</p>}
      </div>
    </div>
  );
};

export default Card;
