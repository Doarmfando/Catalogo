import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1b1b] text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">HYUNDAI</h3>
            <p className="text-sm text-gray-300">
              Encuentra el vehículo perfecto para ti.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Modelos</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white">Eléctricos</Link></li>
              <li><Link href="#" className="hover:text-white">SUV</Link></li>
              <li><Link href="#" className="hover:text-white">Sedán</Link></li>
              <li><Link href="#" className="hover:text-white">Hatchback</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white">Cotiza tu Hyundai</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>+51 123 456 789</li>
              <li>info@hyundai.pe</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © {currentYear} Hyundai Perú. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
