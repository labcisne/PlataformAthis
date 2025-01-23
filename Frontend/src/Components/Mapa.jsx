import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",   
});

function Mapa({ onLocationChange }){
    const [position, setPosition] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);

    const handleGetLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const {latitude, longitude} = location.coords;
                    setPosition([latitude, longitude]);
                    setMapVisible(true);
                },
                (error) => {
                    console.log(error.message);
                    alert("Não foi possível obter sua localização. Por favor, permita o acesso a localização.")
                }
            )
        }
        else{
            alert("O browser não suporta Geolocalização.")
        }
    }

    const DraggableMarker = () => {
        const [markerPosition, setMarkerPosition] = useState(position);

        return (
            <Marker 
                position={markerPosition}
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const latLng = e.target.getLatLng();
                        setMarkerPosition([latLng.lat, latLng.lng]);
                        setPosition([latLng.lat, latLng.lng]);
                    },
                }}
            />
        );
    }

    const handleConfirm = () => {
        if(onLocationChange && position){
            onLocationChange(position);
        }
    }

    return (
        <div>
            {!mapVisible && (
                <button 
                    id="localizacao"
                    type="button"
                    onClick={handleGetLocation}
                >
                    Acessar GPS
                </button>
            )}
            {mapVisible && position && (
                <div>
                    <MapContainer
                        center={position}
                        zoom={18}
                        style={{ height: "40vh", width: "100%" }}
                    >
                        <TileLayer 
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <DraggableMarker />
                    </MapContainer>
                    <button 
                        id="localizacao"
                        type="button"
                        onClick={handleConfirm}
                        style={{marginTop: "8px"}}
                    >
                        Confirmar Localização
                    </button>
                </div>
            )}
        </div>
    );
}

export default Mapa;