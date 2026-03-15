import React from "react";
import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
  color: string;
  x: number;
  y: number;
  message: string;
};

const Cursor = ({ color, x, y, message }: Props) => {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
    >
      <CursorSVG color={color} />
      {message && <span className="z-10 w-60 border-none px-4 py-2 rounded-2xl absolute flex top-5 left-2 text-sm text-white "
      style={{backgroundColor:color}}
      >{message}</span>}
    </div>
  );
};

export default Cursor;
