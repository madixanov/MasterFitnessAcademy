"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuVariants = {
  open: {
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Закрытие меню при ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const menuItems = [
    { label: "Главная", href: "/" },
    { label: "Курсы", href: "/catalog" },
    { label: "Дипломы", href: "/diplomas" },
    { label: "Чемпионы", scrollTo: "gallery" },
    { label: "Контакты", scrollTo: "contacts" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Фон меню */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Само меню */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-64 bg-black text-white z-50 flex flex-col"
          >
            <motion.nav
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col gap-6 py-10 px-6 text-xl flex-1"
            >
              {menuItems.map((item) =>
                item.href ? (
                  <motion.div key={item.label} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="hover:text-[#FF6600] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={item.label} variants={itemVariants}>
                    <button
                      onClick={() => {
                        document
                          .getElementById(item.scrollTo!)
                          ?.scrollIntoView({ behavior: "smooth" });
                        onClose();
                      }}
                      className="text-left hover:text-[#FF6600] transition-colors"
                    >
                      {item.label}
                    </button>
                  </motion.div>
                )
              )}
            </motion.nav>

            {/* Кнопка профиля */}
            <motion.button
              variants={itemVariants}
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) window.location.href = "/profile";
                else window.location.href = "/auth";
              }}
              className="mt-auto py-3 px-4 mx-6 mb-6 rounded bg-[#FF6600] font-semibold hover:bg-[#ff8533] transition-colors"
            >
              Профиль
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
