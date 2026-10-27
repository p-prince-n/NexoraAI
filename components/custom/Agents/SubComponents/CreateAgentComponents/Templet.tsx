import React from "react";

const Templet = ({ Icon, iconBg, iconColor, title, description }: any) => {
  console.log(iconBg);

  return (
    <div>
      <Icon className={`size-12 p-2 ${iconBg} ${iconColor} rounded-2xl `} />
      <div className="mt-5">
        <h2 className="font-semibold text-foreground transition-colors duration-300 dark:text-purple-50">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-5 text-muted-foreground transition-colors duration-300 dark:text-purple-200/70">
          {description}
        </p>
      </div>
    </div>
  );
};

export default React.memo(Templet);
