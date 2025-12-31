"use client";

import { useMemo, useRef, useState } from "react";
import { VersionColorGallery } from "./version-color-gallery";
import { CheckCircle2 } from "lucide-react";
import type { CarVersion } from "@/shared/types/car";

const ALL_VERSIONS_ID = "__ALL__";

function money(n: number) {
  return n.toLocaleString("en-US");
}

function VersionSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 rounded-full bg-white border border-[rgba(0,44,95,0.15)] px-3 py-2 hover:bg-[rgba(0,44,95,0.04)] transition"
      title="Mostrar/ocultar detalles"
    >
      <span className="text-xs font-semibold text-[#002C5F]">Detalles</span>

      <span
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-[#002C5F]" : "bg-[#cbd5e1]",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1",
          ].join(" ")}
        />
      </span>

      <span className="text-xs font-bold text-[#6b7280] w-10 text-right">
        {checked ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export function VersionsAndGallery({
  modelName,
  versions,
  basePriceUSD,
}: {
  modelName: string;
  versions: CarVersion[];
  basePriceUSD: number;
}) {
  const defaultVersionId =
    versions.length > 1 ? ALL_VERSIONS_ID : (versions?.[0]?.id ?? "");

  const [selectedVersionId, setSelectedVersionId] = useState<string>(defaultVersionId);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const galleryRef = useRef<HTMLDivElement | null>(null);

  const isAll = selectedVersionId === ALL_VERSIONS_ID;

  const selectedVersion = useMemo(() => {
    if (isAll) return null;
    return versions.find((v) => v.id === selectedVersionId) ?? versions[0] ?? null;
  }, [versions, selectedVersionId, isAll]);

  const priceStats = useMemo(() => {
    const usds = versions.map((v) => Number(v.priceUSD ?? basePriceUSD));
    const minUSD = usds.length ? Math.min(...usds) : basePriceUSD;
    const maxUSD = usds.length ? Math.max(...usds) : basePriceUSD;
    return { minUSD, maxUSD };
  }, [versions, basePriceUSD]);

  const pickVersion = (id: string) => {
    setSelectedVersionId(id);

    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches) {
      requestAnimationFrame(() =>
        galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="mt-8 rounded-[1.2rem] bg-white border border-dashed border-[rgba(0,44,95,0.25)] p-10 text-[#6b7280]">
        Aún no has cargado las versiones para este modelo.
      </div>
    );
  }

  const priceUSD = Number(selectedVersion?.priceUSD ?? basePriceUSD);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#002C5F]">
            Versiones disponibles
          </h2>
          <p className="text-sm text-[#6b7280] mt-1">
            Elige una versión o mira <b>todas</b> en la galería.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-white border border-[rgba(0,44,95,0.15)] text-[#002C5F]">
            {versions.length} {versions.length === 1 ? "versión" : "versiones"}
          </span>

          <VersionSwitch checked={showDetails} onChange={setShowDetails} />
        </div>
      </div>

      {/* Layout: nav izquierda + contenido derecha */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* NAV VERSIONES */}
        <aside className="rounded-[1.2rem] bg-white border border-[rgba(0,44,95,0.14)] shadow-[0_18px_40px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,44,95,0.10)]">
            <p className="text-sm font-extrabold text-[#002C5F]">Versiones</p>
            <p className="text-xs text-[#6b7280] mt-0.5">Click para cambiar la galería</p>
          </div>

          <div className="lg:max-h-[520px] lg:overflow-auto">
            <div className="p-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
              {/* ✅ TODOS */}
              <button
                type="button"
                onClick={() => pickVersion(ALL_VERSIONS_ID)}
                className={[
                  "shrink-0 lg:shrink rounded-[1rem] border px-4 py-3 text-left transition",
                  isAll
                    ? "bg-[rgba(0,44,95,0.06)] border-[rgba(0,44,95,0.45)]"
                    : "bg-white border-[rgba(0,44,95,0.16)] hover:bg-[rgba(0,44,95,0.04)] hover:border-[rgba(0,44,95,0.30)]",
                ].join(" ")}
                aria-current={isAll ? "true" : undefined}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-extrabold text-[#002C5F]">Todos</span>
                  <span className="text-xs font-bold text-[#002C5F]">Ver todo</span>
                </div>
                <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">
                  Galería completa separada por versión
                </p>
              </button>

              {/* Versiones */}
              {versions.map((v) => {
                const active = v.id === selectedVersionId;
                const vUsd = Number(v.priceUSD ?? basePriceUSD);

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => pickVersion(v.id)}
                    className={[
                      "shrink-0 lg:shrink rounded-[1rem] border px-4 py-3 text-left transition",
                      active
                        ? "bg-[rgba(0,44,95,0.06)] border-[rgba(0,44,95,0.45)]"
                        : "bg-white border-[rgba(0,44,95,0.16)] hover:bg-[rgba(0,44,95,0.04)] hover:border-[rgba(0,44,95,0.30)]",
                    ].join(" ")}
                    aria-current={active ? "true" : undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-extrabold text-[#002C5F]">{v.name}</span>
                      <span className="text-xs font-bold text-[#002C5F]">${money(vUsd)}</span>
                    </div>

                    {v.shortDescription && (
                      <p className="text-xs text-[#6b7280] mt-1 line-clamp-2">{v.shortDescription}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CONTENIDO: detalles + galería */}
        <div ref={galleryRef} className="min-w-0">
          {/* PANEL DETALLES */}
          <div
            className={[
              "rounded-[1.2rem] bg-white border border-[rgba(0,44,95,0.14)] shadow-[0_18px_40px_rgba(0,0,0,0.08)] overflow-hidden",
              "transition-[max-height,opacity,transform] duration-300",
              showDetails ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none",
            ].join(" ")}
            style={{ maxHeight: showDetails ? 520 : 0 }}
            aria-hidden={!showDetails}
          >
            <div className="p-5 lg:p-6 border-b border-[rgba(0,44,95,0.10)]">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#6b7280]">
                    {isAll ? "Vista" : "Versión seleccionada"}
                  </p>
                  <h3 className="text-xl font-extrabold text-[#002C5F] mt-1">
                    {isAll ? "Todas las versiones" : (selectedVersion?.name ?? "—")}
                  </h3>

                  {!isAll && selectedVersion?.shortDescription && (
                    <p className="text-sm text-[#6b7280] mt-1">{selectedVersion.shortDescription}</p>
                  )}

                  {isAll && (
                    <p className="text-sm text-[#6b7280] mt-1">
                      Selecciona una versión para ver equipamiento y filtrar por color.
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[0.75rem] text-[#6b7280]">
                    {isAll ? "Rango" : "Desde"}
                  </p>

                  <p className="text-2xl font-extrabold text-[#002C5F]">
                    {isAll
                      ? `$${money(priceStats.minUSD)} – $${money(priceStats.maxUSD)}`
                      : `$${money(priceUSD)}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 lg:p-6 bg-[#f6f3f2]">
              {!isAll && Array.isArray(selectedVersion?.highlights) && selectedVersion!.highlights!.length > 0 ? (
                <div className="rounded-[1.1rem] bg-white border border-[rgba(0,44,95,0.14)] p-5">
                  <p className="text-sm font-extrabold text-[#002C5F]">Equipamiento destacado</p>
                  <ul className="mt-3 space-y-2.5 text-sm text-[#111827]">
                    {selectedVersion!.highlights!.slice(0, 8).map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#0957a5]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-[1.1rem] bg-white border border-dashed border-[rgba(0,44,95,0.25)] p-6 text-[#6b7280]">
                  {isAll
                    ? "Estás viendo todas las versiones. Elige una versión para ver sus detalles."
                    : "Esta versión no tiene detalles cargados."}
                </div>
              )}
            </div>
          </div>

          {/* GALERÍA */}
          <div className={showDetails ? "mt-6" : "mt-0"}>
            <VersionColorGallery
              modelName={modelName}
              versions={versions}
              selectedVersionId={selectedVersionId} // ✅ puede ser "__ALL__"
              onSelectVersion={pickVersion}
              hideVersionSelector={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
