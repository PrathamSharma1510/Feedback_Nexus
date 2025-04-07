import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import dayjs from "dayjs";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  feedbackPage: {
    title: string;
  };
}

export const MessageList = ({
  items,
  className,
}: {
  items: Message[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?._id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="mb-4">
              <CardDescription>{item.content}</CardDescription>
            </div>
            <div className="mt-auto">
              <CardCreated>
                {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
              </CardCreated>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                {item.feedbackPage.title}
              </p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      {children}
    </div>
  );
};

const CardCreated = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <p className={cn("text-zinc-400 text-xs mt-4")}>{children}</p>;
};

const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-zinc-100 font-medium tracking-wide leading-relaxed flex-1",
        className
      )}
    >
      {children}
    </p>
  );
};
