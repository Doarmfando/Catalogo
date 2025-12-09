import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
  onCompare?: (carId: string, checked: boolean) => void;
  isCompared?: boolean;
}

export function CarCard({ car, onCompare, isCompared = false }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFuelBadgeColor = (fuelType: string) => {
    switch (fuelType) {
      case "ELÉCTRICO":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "GASOLINA":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "DIESEL":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-[260px] bg-gray-100">
        <Image
          src={car.image}
          alt={car.name}
          width={468}
          height={260}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Badge className={getFuelBadgeColor(car.fuelType)}>
            {car.fuelType === "ELÉCTRICO" ? "Eléctricos" : car.fuelType.toLowerCase()}
          </Badge>
          <button className="text-xs text-[#002C5F] border border-[#002C5F] px-3 py-1 rounded hover:bg-[#002C5F] hover:text-white transition-colors">
            Ver versiones
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">{car.year}</p>
          <h3 className="text-xl font-bold text-[#002C5F]">{car.name}</h3>
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-1">Desde:</p>
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(car.priceUSD)} o S/ {car.pricePEN.toLocaleString('es-PE')}
          </p>
        </div>

        {onCompare && (
          <div className="flex items-center space-x-2 mb-5">
            <Checkbox
              id={`compare-${car.id}`}
              checked={isCompared}
              onCheckedChange={(checked) =>
                onCompare(car.id, checked as boolean)
              }
            />
            <Label
              htmlFor={`compare-${car.id}`}
              className="text-sm font-normal cursor-pointer text-[#002C5F]"
            >
              Comparar
            </Label>
          </div>
        )}

        <div className="flex gap-3 mb-3">
          <button className="flex-1 border border-[#002C5F] text-[#002C5F] px-4 py-2 rounded hover:bg-[#002C5F] hover:text-white transition-colors text-sm font-medium">
            Detalles
          </button>
          <button className="flex-1 bg-[#002C5F] text-white px-4 py-2 rounded hover:bg-[#001a3d] transition-colors text-sm font-medium">
            Cotizar
          </button>
        </div>

        <button className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded transition-colors text-sm font-medium flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Cotizar en WhatsApp
        </button>
      </CardContent>
    </Card>
  );
}