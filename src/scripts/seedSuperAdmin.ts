import { getPayload } from 'payload';

import payloadConfig from '@/payload.config';

const seed = async () => {
  const payload = await getPayload({ config: payloadConfig });

  const user = await payload.create({
    collection: "users",
    data: {
      email: "admin@demo.com",
      password: "admindemo",
      roles: ["super-admin"],
      username: "admindemo",
    },
  });

  console.log(user);
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
