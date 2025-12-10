import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Phone, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1b1b] text-white mt-16">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-wide">HYUNDAI</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Encuentra el vehiculo perfecto para ti. Innovacion, diseño y confianza en cada modelo.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
              Modelos
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white">Electricos</Link></li>
              <li><Link href="#" className="hover:text-white">SUV</Link></li>
              <li><Link href="#" className="hover:text-white">Sedan</Link></li>
              <li><Link href="#" className="hover:text-white">Hatchback</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
              Servicios
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white">Cotiza tu Hyundai</Link></li>
              <li><Link href="#" className="hover:text-white">Agendar test drive</Link></li>
              <li><Link href="#" className="hover:text-white">Planes de financiamiento</Link></li>
              <li><Link href="#" className="hover:text-white">Accesorios y repuestos</Link></li>
            </ul>
          </div>

          <div className="space-y-4 rounded-lg bg-white/5 p-5 border border-white/10">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
              Contacto
            </h4>
            <div className="space-y-3 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>+51 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>info@hyundai.pe</span>
              </div>
            </div>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-white text-[#1c1b1b] px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              Cotiza ahora
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-gray-400 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span>© {currentYear} Hyundai Peru. Todos los derechos reservados.</span>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="#" className="hover:text-white">Privacidad</Link>
            <Link href="#" className="hover:text-white">Terminos</Link>
            <Link href="#" className="hover:text-white">Soporte</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}