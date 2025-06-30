"use client";

import {
  ReactNode,
  useCallback,
  useState,
  useRef,
  DragEvent,
  useEffect,
} from "react";

import PageNavigationButton from "@/components/PageNavigationButton";
import GapHiddenButton from "@/components/GapHiddenButton";

import PlusSvg from "@/assets/plus.svg";

import { useBoundStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";
import { PageNavItem } from "@/store/pageNavigationSlice";

type Centroid = { x: number; y: number };

export default function PageNavigation() {
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const [pages, activePage, addPage, setActivePage, setPageOrder] =
    useBoundStore(
      useShallow((state) => [
        state.pageNavigation.pages,
        state.pageNavigation.activePage,
        state.addPage,
        state.setActivePage,
        state.setPageOrder,
      ]),
    );

  const [dragState, setDragState] = useState<{
    draggedItem: PageNavItem | null;
    draggedIndex: number | null;
    insertionIntent: "BEFORE" | "AFTER" | null;
    targetElement: string | null;
    isDragging: boolean;
  }>({
    draggedItem: null,
    draggedIndex: null,
    insertionIntent: null,
    targetElement: null,
    isDragging: false,
  });

  const listRef = useRef<HTMLDivElement>(null);
  const participatingElements = useRef<
    { element: Element; centroid: { x: number; y: number }; itemId: string }[]
  >([]);

  const computeCentroid = useCallback((el: Element) => {
    const rect = el.getBoundingClientRect();
    const viewportX = (rect.left + rect.right) / 2;
    const viewportY = (rect.top + rect.bottom) / 2;

    return {
      x: viewportX + window.scrollX,
      y: viewportY + window.scrollY,
    };
  }, []);

  const pageDistanceBetweenPointerAndCentroid = useCallback(
    (ev: DragEvent<HTMLDivElement>, centroid: Centroid) => {
      const pointerX = ev.clientX + window.scrollX;
      const pointerY = ev.clientY + window.scrollY;
      return Math.hypot(centroid.x - pointerX, centroid.y - pointerY);
    },
    [],
  );

  const intentFrom = useCallback(
    (ev: DragEvent<HTMLDivElement>, centroid: Centroid) => {
      const pointerX = ev.clientX + window.scrollX;
      return pointerX < centroid.x ? "BEFORE" : "AFTER";
    },
    [],
  );

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLButtonElement>, item: PageNavItem, idx: number) => {
      setDragState((prev) => ({
        ...prev,
        draggedItem: item,
        draggedIndex: idx,
        isDragging: true,
      }));

      // Fixed the querySelector - looking for elements that start with "page-button-"
      const elements = Array.from(
        listRef.current?.querySelectorAll("[id^='page-button-']") || [],
      )
        .filter((el) => el.id !== `page-button-${item.name}-${idx}`)
        .map((element) => ({
          element,
          centroid: computeCentroid(element),
          itemId: element.id,
          index: parseInt(element.id.split("-").pop() || "0"), // Extract index from ID
        }));

      participatingElements.current = elements;

      // Visual feedback for dragged element
      e.currentTarget.style.opacity = "0.5";
    },
    [computeCentroid],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!participatingElements.current.length || !dragState.draggedItem)
        return;

      // Find closest element by proximity (from article algorithm)
      const byProximity = participatingElements.current
        .map((pe) => ({
          distance: pageDistanceBetweenPointerAndCentroid(e, pe.centroid),
          ...pe,
        }))
        .sort((a, b) => a.distance - b.distance);

      const closest = byProximity[0];
      if (!closest) return;

      // Determine intent (before/after) using binary space partitioning
      const intent = intentFrom(e, closest.centroid);

      setDragState((prev) => ({
        ...prev,
        insertionIntent: intent,
        targetElement: closest.itemId,
      }));
    },
    [dragState.draggedItem, pageDistanceBetweenPointerAndCentroid, intentFrom],
  );

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleDocumentDragOver = (e: DragEvent) => {
      handleDragOver(e as any);
    };

    document.addEventListener("dragover", handleDocumentDragOver as any);

    return () => {
      document.removeEventListener("dragover", handleDocumentDragOver as any);
    };
  }, [dragState.isDragging, handleDragOver]);

  const handleDragEnd = useCallback(
    (e: DragEvent<HTMLButtonElement> | undefined) => {
      // Reset visual feedback
      e!.currentTarget.style.opacity = "1";

      if (
        !dragState.draggedItem ||
        !dragState.targetElement ||
        dragState.draggedIndex === null
      ) {
        setDragState({
          draggedItem: null,
          draggedIndex: null,
          insertionIntent: null,
          targetElement: null,
          isDragging: false,
        });
        return;
      }

      // Extract target index from the target element ID
      const targetIndex = parseInt(
        dragState.targetElement.split("-").pop() || "0",
      );

      if (targetIndex === dragState.draggedIndex) {
        setDragState({
          draggedItem: null,
          draggedIndex: null,
          insertionIntent: null,
          targetElement: null,
          isDragging: false,
        });
        return;
      }

      // Perform the reorder
      const newPages = [...pages];
      const draggedIndex = dragState.draggedIndex;

      // Remove dragged item
      const [draggedPage] = newPages.splice(draggedIndex, 1);

      // Calculate new insertion index based on intent
      let insertIndex;
      if (dragState.insertionIntent === "BEFORE") {
        insertIndex =
          targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
      } else {
        insertIndex =
          targetIndex > draggedIndex ? targetIndex : targetIndex + 1;
      }

      // Insert at new position
      newPages.splice(insertIndex, 0, draggedPage);

      // Update the store
      setPageOrder(newPages);

      // Update active page
      if (activePage === draggedIndex) {
        setActivePage(insertIndex);
      } else if (activePage > draggedIndex && activePage <= insertIndex) {
        setActivePage(activePage - 1);
      } else if (activePage < draggedIndex && activePage >= insertIndex) {
        setActivePage(activePage + 1);
      }

      setDragState({
        draggedItem: null,
        draggedIndex: null,
        insertionIntent: null,
        targetElement: null,
        isDragging: false,
      });
    },
    [dragState, pages, setPageOrder, activePage, setActivePage],
  );

  const getInsertionClasses = (pageId: string) => {
    if (dragState.targetElement === pageId) {
      return dragState.insertionIntent === "BEFORE"
        ? "border-l-4 border-l-blue/70"
        : "border-r-4 border-r-blue/70";
    }
    return "";
  };

  return (
    <div className={"bg-white w-full p-5 relative"}>
      <div
        className="flex justify-start items-center w-fit relative flex-wrap"
        ref={listRef}
        onDragOver={(e) => handleDragOver(e)}
      >
        <div className="absolute inset-0 flex items-center -z-10">
          <div className="w-full border-t border-dashed border-black"></div>
        </div>
        {pages.reduce<ReactNode[]>((acc, p, idx) => {
          if (idx < pages.length - 1) {
            acc.push(
              <PageNavigationButton
                id={`page-button-${p.name}-${idx}`}
                className={`${getInsertionClasses(`page-button-${p.name}-${idx}`)}`}
                key={`${p.name}-${idx}`}
                page={p}
                index={idx}
                isActivePage={activePage === idx}
                onClick={() => setActivePage(idx)}
                onDragStart={(e) => handleDragStart(e, p, idx)}
                onDragEnd={handleDragEnd}
                draggable
              />,
            );

            acc.push(
              <GapHiddenButton
                key={`${p.name}-${idx}-gap`}
                isHovered={hoveredGap !== null && hoveredGap === idx}
                onBtnClick={() => addPage(idx + 1)}
                onMouseEnter={() => setHoveredGap(idx)}
                onMouseLeave={() => setHoveredGap(null)}
              />,
            );
          } else {
            acc.push(
              <PageNavigationButton
                id={`page-button-${p.name}-${idx}`}
                className={`${getInsertionClasses(`page-button-${p.name}-${idx}`)} mr-5`}
                key={p.name}
                page={p}
                index={idx}
                isActivePage={activePage === idx}
                onClick={() => setActivePage(idx)}
                onDragStart={(e) => handleDragStart(e, p, idx)}
                onDragEnd={handleDragEnd}
                draggable
              />,
            );

            acc.push(
              <button
                key={`add-page-btn`}
                className={`
                  flex justify-center items-center gap-2
                  cursor-pointer active:cursor-grabbing
                  px-[10px] py-[6px] rounded-[8px] shadow-sm
                  bg-pure-white text-dark outline-transparent
                  focus:outline-blue/50
                `}
                onClick={() => addPage()}
              >
                <div
                  className={`flex justify-center items-center min-w-4 min-h-4 text-black bg-white`}
                >
                  <PlusSvg />
                </div>
                <span>Add page</span>
              </button>,
            );
          }

          return acc;
        }, [])}
      </div>
    </div>
  );
}
