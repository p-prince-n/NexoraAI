"use client";

import { useEffect, useState } from "react";

import moment from "moment";

const CurrentTime = () => {
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start justify-center gap-px" >
      <div className="text-lg font-semibold" >{time.format("dddd, MMMM D")}</div>
      <span className="text-xs font-light">{time.format("hh:mm:ss A")}</span>
    </div>
  );
};

export default CurrentTime;