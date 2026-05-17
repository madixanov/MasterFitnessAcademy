export default function AuthFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex justify-center items-center p-6">
      <p className="text-[#999]">
        © {currentYear} Master Fitness Training. Все права защищены.
      </p>
    </footer>
  );
}