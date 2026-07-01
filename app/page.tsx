"use client";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, FabricObject } from "fabric";
import type { TPointerEvent } from "fabric";
import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isDrawing = useRef(false);
  const selectedShapeRef = useRef<string | null>(null);
  const shapeRef = useRef<FabricObject | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef=useRef(false)
  
  // 侧边栏收起状态
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });
  const activeObjectRef = useRef<FabricObject | null>(null);
  //本地使用的liveblocks的canvasObjects
  const canvasObjects = useStorage((root) => root.canvasObjects); //从根节点获取画布元素
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object || !object.objectId) return; // 添加安全检查
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects) {
      return;
    }
    canvasObjects.set(objectId, shapeData);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) {
      return true;
    }
    for (const key of [...canvasObjects.keys()]) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);
  const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(objectId);
  }, []);

  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element);
    switch (element?.value) {
      case "reset":
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;
      case "delete":
        handleDelete(fabricRef.current as Canvas, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        break;
      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;
        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;
      default:
        break;
    }
    selectedShapeRef.current = element?.value as string;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }
    const canvas = initializeFabric({ canvasRef, fabricRef });
    if (canvas) {
      canvas.on("mouse:down", (options) => {
        handleCanvasMouseDown({
          options,
          canvas: canvas as Canvas,
          isDrawing,
          selectedShapeRef,
          shapeRef,
        });
      });
      canvas.on("mouse:move", (options) => {
        handleCanvasMouseMove({
          options,
          canvas: canvas as Canvas,
          isDrawing,
          selectedShapeRef,
          shapeRef,
          syncShapeInStorage,
        });
      });
      canvas.on("mouse:up", (options) => {
        handleCanvasMouseUp({
          canvas: canvas as Canvas,
          isDrawing,
          shapeRef,
          selectedShapeRef,
          syncShapeInStorage,
          setActiveElement,
          activeObjectRef,
        });
      });

      canvas.on("object:modified", (options) => {
        handleCanvasObjectModified({
          options,
          syncShapeInStorage,
        });
      });
      canvas.on("selection:created",(options)=>{
        handleCanvasSelectionCreated({
          options,
          isEditingRef,
          setElementAttributes
        })
      })
      canvas.on("object:scaling",(options)=>{
        handleCanvasObjectScaling({
          options,setElementAttributes
        })
      })
    }
    return () => {
      canvas?.dispose();
    };
  }, []);

  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current as Canvas,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      });
    };

    const handleResizeEvent = () => {
      handleResize({ fabricRef });
    };

    window.addEventListener("keydown", handleKeyDownEvent);
    window.addEventListener("resize", handleResizeEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
      window.removeEventListener("resize", handleResizeEvent);
    };
  }, []);

  useEffect(() => {
    console.log("canvasObjects 更新了 → ", canvasObjects);
    console.log(
      "当前 fabric canvas 对象数量：",
      fabricRef.current?.getObjects().length,
    );
    
    // 添加防抖来减少重渲染频率
    const timeoutId = setTimeout(() => {
      renderCanvas({
        fabricRef,
        canvasObjects,
        activeObjectRef,
      });
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [canvasObjects]);

  return (
    <main className="h-screen overflow-hideen">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e: any) => {
          e.stopPropagation();
          
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          })
        }}
      />
      <section className={`h-[calc(100vh-60px)] w-full flex transition-all duration-300`}>
        <div className={`${leftSidebarCollapsed ? 'w-0' : 'w-auto'} transition-all duration-300`}>
          <LeftSidebar 
            allShapes={Array.from(canvasObjects)} 
            onCollapseChange={setLeftSidebarCollapsed}
          />
        </div>
        <div className={`flex-1 transition-all duration-300`}>
          <Live canvasRef={canvasRef} fabricRef={fabricRef} />
        </div>
        <div className={`${rightSidebarCollapsed ? 'w-0' : 'w-auto'} transition-all duration-300`}>
          <RightSidebar 
            elementAttributes={elementAttributes}
            setElementAttributes={setElementAttributes}
            fabricRef={fabricRef}
            isEditingRef={isEditingRef}
            activeObjectRef={activeObjectRef}
            syncShapeInStorage={syncShapeInStorage}
            onCollapseChange={setRightSidebarCollapsed}
          />
        </div>
      </section>
    </main>
  );
}
