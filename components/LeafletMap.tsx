// @ts-nocheck
"use client"
import { useRef, useState, useMemo, StrictMode, useCallback } from 'react';
import { useMap, MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

function Coolbutton({ msgs, clicks }:{msgs:any,clicks:any}) {
  let buttons = []
  for (let i = 0; i < msgs.length; i++) {
    buttons.push(
      <button key={i} onClick={clicks[i]} className="group hover:scale-125 rounded-lg border-1 border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
        {msgs[i]}</button>)
  }
  // let map = useMap()
  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      {buttons}
    </div>)

}

function add_buttons() {
  console.log("Hi, fker");
}
function go_to_madrid() {
  console.log("Hi, fker 2");
}

// function BaseStation({ position, radius }:{ position:L.Point, radius:number}) {
//
//   return (<>
//     <Circle center={position} pathOptions={{ color: 'red' }} radius={radius} />
//     <DraggableMarker posi={position : } />
//   </>);
// }

export default function LeafletMap({ dark, className }) {
  console.log("Leaf called")
  const position: [number, number] = [51.505, -0.09]; // Replace with your desired initial coordinates
  const leaf: L.Map = useRef(null)
  const [AMarkers, setAMarkers] = useState(new Array)

  const add_bs = () => {
    console.log(leaf.current.getCenter())
    setAMarkers(AMarkers.concat([{ posi: leaf.current.getCenter() }]))
    AMarkers.forEach(element => {
      console.log(element)
    });
  }
  const mod_PosMarker = (id, pos) => {
    setAMarkers(AMarkers.map(
      (c, i) => {
        if (i === id) {
          return {posi:pos}
        } else {
          return c;
        }
        }
    ));
  }
  const mod_RemoveLast=()=>{
    setAMarkers(AMarkers.slice(0,AMarkers.length-1));
  }
  const htmlAMarkers = AMarkers.map((obj, i) => {
    return <DraggableMarker key={i} posi={obj.posi} callbck={(p) => mod_PosMarker(i, p)} />
  })
  const resp = (
    <StrictMode>
      <MapContainer className={className} ref={leaf} id="map" center={position} zoom={13} style={{ filter: dark ? 'invert(1)' : 'invert(0)', width: '100%', height: '60vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {htmlAMarkers}
      </MapContainer>
      <Coolbutton msgs={["Add a base station", "Undo add","Reset base stations"]} clicks={[add_bs,mod_RemoveLast,go_to_madrid]} />
    </StrictMode>
  );
  return resp;
};
function DraggableMarker({ posi, callbck }) {
  console.log("draggable marker");

  const bigIcon = new L.Icon(
    {
      iconUrl: 'marker-icon_hover.png',
      shadowUrl: 'marker-shadow.png',

      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    }
  )
  const normalIcon = new L.Icon.Default()
  const [draggable, setDraggable] = useState(false)
  const markerRef = useRef(null)
  const toggleDraggable = useCallback((dra) => {
    const marker: L.Marker = markerRef.current
    if (dra) {
      // console.log("normalIcong " + dra)
      marker.setIcon(normalIcon)
    }
    else {
      // console.log("bigIcon " + dra)
      marker.setIcon(bigIcon)
    }

    setDraggable((d) => !d)

  }, [bigIcon,normalIcon])
  const [opac, setopac] = useState(1)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        console.log("dragend hit")
        if (markerRef.current === null)
          return;
        const marker: L.Marker = markerRef.current
        if (marker != null) {
          callbck(marker.getLatLng())
        }
      },
      click() {
        toggleDraggable(draggable)
      },
      mouseover() {
        setopac(0.5)
      },
      mouseout() {
        setopac(1)
      }
    }),
    [draggable,callbck],
  )

  const mm = <Marker
    draggable={draggable}
    eventHandlers={eventHandlers}
    position={posi}
    ref={markerRef}
    opacity={opac}
  >
  </Marker>;
  return mm;
}

