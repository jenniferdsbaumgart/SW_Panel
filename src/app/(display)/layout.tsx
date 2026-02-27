export default function DisplayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-night">
      <div className="relative aspect-[2/1] h-full max-h-screen max-w-[200vh] w-full">
        {children}
      </div>
    </div>
  );
}
