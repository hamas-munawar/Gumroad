import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CategoriesBredgrum = () => {
  const { categories } = useParams();
  const [category, subCategory] = categories || [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {category && (
          <BreadcrumbItem>
            <Link
              href={`/${category}`}
              className="text-xl text-black underline"
            >
              {category}
            </Link>
          </BreadcrumbItem>
        )}
        {subCategory && (
          <>
            <BreadcrumbSeparator className="text-black" />
            <BreadcrumbItem className="text-xl text-black cursor-default">
              {subCategory}
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CategoriesBredgrum;
