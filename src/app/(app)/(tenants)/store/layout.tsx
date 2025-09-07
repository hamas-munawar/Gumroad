import TenantNavbar from "./TenantNavbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <TenantNavbar />
      <div className="flex-1 bg-[#f4f4f0] ">{children}</div>
    </div>
  );
}
