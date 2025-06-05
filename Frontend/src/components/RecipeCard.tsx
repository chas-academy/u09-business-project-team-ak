interface RecipeCardProps {
  title: string;
  image: string;
  sourceUrl: string;
}

export default function RecipeCard({ title, image, sourceUrl }: RecipeCardProps) {
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View recipe for ${title}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 w-full"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{title}</h3>
        <p className="text-sm text-orange-500 font-semibold mt-2">View Recipe →</p>
      </div>
    </a>
  );
}
