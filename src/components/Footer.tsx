export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border mt-auto">
      <p className="font-bold" suppressHydrationWarning>
        بالجملة BelGomla © {currentYear}
      </p>
      <p className="text-xs mt-1">وفر فرق المحلات في جيبك</p>
    </footer>
  );
}
