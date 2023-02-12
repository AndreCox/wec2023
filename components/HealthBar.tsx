import { prototype } from "events";
import { motion } from "framer-motion";

type HealthBarProps = {
  percent: number;
};

export default function HealthBar({ percent }: HealthBarProps) {
  // limit percent to 0-100
  percent = Math.max(0, Math.min(100, percent));

  //convert percent to range of hex colors from green to red
  const hex = Math.round((255 * percent) / 100).toString(16);

  return (
    <div className="h-64 w-8 shadow-lg bg-black ml-auto mr-auto rounded-lg flex justify-end flex-col transition-all overflow-clip">
      <motion.div
        initial={false}
        className="bg-red-500 w-full rounded-lg "
        animate={{
          height: `${percent}%`,
          backgroundColor: `${getColor(1 - percent / 100)}`,
        }}
      ></motion.div>
    </div>
  );
}

function getColor(value) {
  //value from 0 to 1
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}
