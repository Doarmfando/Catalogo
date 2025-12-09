"use client";

import { useState } from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const salesEmail = "ventas@hyundai.pe"; // CAMBIAR POR EL CORREO REAL
  const handleWhatsAppClick = () => {
    const { name, message, phone, email } = formData;

    if (!name || !message) {
      alert("Por favor, completa al menos tu nombre y el modelo que te interesa antes de enviar por WhatsApp.");
      return;
    }

    const whatsappNumber = "51999000000"; // CAMBIAR POR EL NÚMERO REAL

    const text = `Hola, soy ${name}.\nEstoy interesado en: ${message}.\n\n${
      phone ? `Teléfono / WhatsApp: ${phone}\n` : ""
    }${email ? `Correo: ${email}\n` : ""}Enviado desde el catálogo web de Hyundai Perú.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    if (!name || !message || !email) {
      alert("Por favor, completa tu nombre, correo y el modelo que te interesa.");
      return;
    }

    const subject = `Consulta catálogo Hyundai - ${name}`;
    const body = [
      `Hola, soy ${name}.`,
      `Estoy interesado en: ${message}.`,
      "",
      `Teléfono / WhatsApp: ${phone || "No especificado"}`,
      `Correo: ${email}`,
      "",
      "Enviado desde el catálogo web de Hyundai Perú.",
    ].join("\n");

    const mailtoUrl = `mailto:${salesEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  return (
    <section className="py-10" id="contacto">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#002C5F] mb-2">
              Conecta con un asesor
            </h2>
            <p className="text-sm text-[#6b7280] max-w-md">
              Déjanos tus datos y un asesor se comunicará contigo para coordinar una visita o
              videollamada.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[0.7rem] border border-[rgba(0,44,95,0.2)] text-[#6b7280] bg-white">
            CTA final · cierre de venta
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Info Card */}
          <div className="rounded-[1.1rem] bg-white p-5 border border-[rgba(0,44,95,0.18)] shadow-[0_18px_40px_rgba(0,0,0,0.12)] text-[0.85rem]">
            <h3 className="text-base font-semibold text-[#002C5F] mb-2">
              Agenda una prueba de manejo
            </h3>
            <p className="text-[#6b7280] mb-4">
              Déjanos tus datos y un asesor de la concesionaria se comunicará contigo para
              coordinar una visita o una videollamada.
            </p>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#002C5F] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[#002C5F] font-medium">Horarios:</span> Lun – Sáb de 9:00 a
                  19:00
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#002C5F] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[#002C5F] font-medium">Teléfono:</span> (01) 600-0000
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#002C5F] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[#002C5F] font-medium">WhatsApp:</span> +51 999 000 000
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#002C5F] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[#002C5F] font-medium">Correo:</span> ventas@hyundai.pe
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#002C5F] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[#002C5F] font-medium">Ubicación:</span> Lima, Perú
                </div>
              </li>
            </ul>
          </div>

          {/* Form Card */}
          <div className="rounded-[1.1rem] bg-white p-5 border border-[rgba(0,44,95,0.18)] shadow-[0_18px_40px_rgba(0,0,0,0.12)] text-[0.82rem]">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-[0.7rem] uppercase tracking-[0.16em] text-[#6b7280]"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  required
                  className="rounded-xl border border-[rgba(0,44,95,0.3)] bg-white text-[#1c1b1b] px-3 py-2 text-[0.82rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all placeholder:text-[rgba(148,163,184,0.8)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-[0.7rem] uppercase tracking-[0.16em] text-[#6b7280]"
                >
                  Correo
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  className="rounded-xl border border-[rgba(0,44,95,0.3)] bg-white text-[#1c1b1b] px-3 py-2 text-[0.82rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all placeholder:text-[rgba(148,163,184,0.8)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="phone"
                  className="text-[0.7rem] uppercase tracking-[0.16em] text-[#6b7280]"
                >
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+51 9xx xxx xxx"
                  className="rounded-xl border border-[rgba(0,44,95,0.3)] bg-white text-[#1c1b1b] px-3 py-2 text-[0.82rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all placeholder:text-[rgba(148,163,184,0.8)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="message"
                  className="text-[0.7rem] uppercase tracking-[0.16em] text-[#6b7280]"
                >
                  ¿Qué modelo te interesa?
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ej. Hyundai Tucson híbrida, presupuesto aproximado…"
                  required
                  rows={4}
                  className="rounded-xl border border-[rgba(0,44,95,0.3)] bg-white text-[#1c1b1b] px-3 py-2 text-[0.82rem] outline-none focus:border-[#002C5F] focus:shadow-[0_0_0_1px_rgba(0,44,95,0.5)] transition-all placeholder:text-[rgba(148,163,184,0.8)] resize-none"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-full bg-gradient-to-br from-[#002C5F] to-[#0957a5] text-white font-medium shadow-[0_18px_35px_rgba(0,44,95,0.35)] hover:shadow-[0_20px_40px_rgba(0,44,95,0.45)] hover:-translate-y-px transition-all text-center"
                >
                  Enviar por correo
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="flex-1 px-4 py-3 rounded-full bg-[#22c55e] text-white font-medium shadow-[0_18px_35px_rgba(34,197,94,0.35)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.45)] hover:-translate-y-px transition-all text-center"
                >
                  WhatsApp
                </button>
              </div>

              <p className="text-[0.7rem] text-[#6b7280] mt-1">
                *Tu solicitud será enviada a un asesor de Hyundai Perú.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
