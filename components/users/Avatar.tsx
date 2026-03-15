import React from "react";
import Image from "next/image";
import "./index.css";

export function Avatar({
  otherStyles,
  name,
}: {
  name: string;
  otherStyles?: string;
}) {
  // 使用name作为种子，确保相同用户总是显示相同头像
  const seed = name.replace(/\s+/g, "").toLowerCase() || "default";
  // 创建简单的哈希函数来生成一致的数字
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarNumber = hash % 30; // 确保0-29范围内
  const avatarSrc = `https://liveblocks.io/avatars/avatar-${avatarNumber}.png`;

  return (
    <div className={`avatar ${otherStyles || ""}`} data-tooltip={name}>
      <Image src={avatarSrc} fill className={"avatar_picture"} alt={name} />
    </div>
  );
}
