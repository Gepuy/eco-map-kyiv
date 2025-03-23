
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<{[id: string]: mapboxgl.Popup}>({});

  // Очищення всіх маркерів з мапи
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Очищаємо також всі попапи
    Object.values(popupsRef.current).forEach(popup => popup.remove());
    popupsRef.current = {};
  };

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

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, []);

  // Оновлення маркерів при зміні списку об'єктів
  useEffect(() => {
    if (!map.current) return;

    // Чекаємо, коли мапа повністю завантажиться
    const setupMarkers = () => {
      if (map.current && map.current.loaded()) {
        // Очищаємо попередні маркери
        clearMarkers();

        // Додаємо нові маркери для об'єктів
        facilities.forEach((facility) => {
          const el = document.createElement('div');
          el.className = 'marker';
          
          // Визначаємо колір маркера в залежності від типу об'єкта
          let color = '#3a6e6c'; // базовий колір
          
          if (facility.type === 'Теплоелектроцентраль') {
            color = '#e11d48'; // червоний для теплоелектроцентралей
          } else if (facility.type === 'Сміттєспалювальний завод') {
            color = '#d97706'; // помаранчевий для сміттєспалювальних заводів
          } else if (facility.type === 'Водоочисна споруда') {
            color = '#2563eb'; // синій для водоочисних споруд
          }
          
          el.style.cssText = `
            width: 24px;
            height: 24px;
            background-color: ${color};
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          `;
          
          // Створюємо попап заздалегідь для кожного маркеру
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25,
            className: 'custom-popup'
          }).setHTML(`
            <div class="text-xs font-medium">
              <div>${facility.name}</div>
              <div class="text-gray-600">${facility.type}</div>
            </div>
          `);
          
          // Зберігаємо попап
          popupsRef.current[facility.id] = popup;
          
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center',
          })
            .setLngLat(facility.location)
            .addTo(map.current!);
            
          // Показуємо/ховаємо попап при наведенні
          el.addEventListener('mouseenter', () => {
            popup.addTo(map.current!);
            // Додаємо клас для збільшення без трансформації маркера
            el.classList.add('marker-hover');
          });
          
          el.addEventListener('mouseleave', () => {
            popup.remove();
            // Видаляємо клас
            el.classList.remove('marker-hover');
          });

          // Додаємо обробник кліку
          el.addEventListener("click", () => {
            onFacilitySelect(facility);
          });
          
          // Зберігаємо посилання на маркер
          markersRef.current.push(marker);
        });
        
        // Якщо є об'єкти, але не видно на мапі, змінюємо центр і масштаб
        if (facilities.length > 0 && map.current) {
          // Якщо об'єкт тільки один, центруємо на нього
          if (facilities.length === 1) {
            map.current.flyTo({
              center: facilities[0].location,
              zoom: 14,
              essential: true
            });
          } else {
            // Для багатьох об'єктів обчислюємо bounds
            const bounds = new mapboxgl.LngLatBounds();
            facilities.forEach(facility => {
              bounds.extend(facility.location);
            });
            
            map.current.fitBounds(bounds, {
              padding: 50,
              maxZoom: 15,
              essential: true
            });
          }
        }
      } else {
        // Якщо мапа ще не завантажилась, пробуємо через час
        setTimeout(setupMarkers, 100);
      }
    };
    
    setupMarkers();
  }, [facilities, onFacilitySelect]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 right-4 bg-white rounded-md px-2 py-1 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-e11d48 border border-white"></div>
            <span>Теплоелектроцентраль</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-d97706 border border-white"></div>
            <span>Сміттєспалювальний завод</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-2563eb border border-white"></div>
            <span>Водоочисна споруда</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
