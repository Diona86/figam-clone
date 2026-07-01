/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/canvas.ts
"use client"; // 强烈建议加在文件顶部（Next.js 客户端组件）

import {
  Canvas,
  FabricObject,
  TEvent,
  TPointerEvent,
  Point,
  // 按需导入你实际用到的类（可以后续再加）
  Rect,
  Circle,
  Triangle,
  Line,
  // Path, // 如果 freehand 路径需要特殊处理可导入
} from "fabric";
import * as fabric from "fabric";

import { v4 as uuid4 } from "uuid";

import {
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasPathCreated,
  CanvasSelectionCreated,
  RenderCanvas,
} from "@/types/type";

import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "./shapes";

// 防抖函数
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 全局防抖缓存
const debouncedSyncCache = new Map<(shape: FabricObject) => void, (shape: FabricObject) => void>();

// 获取或创建防抖版本的存储同步函数
const getDebouncedSync = (syncShapeInStorage: (shape: FabricObject) => void, delay: number = 50) => {
  if (!debouncedSyncCache.has(syncShapeInStorage)) {
    debouncedSyncCache.set(syncShapeInStorage, debounce(syncShapeInStorage, delay));
  }
  return debouncedSyncCache.get(syncShapeInStorage)!;
};

// 初始化 fabric canvas
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.RefObject<Canvas | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasRef.current || !canvasElement) return null;

  const canvas = new Canvas(canvasRef.current, {
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
    // 可选：其他常用初始化配置
    // preserveObjectStacking: true,
    // selection: true,
  });

  fabricRef.current = canvas;
  return canvas;
};

// 处理鼠标按下 - 创建形状或进入自由绘制模式
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}: CanvasMouseDown) => {
  const pointer = { x: (options.e as PointerEvent).offsetX, y: (options.e as PointerEvent).offsetY };

  const target = canvas.findTarget(options.e as PointerEvent) as any;

  canvas.isDrawingMode = false;

  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = 5;
    }
    return;
  }

  canvas.isDrawingMode = false;

  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false;
    canvas.setActiveObject(target);
    target.setCoords();
  } else {
    isDrawing.current = true;

    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer as any
    );

    if (shapeRef.current) {
      canvas.add(shapeRef.current);
    }
  }
};

// 鼠标移动 - 实时更新形状尺寸
export const handleCanvasMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  if (!isDrawing.current) return;
  if (selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;

  const pointer = { x: (options.e as PointerEvent).offsetX, y: (options.e as PointerEvent).offsetY };

  if (!shapeRef.current) return;

  switch (selectedShapeRef.current) {
    case "rectangle":
      shapeRef.current.set({
        width: pointer.x - (shapeRef.current.left ?? 0),
        height: pointer.y - (shapeRef.current.top ?? 0),
      });
      break;

    case "circle":
      shapeRef.current.set({
        radius:
          Math.abs(pointer.x - (shapeRef.current.left ?? 0)) / 2,
      });
      break;

    case "triangle":
      shapeRef.current.set({
        width: pointer.x - (shapeRef.current.left ?? 0),
        height: pointer.y - (shapeRef.current.top ?? 0),
      });
      break;

    case "line":
      shapeRef.current.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;

    case "image":
      shapeRef.current.set({
        width: pointer.x - (shapeRef.current.left ?? 0),
        height: pointer.y - (shapeRef.current.top ?? 0),
      });
      break;

    default:
      break;
  }

  canvas.requestRenderAll();

  // 使用防抖来减少存储更新频率
  if (shapeRef.current?.objectId) {
    const debouncedSync = getDebouncedSync(syncShapeInStorage, 50);
    debouncedSync(shapeRef.current);
  }
};

// 鼠标抬起 - 结束绘制
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false;
  if (selectedShapeRef.current === "freeform") return;

  if (shapeRef.current) {
    syncShapeInStorage(shapeRef.current);
  }

  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;

  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 700);
  }
};

// 对象被修改（移动、旋转等）
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = (options as any).target as FabricObject | null;
  if (!target) return;

  if (target.type === "activeSelection") {
    // 如果是多选，遍历处理每个子对象
    const selectedObjects = (target as any).getObjects();
    selectedObjects?.forEach((obj: FabricObject) => {
      syncShapeInStorage(obj);
    });
  } else {
    syncShapeInStorage(target);
  }
};

// 自由绘制路径创建完成
export const handlePathCreated = ({
  options,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  const path = options.path as FabricObject;
  if (!path) return;

  path.set({
    objectId: uuid4(),
  });

  syncShapeInStorage(path);
};

// 限制对象不移出画布边界
export const handleCanvasObjectMoving = ({
  options,
}: {
  options: TEvent;
}) => {
  const target = (options as any).target as FabricObject | null;
  if (!target || !target.canvas) return;

  const canvas = target.canvas as Canvas;

  target.setCoords();

  const width = target.getScaledWidth() ?? target.width ?? 0;
  const height = target.getScaledHeight() ?? target.height ?? 0;

  if (target.left != null) {
    target.left = Math.max(0, Math.min(target.left, (canvas.width ?? 0) - width));
  }

  if (target.top != null) {
    target.top = Math.max(0, Math.min(target.top, (canvas.height ?? 0) - height));
  }
};

// 选中对象时更新属性面板
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  // 移除 isEditingRef 检查，确保选中时总是更新属性
  if (!(options as any)?.selected?.length) return;

  const selected = (options as any).selected[0] as FabricObject;

  if ((options as any).selected.length === 1 && selected) {
    const scaledWidth = selected.scaleX
      ? (selected.width ?? 0) * selected.scaleX
      : selected.width;

    const scaledHeight = selected.scaleY
      ? (selected.height ?? 0) * selected.scaleY
      : selected.height;

    setElementAttributes({
      width: scaledWidth?.toFixed(0) ?? "",
      height: scaledHeight?.toFixed(0) ?? "",
      fill: (selected.fill as string) ?? "",
      stroke: (selected.stroke as string) ?? "",
      fontSize: (selected as any).fontSize ?? "",
      fontFamily: (selected as any).fontFamily ?? "",
      fontWeight: (selected as any).fontWeight ?? "",
    });
  }
};

// 对象缩放时更新属性
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const target = (options as any).target as FabricObject | null;
  if (!target) return;

  const scaledWidth = target.scaleX
    ? (target.width ?? 0) * target.scaleX
    : target.width;

  const scaledHeight = target.scaleY
    ? (target.height ?? 0) * target.scaleY
    : target.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0) ?? "",
    height: scaledHeight?.toFixed(0) ?? "",
  }));
};

// 从存储数据渲染画布
export const renderCanvas = async ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvas) => {
  if (!fabricRef.current) return;

  const canvas = fabricRef.current;
  
  // 获取当前画布上的选中状态
  const currentActiveObject = canvas.getActiveObject();
  
  // 如果有活跃对象（正在操作中），暂时不重新渲染
  if (currentActiveObject) {
    return;
  }
  
  
  const currentObjectCount = canvas.getObjects().length;//本地画布上的对象数量
  const storageObjectCount = canvasObjects.size;//liveblocks的canvasObjects对象数量
  //如果本地画布上的对象数量和liveblocks的canvasObjects对象数量相同，并且liveblocks的canvasObjects对象数量为0，则跳过重渲染
  if (currentObjectCount === storageObjectCount && storageObjectCount === 0) {
    return; // 都是空的，无需重渲染
  }
  
  canvas.clear();  // 先清空

  const objectDataArray = Array.from(canvasObjects.values());
  
  if (objectDataArray.length === 0) {
    canvas.requestRenderAll();
    return;
  }

  try {
    // 现代 Fabric 用法：返回 Promise
    const enlivenedObjects = await fabric.util.enlivenObjects(objectDataArray);

    const activeId = activeObjectRef.current?.objectId;

    enlivenedObjects.forEach((obj: any) => {
      if (obj) {  // 防止 null/undefined
        canvas.add(obj);

        if (obj.objectId === activeId) {
          canvas.setActiveObject(obj);
          activeObjectRef.current = obj;  // 更新 ref，防止下次丢失选中
        }
      }
    });

    canvas.requestRenderAll();
  } catch (error) {
    console.error("enlivenObjects 失败:", error);
    // 可选：这里可以加一个 fallback，比如 canvas.loadFromJSON(...)
    canvas.requestRenderAll();
  }
};

// 窗口大小变化时调整画布
export const handleResize = ({ fabricRef }: { fabricRef: React.MutableRefObject<Canvas | null> }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement || !fabricRef.current) return;

  fabricRef.current.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

// 滚轮缩放（注意：v6 中 zoomToPoint 用法不变，但建议加边界控制）
export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: TEvent & { e: WheelEvent };
  canvas: Canvas;
}) => {
  const delta = options.e.deltaY;
  let zoom = canvas.getZoom();

  const minZoom = 0.2;
  const maxZoom = 2.0; // 可以适当放宽上限
  const zoomStep = 0.001;

  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

  canvas.zoomToPoint(
    new Point(options.e.offsetX, options.e.offsetY),
    zoom
  );

  options.e.preventDefault();
  options.e.stopPropagation();
};