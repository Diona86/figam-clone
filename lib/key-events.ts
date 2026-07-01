import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

import { CustomFabricObject } from "@/types/type";

/**
 * 处理复制操作
 * @param canvas - Fabric.js 画布对象
 * @returns 被复制的活动对象数组
 */
export const handleCopy = (canvas: fabric.Canvas) => {
  // 获取当前选中的所有对象
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 0) {
    // 将选中的对象序列化为 JSON 格式
    const serializedObjects = activeObjects.map((obj) => obj.toObject());
    // 将序列化后的对象存储到浏览器的 localStorage 中作为剪贴板
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
  }

  return activeObjects;
};

export const handlePaste = (
  canvas: fabric.Canvas,
  syncShapeInStorage: (shape: fabric.Object) => void
) => {
  if (!canvas || !(canvas instanceof fabric.Canvas)) {
    console.error("Invalid canvas object. Aborting paste operation.");
    return;
  }

  // Retrieve serialized objects from the clipboard
  const clipboardData = localStorage.getItem("clipboard");

  if (clipboardData) {
    try {
      const parsedObjects = JSON.parse(clipboardData);
      
      // 一次性处理所有对象
      // @ts-expect-error - Fabric.js v7 API change
      fabric.util.enlivenObjects(parsedObjects).then((enlivenedObjects: fabric.Object[]) => {
        enlivenedObjects.forEach((enlivenedObj) => {
          // Offset the pasted objects to avoid overlap with existing objects
          enlivenedObj.set({
            left: (enlivenedObj.left || 0) + 100,
            top: (enlivenedObj.top || 0) + 100,
            objectId: uuidv4(),
            fill: "#aabbcc",
          } as CustomFabricObject<fabric.Object>);

          canvas.add(enlivenedObj);
          syncShapeInStorage(enlivenedObj);
        });
        
        // 选中所有粘贴的对象
        if (enlivenedObjects.length > 0) {
          if (enlivenedObjects.length === 1) {
            canvas.setActiveObject(enlivenedObjects[0]);
          } else {
            // 创建一个选择组来包含所有粘贴的对象
            const selection = new fabric.ActiveSelection(enlivenedObjects, {
              canvas: canvas,
            });
            canvas.setActiveObject(selection);
          }
        }
        
        // 只渲染一次
        canvas.requestRenderAll();
      });
    } catch (error) {
      console.error("Error parsing clipboard data:", error);
    }
  }
};

export const handleDelete = (
  canvas: fabric.Canvas,
  deleteShapeFromStorage: (id: string) => void
) => {
  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects || activeObjects.length === 0) return;

  if (activeObjects.length > 0) {
    activeObjects.forEach((obj: CustomFabricObject<fabric.Object>) => {
      if (!obj.objectId) return;
      canvas.remove(obj);
      deleteShapeFromStorage(obj.objectId);
    });
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

// create a handleKeyDown function that listen to different keydown events
export const handleKeyDown = ({
  e,
  canvas,
  undo,
  redo,
  syncShapeInStorage,
  deleteShapeFromStorage,
}: {
  e: KeyboardEvent;
  canvas: fabric.Canvas;
  undo: () => void;
  redo: () => void;
  syncShapeInStorage: (shape: fabric.Object) => void;
  deleteShapeFromStorage: (id: string) => void;
}) => {
  // Check if the key pressed is ctrl/cmd + c (copy)
  if ((e?.ctrlKey || e?.metaKey) && e.key === 'c') {
    handleCopy(canvas);
  }

  // Check if the key pressed is ctrl/cmd + v (paste)
  if ((e?.ctrlKey || e?.metaKey) && e.key === 'v') {
    handlePaste(canvas, syncShapeInStorage);
  }

  // Check if the key pressed is delete/backspace (delete)
  if (e.key === 'Backspace' || e.key === 'Delete') {
    handleDelete(canvas, deleteShapeFromStorage);
  }

  // check if the key pressed is ctrl/cmd + x (cut)
  if ((e?.ctrlKey || e?.metaKey) && e.key === 'x') {
    handleCopy(canvas);
    handleDelete(canvas, deleteShapeFromStorage);
  }

  // check if the key pressed is ctrl/cmd + z (undo)
  if ((e?.ctrlKey || e?.metaKey) && e.key === 'z' && !e.shiftKey) {
    undo();
  }

  // check if the key pressed is ctrl/cmd + shift + z or ctrl/cmd + y (redo)
  if ((e?.ctrlKey || e?.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    redo();
  }

  if (e.key === '/' && !e.shiftKey) {
    e.preventDefault();
  }
};
