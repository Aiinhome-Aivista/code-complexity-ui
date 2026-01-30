export const metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-gray-200 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">{children}</div>
    </div>
  );
}
