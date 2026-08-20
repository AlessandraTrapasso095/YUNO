"use client";

import {
  Check,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useI18n } from "../i18n/I18nProvider";

const FRAME_WIDTH = 430;
const FRAME_HEIGHT = 238;
const OUTPUT_SCALE = 2;

type Point = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

type ProfilePhotoCropperProps = {
  src: string;
  onCancel: () => void;
  onApply: (image: string) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ProfilePhotoCropper({
  src,
  onCancel,
  onApply,
}: ProfilePhotoCropperProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    offset: Point;
  } | null>(null);

  const [imageSize, setImageSize] = useState<ImageSize>({
    width: 0,
    height: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);

  const getGeometry = useCallback(
    (
      targetWidth = FRAME_WIDTH,
      targetHeight = FRAME_HEIGHT,
      targetZoom = zoom,
    ) => {
      if (!imageSize.width || !imageSize.height) {
        return null;
      }

      const baseScale = Math.max(
        targetWidth / imageSize.width,
        targetHeight / imageSize.height,
      );

      const scale = baseScale * targetZoom;
      const renderedWidth = imageSize.width * scale;
      const renderedHeight = imageSize.height * scale;

      const maxX = Math.max(
        0,
        (renderedWidth - targetWidth) / 2,
      );
      const maxY = Math.max(
        0,
        (renderedHeight - targetHeight) / 2,
      );

      return {
        scale,
        renderedWidth,
        renderedHeight,
        maxX,
        maxY,
      };
    },
    [imageSize, zoom],
  );

  const clampOffset = useCallback(
    (
      nextOffset: Point,
      targetZoom = zoom,
    ): Point => {
      const geometry = getGeometry(
        FRAME_WIDTH,
        FRAME_HEIGHT,
        targetZoom,
      );

      if (!geometry) return nextOffset;

      return {
        x: clamp(
          nextOffset.x,
          -geometry.maxX,
          geometry.maxX,
        ),
        y: clamp(
          nextOffset.y,
          -geometry.maxY,
          geometry.maxY,
        ),
      };
    },
    [getGeometry, zoom],
  );

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const geometry = getGeometry();

    if (!geometry) return;

    const safeOffset = clampOffset(offset);

    context.clearRect(
      0,
      0,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    );

    context.drawImage(
      image,
      (FRAME_WIDTH - geometry.renderedWidth) / 2 +
        safeOffset.x,
      (FRAME_HEIGHT - geometry.renderedHeight) / 2 +
        safeOffset.y,
      geometry.renderedWidth,
      geometry.renderedHeight,
    );
  }, [clampOffset, getGeometry, offset]);

  useEffect(() => {
    const image = new window.Image();

    image.onload = () => {
      imageRef.current = image;
      setImageSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };

    image.src = src;

    return () => {
      image.onload = null;
    };
  }, [src]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  function changeZoom(nextZoom: number) {
    const safeZoom = clamp(nextZoom, 1, 3);

    setZoom(safeZoom);
    setOffset((current) =>
      clampOffset(current, safeZoom),
    );
  }

  function resetCrop() {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLCanvasElement>,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      offset,
    };

    setDragging(true);
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLCanvasElement>,
  ) {
    const drag = dragRef.current;
    const canvas = canvasRef.current;

    if (
      !drag ||
      !canvas ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const deltaX =
      (event.clientX - drag.clientX) *
      (FRAME_WIDTH / rect.width);

    const deltaY =
      (event.clientY - drag.clientY) *
      (FRAME_HEIGHT / rect.height);

    setOffset(
      clampOffset({
        x: drag.offset.x + deltaX,
        y: drag.offset.y + deltaY,
      }),
    );
  }

  function endDrag(
    event: React.PointerEvent<HTMLCanvasElement>,
  ) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  }

  function applyCrop() {
    const image = imageRef.current;

    if (!image) return;

    const outputWidth = FRAME_WIDTH * OUTPUT_SCALE;
    const outputHeight = FRAME_HEIGHT * OUTPUT_SCALE;

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const context = canvas.getContext("2d");

    if (!context) return;

    const geometry = getGeometry(
      outputWidth,
      outputHeight,
      zoom,
    );

    if (!geometry) return;

    const safeOffset = clampOffset(offset);

    context.drawImage(
      image,
      (outputWidth - geometry.renderedWidth) / 2 +
        safeOffset.x * OUTPUT_SCALE,
      (outputHeight - geometry.renderedHeight) / 2 +
        safeOffset.y * OUTPUT_SCALE,
      geometry.renderedWidth,
      geometry.renderedHeight,
    );

    onApply(canvas.toDataURL("image/jpeg", 0.88));
  }

  return (
    <div className="profile-photo-cropper">
      <div className="profile-photo-cropper__header">
        <div>
          <strong>{t("profile.editModal.cropTitle")}</strong>
          <p>{t("profile.editModal.cropCopy")}</p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label={t("common.close")}
        >
          <X size={17} />
        </button>
      </div>

      <div className="profile-photo-cropper__stage">
        <canvas
          ref={canvasRef}
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          className={
            dragging
              ? "profile-photo-cropper__canvas is-dragging"
              : "profile-photo-cropper__canvas"
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={resetCrop}
          aria-label={t("profile.editModal.cropArea")}
        />

        <div
          className="profile-photo-cropper__hint"
          aria-hidden="true"
        >
          {t("profile.editModal.dragPhoto")}
        </div>
      </div>

      <div className="profile-photo-cropper__zoom">
        <button
          type="button"
          onClick={() => changeZoom(zoom - 0.1)}
          disabled={zoom <= 1}
          aria-label={t("profile.editModal.zoomOut")}
        >
          <Minus size={16} />
        </button>

        <div>
          <span>{t("profile.editModal.zoom")}</span>

          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) =>
              changeZoom(Number(event.target.value))
            }
            aria-label={t("profile.editModal.zoom")}
          />
        </div>

        <button
          type="button"
          onClick={() => changeZoom(zoom + 0.1)}
          disabled={zoom >= 3}
          aria-label={t("profile.editModal.zoomIn")}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="profile-photo-cropper__actions">
        <button
          type="button"
          className="profile-photo-cropper__reset"
          onClick={resetCrop}
        >
          <RotateCcw size={15} />
          {t("profile.editModal.resetPhoto")}
        </button>

        <button
          type="button"
          className="profile-photo-cropper__apply"
          onClick={applyCrop}
        >
          <Check size={15} />
          {t("profile.editModal.applyPhoto")}
        </button>
      </div>
    </div>
  );
}
