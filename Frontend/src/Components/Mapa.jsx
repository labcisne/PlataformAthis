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
    const [confirmouLocalizacao, setConfirmouLocalizacao] = useState(false);
    const [positionString, setPositionString] = useState("");

    const handleGetLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const {latitude, longitude} = location.coords;
                    setPosition([latitude, longitude]);
                    setPositionString(`${latitude}, ${longitude}`)
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
                        setPositionString(`${latLng.lat.toFixed(7)}, ${latLng.lng.toFixed(7)}`)
                        setConfirmouLocalizacao(false);
                    },
                }}
            />
        );
    }

    const handleConfirm = () => {
        if(onLocationChange && position){
            onLocationChange(position);
            setConfirmouLocalizacao(true);
        }
    }

    // const handleChange = (event) => {
    //     const array = event.target.value.split(",");
    //     if(array.length > 1){
    //         setPosition([array[0], array[1]]);
    //         const newString = `${array[0]}, ${array[1]}`;
    //         setPositionString(newString);
    //         setConfirmouLocalizacao(false);
    //     }
    //     else{
    //         alert("Deixe a localização entre vírgulas!");
    //     }
    // }

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
                    <input 
                        type="text"
                        value={positionString}
                        readOnly
                    />
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
                    <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                        <button 
                            id="localizacao"
                            type="button"
                            onClick={handleConfirm}
                            style={{marginTop: "8px"}}
                        >
                            Confirmar Localização
                        </button>
                        {confirmouLocalizacao && (
                            <div style={{color: "green"}}>
                                Localização Confirmada!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mapa;