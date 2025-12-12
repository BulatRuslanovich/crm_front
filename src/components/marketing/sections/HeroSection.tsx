"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Background from "../ui/Background";

export default function HeroSection() {
  return (
    <section
      className="min-h-screen w-full flex items-center justify-center p-6 relative bg-background"
      id="top"
    >
      <Background />
      <div className="max-w-4xl mx-auto text-center z-20">

        {/* Заголовок */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-black to-gray-600 dark:from-white">
            FarmCRM
          </span>
        </motion.h1>

        {/* Подзаголовок */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-medium"
        >
          Оптимизируйте работу медицинских представителей, управляйте взаимоотношениями
          с ЛПУ и увеличивайте эффективность продаж.
        </motion.p>

        {/* Кнопки призыва к действию */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-3.5 dark:bg-white dark:text-black bg-black text-white font-medium rounded-lg flex items-center justify-center gap-2"
          >
            Начать демо
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-3.5 dark:text-white text-black font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            Подробнее
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-sm text-gray-500"
        >
          <p>Лучшее решение на СНГ рынке</p>
        </motion.div>

        {/* Добавлено после индикаторов доверия */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-24"
        >

          <motion.div
            className="relative h-px w-full max-w-xs mx-auto bg-linear-to-r from-transparent via-gray-500 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.div
              className="absolute -top-1 left-1/2 w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                x: [-60, 60, -60],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>


          <motion.p
            className="mt-8 text-xs text-gray-500 tracking-widest uppercase"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.4 }}
          >
            Эффективность в фармацевтике
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}