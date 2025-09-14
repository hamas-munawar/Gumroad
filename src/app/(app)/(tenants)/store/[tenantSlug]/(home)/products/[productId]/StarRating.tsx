import { StarIcon } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          size={20}
          className={`${index - rating < 0 && "fill-black"}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
