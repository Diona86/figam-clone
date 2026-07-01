import React, { useRef, useCallback, useEffect, useState } from "react";
import Dimensions from "./setttings/Dimensions";
import Text from "./setttings/Text";
import Color from "./setttings/Color";
import Export from "./setttings/Export";
import { RightSidebarProps } from "@/types/type";
import { modifyShape } from "@/lib/shapes";

// 防抖函数
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  activeObjectRef,
  syncShapeInStorage,
  onCollapseChange,
}: RightSidebarProps & { onCollapseChange?: (isCollapsed: boolean) => void }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  }, [isCollapsed, onCollapseChange]);
  const colorInputRef = useRef(null); //主体颜色
  const strokeInputRef = useRef(null); //边框颜色

  // 防抖修改函数的 ref
  const debouncedModifyRef = useRef<
    ((property: string, value: string) => void) | null
  >(null);

  // 使用 useEffect 初始化防抖函数
  useEffect(() => {
    debouncedModifyRef.current = debounce((property: string, value: string) => {
      if (fabricRef.current) {
        modifyShape({
          canvas: fabricRef.current,
          property,
          value,
          activeObjectRef,
          syncShapeInStorage,
        });
      }
    }, 100);
  }, [fabricRef, activeObjectRef, syncShapeInStorage]);

  const handleInputChange = useCallback(
    (property: string, value: string) => {
      if (!isEditingRef.current) isEditingRef.current = true;
      setElementAttributes((prev) => ({
        ...prev,
        [property]: value,
      }));
      if (debouncedModifyRef.current) {
        debouncedModifyRef.current(property, value);
      }
    },
    [setElementAttributes, isEditingRef],
  );
  return (
    <>
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={handleCollapseToggle}
        className={`absolute top-16 z-10 cursor-pointer flex h-6 w-6 items-center justify-center rounded-full bg-primary-black border border-primary-grey-200 text-primary-grey-300 hover:bg-primary-green hover:text-primary-black transition-all duration-400 ${
          isCollapsed ? "right-1" : "right-38"
        }`}
      >
        <svg
          className={`h-3 w-3 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Sidebar Content */}
      <section
        className={`absolute right-0 flex flex-col border-t min-w-40 border-primary-grey-100 h-250 bg-primary-black
        select-none max-sm:hidden text-amber-50 transition-all duration-200 ${
          isCollapsed ? "w-0 opacity-0 overflow-hidden pointer-events-none" : "w-40 opacity-100 overflow-x-hidden pointer-events-auto"
        }`}
      >
        <h3 className="px-5 py-4 font-bold text-sm">设计</h3>
        <span className="text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4">
          改变属性
        </span>
        <Dimensions
          width={elementAttributes.width}
          height={elementAttributes.height}
          isEditingRef={isEditingRef}
          handleInputChange={handleInputChange}
        />
        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />
        <Color
          inputRef={colorInputRef}
          attribute={elementAttributes.fill}
          attributeType="fill"
          placeholder="color"
          handleInputChange={handleInputChange}
        />
        <Color
          inputRef={strokeInputRef}
          attribute={elementAttributes.stroke}
          attributeType="stroke"
          placeholder="color"
          handleInputChange={handleInputChange}
        />
        <Export />
      </section>
    </>
  );
};

export default RightSidebar;
