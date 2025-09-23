import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";

import StarPicker from "./StarPicker";

interface ReviewSidebarProps {
  productId: string;
}

const formSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description must be at most 500 characters long" }),
});

type FormSchema = z.infer<typeof formSchema>;

const ReviewSidebar = ({ productId }: ReviewSidebarProps) => {
  const trpc = useTRPC();
  const { data: review } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  );

  const initialReviewData = review
    ? {
        rating: review.rating,
        description: review.description,
      }
    : { rating: 0, description: "" };

  const [isPreview, setIsPreview] = useState(!!initialReviewData.description);

  const form = useForm<FormSchema>({
    defaultValues: initialReviewData,
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit((data) => console.log(data))}
      >
        <p className="font-medium">
          {isPreview ? "Your Review" : "Liked it? Leave a Review!"}
        </p>
        <FormField
          name="rating"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Want to leave a review?"
                  disabled={isPreview}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant="elevated"
            type="submit"
            size={"lg"}
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {initialReviewData.description ? "Update Review" : "Submit Review"}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          variant="ghost"
          size={"lg"}
          className="w-fit"
          type="button"
          onClick={() => setIsPreview(false)}
        >
          Edit Review
        </Button>
      )}
    </Form>
  );
};

export default ReviewSidebar;
