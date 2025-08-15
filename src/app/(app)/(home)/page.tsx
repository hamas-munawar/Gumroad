import configPromise from "@payload-config";
import { getPayload } from "payload";

export default async function HomePage() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
  });

  return <section></section>;
}
