"use client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // AuthProvider tamamen devre dışı - hiçbir şey yapmıyor
  return <>{children}</>;
}
