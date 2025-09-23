import { StarIcon } from "lucide-react";

const StarRating = ({
  reviewCount,
  averageRating,
}: {
  reviewCount: number;
  averageRating: number;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            size={20}
            className={`${index - averageRating < 0 && "fill-black"}`}
          />
        ))}
      </div>
      <p className="text-lg font-medium">{reviewCount} ratings</p>
    </div>
  );
};

export default StarRating;
