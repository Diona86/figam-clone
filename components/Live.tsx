/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@/liveblocks.config";
import LiveCursors from "./cursor/LiveCursors";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import * as fabric from "fabric";
import CursorChat from "./cursor/CursorChat";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";
import { Comments } from "./comments/Comments";

type Props={
  canvasRef:React.RefObject<HTMLCanvasElement | null>;
  fabricRef: React.RefObject<fabric.Canvas | null>;
}

const Live = ({canvasRef, fabricRef}:Props) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const [reaction, setReaction] = useState<Reaction[]>([]);
  {/**移除旧的FlyingReaction */}
  const broadcast=useBroadcastEvent()
  useInterval(()=>{
    setReaction((state)=>state.filter(v=>v.timestamp<Date.now()-3000))
  },2000)
  {/**增加新的FlyingReaction */}
  useInterval(()=>{
    if(cursorState.mode===CursorMode.Reaction&&cursorState.isPressed&&cursor){
        console.log(reaction)
        setReaction((reactions)=>reactions.concat([{
            point:{x:cursor.x,y:cursor.y},
            value:cursorState.reaction,
            timestamp:Date.now()
        }]))
        broadcast({//将自己发送的表情广播到Room
          x:cursor.x,
          y:cursor.y,
          value:cursorState.reaction
        })
    }
  },100)
  {/**从Room获取其他用户的表情 */}
  useEventListener((eventData)=>{
    const event=eventData.event as ReactionEvent;
    setReaction((reactions)=>reactions.concat([{
            point:{x:event.x,y:event.y},
            value:event.value,
            timestamp:Date.now()
        }]))
  })

  const containerRef = useRef<HTMLDivElement>(null);

  // 监听容器大小变化并调整 Canvas 尺寸
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !canvas) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const canvasElement = canvasRef.current;
      const fabricCanvas = fabricRef.current;
      
      if (canvasElement && fabricCanvas) {
        // 设置 HTML Canvas 元素的 CSS 尺寸
        canvasElement.style.width = `${rect.width}px`;
        canvasElement.style.height = `${rect.height}px`;
        
        // 延迟调用 Fabric.js 的重新计算
        setTimeout(() => {
          if (fabricCanvas.calcViewportBoundaries) {
            fabricCanvas.calcViewportBoundaries();
          }
          fabricCanvas.renderAll();
        }, 50);
      }
    };

    // 初始设置
    resizeCanvas();

    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef, fabricRef]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY;
      updateMyPresence({ cursor: { x, y } }); //上传个人状态。鼠标位置
    }
  }, []);
  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden });
    updateMyPresence({ cursor: null, message: null });
  }, []);
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY;
      updateMyPresence({ cursor: { x, y } });
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state,
      );
    },
    [cursorState.mode, setCursorState],
  );
  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: false }
          : state,
      );
    },
    [cursorState.mode, setCursorState],
  );
  const setReactions = useCallback(
    (reaction: string) => {
      setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
    }, []);
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);
  return (
    <div
      ref={containerRef}
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="h-full w-full flex justify-center items-center text-center "
    >
      <canvas ref={canvasRef}/>
      {reaction.map((r) => (
        <FlyingReaction 
        key={r.timestamp}
        value={r.value}
        x={r.point.x}
        y={r.point.y}
        timestamp={r.timestamp}
        />
      ))}
      <LiveCursors others={others} />
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReactions} />
      )}
      {/* <Comments/> */}
    </div>
  );
};

export default Live;
