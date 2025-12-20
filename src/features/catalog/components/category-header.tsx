import { CarCategory } from "@/shared/types/car";

interface CategoryHeaderProps {
  category: CarCategory;
}

const categoryInfo: Record<CarCategory, { title: string; subtitle: string; description: string }> = {
  "Todos": {
    title: "Todos los Modelos",
    subtitle: "Catálogo Completo de Vehículos Hyundai",
    description: "Explora nuestra línea completa de vehículos Hyundai. Encuentra el auto perfecto para ti entre nuestra amplia selección de modelos.",
  },
  "ECOLÓGICOS": {
    title: "Modelos de Carros Ecológicos",
    subtitle: "Ecológicos",
    description: "Descubre nuestros modelos de autos ecológicos, modernos, eficientes y sostenibles. Nuestro catálogo de venta de autos incluye carros híbridos y eléctricos de última generación. ¡Cotiza el tuyo hoy y descubre el precio de nuestros autos híbridos y eléctricos en Perú!",
  },
  "HATCHBACK": {
    title: "Modelos de Autos Hatchback",
    subtitle: "Hatchback",
    description: "Descubre la versatilidad y comodidad de nuestros modernos modelos de carros hatchback en venta y recorre la ciudad con la calidad de los autos pequeños Hyundai. ¡Cotiza en línea y descubre el precio de tu auto hatchback nuevo.",
  },
  "SEDÁN": {
    title: "Modelos de Autos Sedán",
    subtitle: "Sedán",
    description: "Conoce las características de nuestra línea de carros Sedán nuevos, clásicas y perfectas para tus viajes por la ciudad. Descubre nuestros modelos de autos sedán en venta y conoce su precio en Perú cotizando en línea hoy.",
  },
  "SUV": {
    title: "Modelos de Camionetas SUV",
    subtitle: "SUV",
    description: "Nuestros modelos de camionetas en venta incluyen carros SUV híbridos y eléctricos, así como camionetas a gasolina automáticas y mecánicas. ¡Cotiza en línea, conoce los precios de las SUV Hyundai y compra una camioneta nueva hoy!",
  },
  "UTILITARIOS": {
    title: "Modelos de Minivans, minibuses y utilitarios",
    subtitle: "Utilitarios",
    description: "Conoce nuestra línea de vehículos utilitarios en venta, ideales para transporte de pasajeros y carga. Nuestros modelos de autos nuevos incluyen minivans y minibuses nuevos. Cotiza tu auto nuevo, descubre el precio de nuestros carros en Perú y compra hoy.",
  },
  "COMERCIALES": {
    title: "Modelos de Vehículos Comerciales",
    subtitle: "Comerciales",
    description: "Descubre nuestra línea de modelos de vehículos comerciales, desde camiones hasta buses en venta. Encuentra el modelo perfecto para tu negocio, cotiza en línea y descubre el precio de camiones y buses en Perú.",
  },
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const info = categoryInfo[category];

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{info.title}</h1>
      <p className="text-base text-gray-600 leading-relaxed max-w-4xl">
        {info.description}
      </p>
    </div>
  );
}
