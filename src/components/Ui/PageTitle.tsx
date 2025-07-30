import React from "react";
import clsx from "clsx";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const alignmentMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  align = "left",
  className = "",
}) => {
  return (
    <div className={clsx("mb-6", alignmentMap[align], className)}>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;
