'use client'

interface Props {
  lat: number
  lng: number
  name: string
}

export default function MapaUbicacion({ lat, lng, name }: Props) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden h-48 md:h-full md:min-h-[200px]">
      <iframe
        title={`Ubicación de ${name}`}
        src={src}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-full w-full"
      />
    </div>
  )
}
