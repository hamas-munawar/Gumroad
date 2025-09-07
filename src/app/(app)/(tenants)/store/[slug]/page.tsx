"use client";
import { useParams } from 'next/navigation';

const TenantPage = () => {
  const params = useParams();

  return <div>{params.slug + "'"}s store</div>;
};

export default TenantPage;
