import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "@/types/type";

export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as any
  );
};

export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  } as any);
};

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "请输入文本");

    default:
      return null;
  }
};

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result as string, {
      crossOrigin: 'anonymous'
    } as any).then((img: fabric.Image) => {
      // 设置初始位置和大小，而不是使用缩放
      img.set({
        left: 100,
        top: 100,
        scaleX: 1,
        scaleY: 1,
      });

      // 如果图片太大，按比例缩放到合适大小
      const maxSize = 200;
      if (img.width! > maxSize || img.height! > maxSize) {
        const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
        img.set({
          scaleX: scale,
          scaleY: scale,
        });
      }

      canvas.current.add(img);

      // @ts-expect-error - Adding custom property
      img.objectId = uuidv4();

      shapeRef.current = img;

      syncShapeInStorage(img);
      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: PointerEvent,
  shapeType: string
) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // 处理宽度和高度时，保持当前缩放比例
  if (property === "width") {
    const currentScaleX = selectedElement.scaleX || 1;
    const newWidth = parseFloat(value);
    if (!isNaN(newWidth) && newWidth > 0) {
      // 对于图片，需要计算基础宽度
      if (selectedElement.type === "image") {
        const baseWidth = newWidth / currentScaleX;
        selectedElement.set({
          width: baseWidth,
          scaleX: currentScaleX
        });
      } else {
        selectedElement.set({
          width: newWidth,
          scaleX: currentScaleX
        });
      }
    }
  } else if (property === "height") {
    const currentScaleY = selectedElement.scaleY || 1;
    const newHeight = parseFloat(value);
    if (!isNaN(newHeight) && newHeight > 0) {
      // 对于图片，需要计算基础高度
      if (selectedElement.type === "image") {
        const baseHeight = newHeight / currentScaleY;
        selectedElement.set({
          height: baseHeight,
          scaleY: currentScaleY
        });
      } else {
        selectedElement.set({
          height: newHeight,
          scaleY: currentScaleY
        });
      }
    }
  } else {
    if (selectedElement[property as keyof object] === value) return;
    selectedElement.set(property as keyof object, value);
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement;

  // 延迟同步到存储，避免频繁触发 renderCanvas
  const timeoutId = setTimeout(() => {
    syncShapeInStorage(selectedElement);
  }, 10);
  
  // 存储timeout ID以便清理（可选）
  (selectedElement as any)._syncTimeout = timeoutId;
  
  // 立即触发画布重新渲染以显示变化
  canvas.requestRenderAll();
};

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return;

  // get the selected element. If there is no selected element or there are more than one selected element, return
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // bring the selected element to the front
  if (direction === "front") {
    canvas.bringObjectToFront(selectedElement);
  } else if (direction === "back") {
    // In v7, sendToBack is not available, use bringObjectToBack with reverse order
    const objects = canvas.getObjects();
    if (objects.length > 1) {
      canvas.bringObjectToFront(objects[0]);
    }
  }

  // canvas.renderAll();
  syncShapeInStorage(selectedElement);

  // re-render all objects on the canvas
};