
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Facility } from "@/types/supabase";

interface MapProps {
  facilities: Facility[];
  onFacilitySelect: (facility: Facility) => void;
}

const Map = ({ facilities, onFacilitySelect }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoiZ2VwdXkiLCJhIjoiY203Zzlwc3ZyMDhnczJpcXVxdWRsYndqZyJ9.V6W61Lt1CK-JLhzyJ7DvBA";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [30.5234, 50.4501],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      // Clean up previous markers if any
      const markersElements = document.querySelectorAll('.marker');
      markersElements.forEach(el => el.remove());

      // Add facilities as markers
      facilities.forEach((facility) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.cssText = `
          width: 24px;
          height: 24px;
          background-color: #3a6e6c;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat(facility.location)
          .addTo(map.current!);

        // Add click event to marker
        el.addEventListener("click", () => {
          onFacilitySelect(facility);
        });
      });

      // Add a pulsing dot effect
      const size = 150;
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },
        render: function () {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;
          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;

          if (!context) return null;

          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = `rgba(58, 110, 108, ${1 - t})`;
          context.fill();

          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(58, 110, 108, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          this.data = context.getImageData(0, 0, this.width, this.height).data;
          map.current?.triggerRepaint();
          return true;
        },
      };

      facilities.forEach((facility) => {
        map.current?.addImage(`pulsing-dot-${facility.id}`, pulsingDot, {
          pixelRatio: 2,
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [facilities, onFacilitySelect]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
