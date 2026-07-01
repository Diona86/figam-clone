"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";

import { getShapeInfo } from "@/lib/utils";

const LeftSidebar = ({ allShapes, onCollapseChange }: { allShapes: Array<any>; onCollapseChange?: (isCollapsed: boolean) => void }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  }, [isCollapsed, onCollapseChange]);

  // memoize the result of this function so that it doesn't change on every render but only when there are new shapes
  const memoizedShapes = useMemo(
    () => (
      <>
        {/* Collapse/Expand Toggle Button */}
        <button
          onClick={handleCollapseToggle}
          className={`absolute top-2 z-10 cursor-pointer flex h-6 w-6 items-center justify-center rounded-full bg-primary-black border border-primary-grey-200 text-primary-grey-300 hover:bg-primary-green hover:text-primary-black transition-all duration-400 ${
            isCollapsed ? 'left-2' : 'left-53.5'
          }`}
        >
          <svg
            className={`h-3 w-3 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
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
        <section className={`flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-56.75 absolute left-0 h-250 max-sm:hidden select-none  pb-20 transition-all duration-200 ${
          isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-56.75 opacity-100'
        }`}>
          <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">Layers</h3>
          <div className="flex flex-col">
            {allShapes?.map((shape: any) => {
              const info = getShapeInfo(shape[1]?.type);

              return (
                <div
                  key={shape[1]?.objectId}
                  className="group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black"
                >
                  <Image
                    src={info?.icon}
                    alt='Layer'
                    width={16}
                    height={16}
                    className='group-hover:invert'
                  />
                  <h3 className='text-sm font-semibold capitalize'>{info.name}</h3>
                </div>
              );
            })}
          </div>
        </section>
      </>
    ),
    [allShapes, isCollapsed, handleCollapseToggle]
  );

  return (
    <div className="relative">
      {memoizedShapes}
    </div>
  );
};

export default LeftSidebar;