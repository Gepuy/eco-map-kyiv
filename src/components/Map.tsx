
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Facility } from "@/data/facilities";

interface MapProps {
  facilities: Facility[];
  onFacilitySelect: (facility: Facility) => void;
}

const Map = ({ facilities, onFacilitySelect }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapKey, setMapKey] = useState("");

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapKey) {
      const key = prompt(
        "Please enter your Mapbox access token (you can get one from https://mapbox.com/)"
      );
      if (key) {
        setMapKey(key);
        localStorage.setItem("mapbox_key", key);
      }
      return;
    }

    mapboxgl.accessToken = mapKey;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [30.5234, 50.4501],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      // Add facilities as markers
      facilities.forEach((facility) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.backgroundColor = '#3a6e6c';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.3s ease';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        const marker = new mapboxgl.Marker({
          element: el,
        })
          .setLngLat(facility.location)
          .addTo(map.current!);

        // Add click event to marker
        el.addEventListener("click", () => {
          onFacilitySelect(facility);
        });

        // Add hover effect
        el.addEventListener("mouseenter", () => {
          el.style.transform = 'scale(1.2)';
          el.style.backgroundColor = '#2a5e5c';
        });

        el.addEventListener("mouseleave", () => {
          el.style.transform = 'scale(1)';
          el.style.backgroundColor = '#3a6e6c';
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
  }, [facilities, mapKey, onFacilitySelect]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
