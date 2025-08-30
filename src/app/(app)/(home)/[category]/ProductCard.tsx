import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  product: {
    id: string;
    name: string;
    description?: string | null | undefined;
    price: number;
  };
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card className="w-md rounded-md">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        {/* <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent>
        <p>${product.price}</p>
      </CardContent>
      {/* <CardFooter>
              <p>Card Footer</p>
            </CardFooter> */}
    </Card>
  );
};

export default ProductCard;
