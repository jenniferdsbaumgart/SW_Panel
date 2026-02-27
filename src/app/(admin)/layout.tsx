export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-y-auto bg-night text-white">
      <main className="p-6">{children}</main>
    </div>
  );
}
