"use client";
import { TriangleAlert } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="py-4">
      <div className="border border-black border-dashed w-full flex flex-col justify-center items-center gap-4 rounded-lg bg-white p-8">
        <TriangleAlert />
        <p className="text-base font-medium">Something went wrong!</p>
      </div>
    </div>
  );
};

export default ErrorPage;
