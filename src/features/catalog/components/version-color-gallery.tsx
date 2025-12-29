"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CarVersion, CarColor } from "@/shared/types/car";

const ALL_VERSIONS_ID = "__ALL__";
const ALL_COLORS_ID = "__ALL__";

function fileNameFromSrc(src: string) {
  const clean = (src || "").split("?")[0];
  const last = clean.split("/").pop() || "imagen";
  return last;
}

type GalleryImg = {
  index: number;
  src: string;
  colorName: string;
  colorHex: string;
  versionName: string;
};

export function VersionColorGallery({
  modelName,
  versions,
  selectedVersionId,
  onSelectVersion,
  hideVersionSelector = false,
}: {
  modelName: string;
  versions: CarVersion[];
  selectedVersionId?: string;
  onSelectVersion?: (id: string) => void;
  hideVersionSelector?: boolean;
}) {
  const [internalVersionId, setInternalVersionId] = useState<string>(versions?.[0]?.id ?? "");
  const [colorId, setColorId] = useState<string>(ALL_COLORS_ID);

  // ✅ Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isControlled = typeof selectedVersionId === "string" && selectedVersionId.length > 0;
  const versionId = isControlled ? (selectedVersionId as string) : internalVersionId;

  const isAllVersions = versionId === ALL_VERSIONS_ID;

  const setVersion = (id: string) => {
    if (isControlled) onSelectVersion?.(id);
    else setInternalVersionId(id);
  };

  // ✅ reset color cuando cambie versión
  useEffect(() => {
    setColorId(ALL_COLORS_ID);
  }, [versionId]);

  // ✅ en "Todos", forzamos color = Todos (porque colores difieren por versión)
  useEffect(() => {
    if (isAllVersions) setColorId(ALL_COLORS_ID);
  }, [isAllVersions]);

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === versionId) ?? versions[0],
    [versions, versionId]
  );

  const versionLabel = isAllVersions ? "Todos" : (selectedVersion?.name ?? "—");

  const colors: CarColor[] = useMemo(() => {
    if (isAllVersions) return [];
    const raw = (selectedVersion?.colors ?? []) as CarColor[];
    return raw.filter((c) => Array.isArray(c.images) && c.images.length > 0);
  }, [selectedVersion, isAllVersions]);

  // ✅ Vista normal (una versión) -> lista con index
  const images: GalleryImg[] = useMemo(() => {
    if (isAllVersions) return [];
    if (!colors.length) return [];

    let k = 0;

    if (colorId === ALL_COLORS_ID) {
      const out: GalleryImg[] = [];
      for (const c of colors) {
        for (const src of c.images) {
          out.push({
            index: k++,
            src,
            colorName: c.name,
            colorHex: c.hex ?? "#e5e7eb",
            versionName: versionLabel,
          });
        }
      }
      return out;
    }

    const c = colors.find((x) => x.id === colorId);
    return (c?.images ?? []).map((src) => ({
      index: k++,
      src,
      colorName: c?.name ?? "",
      colorHex: c?.hex ?? "#e5e7eb",
      versionName: versionLabel,
    }));
  }, [colors, colorId, isAllVersions, versionLabel]);

  // ✅ Vista "Todos": secciones por versión + índice global
  const sections = useMemo(() => {
    if (!isAllVersions) return [];

    let k = 0;

    return versions
      .map((v) => {
        const vColors = ((v.colors ?? []) as CarColor[]).filter(
          (c) => Array.isArray(c.images) && c.images.length > 0
        );

        const imgs: GalleryImg[] = [];
        for (const c of vColors) {
          for (const src of c.images) {
            imgs.push({
              index: k++,
              src,
              colorName: c.name,
              colorHex: c.hex ?? "#e5e7eb",
              versionName: v.name,
            });
          }
        }

        return {
          versionId: v.id,
          versionName: v.name,
          images: imgs,
        };
      })
      .filter((s) => s.images.length > 0);
  }, [versions, isAllVersions]);

  // ✅ Esta es la lista REAL visible/filtrada para el modal
  const visibleFlat: GalleryImg[] = useMemo(() => {
    if (isAllVersions) return sections.flatMap((s) => s.images);
    return images;
  }, [sections, images, isAllVersions]);

  const totalImages = visibleFlat.length;

  const colorLabel = isAllVersions
    ? "Todos los colores"
    : colorId === ALL_COLORS_ID
      ? "Todos los colores"
      : colors.find((c) => c.id === colorId)?.name ?? "—";

  // ✅ Abrir modal en el índice correcto (lista filtrada)
  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goPrev = () => {
    setLightboxIndex((i) => (i - 1 + totalImages) % totalImages);
  };

  const goNext = () => {
    setLightboxIndex((i) => (i + 1) % totalImages);
  };

  // ✅ Teclado en modal
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, totalImages]);

  // ✅ Si cambia el filtro y el índice queda fuera
  useEffect(() => {
    if (!lightboxOpen) return;
    if (lightboxIndex >= totalImages) setLightboxIndex(Math.max(0, totalImages - 1));
  }, [totalImages, lightboxIndex, lightboxOpen]);

  const current = useMemo(() => {
    if (!visibleFlat.length) return null;
    return visibleFlat[lightboxIndex] ?? visibleFlat[0];
  }, [visibleFlat, lightboxIndex]);

  // ✅ Thumbnails (ventana alrededor de la actual)
  const thumbs = useMemo(() => {
    const n = visibleFlat.length;
    if (n <= 1) return visibleFlat;

    const WINDOW = 12;
    const half = Math.floor(WINDOW / 2);
    const start = Math.max(0, Math.min(lightboxIndex - half, n - WINDOW));
    const end = Math.min(n, start + WINDOW);
    return visibleFlat.slice(start, end);
  }, [visibleFlat, lightboxIndex]);

  return (
    <>
      {/* ✅ LIGHTBOX */}
      {lightboxOpen && current && (
        <div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // cerrar si clic fuera del panel
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="w-full max-w-6xl rounded-[1.2rem] overflow-hidden bg-white shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            {/* topbar */}
            <div className="px-4 py-3 border-b border-black/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#6b7280] truncate">
                  {modelName} <span className="opacity-50">/</span>{" "}
                  <span className="font-semibold text-[#002C5F]">{current.versionName}</span>{" "}
                  <span className="opacity-50">/</span>{" "}
                  <span className="font-semibold text-[#002C5F]">{current.colorName}</span>
                </p>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  {lightboxIndex + 1} / {totalImages}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={current.src}
                  download={fileNameFromSrc(current.src)}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-[rgba(0,44,95,0.20)] px-3 py-2 text-xs font-extrabold text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)] transition"
                >
                  <Download className="h-4 w-4" />
                  Descargar
                </a>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex items-center justify-center rounded-full bg-white border border-black/10 h-9 w-9 hover:bg-black/5 transition"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5 text-[#111827]" />
                </button>
              </div>
            </div>

            {/* main */}
            <div className="bg-[#0b1d35]">
              <div className="relative w-full max-h-[72vh] aspect-[16/9]">
                <Image
                  src={current.src}
                  alt={`${modelName} · ${current.versionName} · ${current.colorName}`}
                  fill
                  className="object-contain"
                  priority
                />

                {/* prev/next */}
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 border border-black/10 h-10 w-10 flex items-center justify-center hover:bg-white transition"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-5 w-5 text-[#002C5F]" />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 border border-black/10 h-10 w-10 flex items-center justify-center hover:bg-white transition"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="h-5 w-5 text-[#002C5F]" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* thumbs */}
            {totalImages > 1 && (
              <div className="px-4 py-3 border-t border-black/10 bg-white">
                <div className="flex gap-2 overflow-x-auto">
                  {thumbs.map((t) => {
                    const active = t.index === lightboxIndex;
                    return (
                      <button
                        key={`${t.src}-${t.index}`}
                        type="button"
                        onClick={() => setLightboxIndex(t.index)}
                        className={[
                          "relative h-14 w-24 rounded-xl overflow-hidden border shrink-0 transition",
                          active
                            ? "border-[rgba(0,44,95,0.55)] ring-2 ring-[rgba(0,44,95,0.18)]"
                            : "border-black/10 hover:border-[rgba(0,44,95,0.30)]",
                        ].join(" ")}
                        title={`${t.versionName} · ${t.colorName}`}
                      >
                        <Image src={t.src} alt="" fill className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ GALERÍA ORIGINAL */}
      <div className="rounded-[1.3rem] bg-white border border-[rgba(0,44,95,0.14)] shadow-[0_18px_40px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* header */}
        <div className="p-5 lg:p-6 border-b border-[rgba(0,44,95,0.10)]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <div>
              <h3 className="text-lg lg:text-xl font-extrabold text-[#002C5F]">
                Galería por versión y color
              </h3>
              <p className="text-sm text-[#6b7280] mt-1">
                <span className="font-semibold text-[#002C5F]">{modelName}</span>{" "}
                <span className="opacity-60">{"<"}</span>{" "}
                <span className="font-semibold text-[#002C5F]">{versionLabel}</span>{" "}
                <span className="opacity-60">{"<"}</span>{" "}
                <span className="font-semibold text-[#002C5F]">{colorLabel}</span>
              </p>
            </div>

            <div className="text-xs px-3 py-1 rounded-full bg-white border border-[rgba(0,44,95,0.15)] text-[#002C5F] w-fit">
              {totalImages} {totalImages === 1 ? "imagen" : "imágenes"}
            </div>
          </div>

          {/* selector de versión (opcional) */}
          {!hideVersionSelector && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setVersion(ALL_VERSIONS_ID)}
                className={[
                  "px-4 py-2 rounded-full text-sm font-semibold transition border",
                  versionId === ALL_VERSIONS_ID
                    ? "bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white border-transparent shadow-[0_14px_36px_rgba(0,44,95,0.18)]"
                    : "bg-white text-[#002C5F] border-[rgba(0,44,95,0.20)] hover:bg-[rgba(0,44,95,0.06)]",
                ].join(" ")}
              >
                Todos
              </button>

              {versions.map((v) => {
                const active = v.id === versionId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVersion(v.id)}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-semibold transition border",
                      active
                        ? "bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white border-transparent shadow-[0_14px_36px_rgba(0,44,95,0.18)]"
                        : "bg-white text-[#002C5F] border-[rgba(0,44,95,0.20)] hover:bg-[rgba(0,44,95,0.06)]",
                    ].join(" ")}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* selector de color */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setColorId(ALL_COLORS_ID)}
              className={[
                "px-4 py-2 rounded-full text-sm font-semibold border transition",
                colorId === ALL_COLORS_ID
                  ? "bg-[#002C5F] text-white border-transparent"
                  : "bg-white text-[#002C5F] border-[rgba(0,44,95,0.20)] hover:bg-[rgba(0,44,95,0.06)]",
              ].join(" ")}
            >
              Todos
            </button>

            {isAllVersions ? (
              <span className="text-xs text-[#6b7280] ml-1">
                (Para filtrar por color, selecciona una versión)
              </span>
            ) : (
              colors.map((c) => {
                const active = c.id === colorId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    className={[
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition",
                      active
                        ? "bg-[rgba(0,44,95,0.08)] border-[rgba(0,44,95,0.45)] text-[#002C5F]"
                        : "bg-white border-[rgba(0,44,95,0.20)] text-[#002C5F] hover:bg-[rgba(0,44,95,0.06)]",
                    ].join(" ")}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ background: c.hex ?? "#e5e7eb" }}
                    />
                    {c.name}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* body */}
        <div className="p-5 lg:p-6 bg-[#f6f3f2]">
          {/* ✅ MODO TODOS: SECCIONES */}
          {isAllVersions ? (
            sections.length === 0 ? (
              <div className="rounded-[1.1rem] bg-white border border-dashed border-[rgba(0,44,95,0.25)] p-8 text-[#6b7280]">
                No hay imágenes cargadas para este modelo.
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((sec) => (
                  <section
                    key={sec.versionId}
                    className="rounded-[1.2rem] bg-white border border-[rgba(0,44,95,0.14)] overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-[rgba(0,44,95,0.10)] flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">Versión</p>
                        <h4 className="text-lg font-extrabold text-[#002C5F] mt-1">{sec.versionName}</h4>
                      </div>
                      <div className="text-xs px-3 py-1 rounded-full bg-white border border-[rgba(0,44,95,0.15)] text-[#002C5F] w-fit">
                        {sec.images.length} {sec.images.length === 1 ? "imagen" : "imágenes"}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sec.images.map((img) => (
                          <figure
                            key={`${img.src}-${img.index}`}
                            className="group rounded-[1.2rem] bg-white border border-[rgba(0,44,95,0.14)] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                          >
                            <div
                              className="relative aspect-[16/10] cursor-zoom-in"
                              onClick={() => openLightbox(img.index)}
                            >
                              <Image
                                src={img.src}
                                alt={`${modelName} · ${sec.versionName} · ${img.colorName}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />

                              {/* ✅ DESCARGAR (no abre modal) */}
                              <a
                                href={img.src}
                                download={fileNameFromSrc(img.src)}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 border border-black/10 px-3 py-1.5 text-xs font-extrabold text-[#002C5F] shadow-sm hover:bg-white transition"
                                title="Descargar imagen"
                              >
                                <Download className="h-4 w-4" />
                                Descargar
                              </a>
                            </div>

                            <figcaption className="px-4 py-3 text-xs text-[#6b7280] flex items-center justify-between">
                              <span className="inline-flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                                  style={{ background: img.colorHex ?? "#e5e7eb" }}
                                />
                                <span className="font-semibold text-[#002C5F]">{img.colorName}</span>
                              </span>
                              <span className="opacity-70">{sec.versionName}</span>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )
          ) : (
            /* ✅ MODO UNA VERSION */
            (!selectedVersion?.colors || colors.length === 0) ? (
              <div className="rounded-[1.1rem] bg-white border border-dashed border-[rgba(0,44,95,0.25)] p-8 text-[#6b7280]">
                Esta versión aún no tiene galería por colores.
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-[1.1rem] bg-white border border-dashed border-[rgba(0,44,95,0.25)] p-8 text-[#6b7280]">
                No hay imágenes para el color seleccionado.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img) => (
                  <figure
                    key={`${img.src}-${img.index}`}
                    className="group rounded-[1.2rem] bg-white border border-[rgba(0,44,95,0.14)] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div
                      className="relative aspect-[16/10] cursor-zoom-in"
                      onClick={() => openLightbox(img.index)}
                    >
                      <Image
                        src={img.src}
                        alt={`${modelName} · ${img.versionName} · ${img.colorName}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />

                      {/* ✅ DESCARGAR (no abre modal) */}
                      <a
                        href={img.src}
                        download={fileNameFromSrc(img.src)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 border border-black/10 px-3 py-1.5 text-xs font-extrabold text-[#002C5F] shadow-sm hover:bg-white transition"
                        title="Descargar imagen"
                      >
                        <Download className="h-4 w-4" />
                        
                      </a>
                    </div>

                    <figcaption className="px-4 py-3 text-xs text-[#6b7280] flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-black/10"
                          style={{ background: img.colorHex ?? "#e5e7eb" }}
                        />
                        <span className="font-semibold text-[#002C5F]">{img.colorName}</span>
                      </span>
                      <span className="opacity-70">{img.versionName}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
