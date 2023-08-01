//@ts-nocheck
"use client"
import { useRef, useState, useMemo, StrictMode, useCallback } from 'react';
import { Tooltip, useMap, MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

function Coolbutton({ msgs, clicks }: { msgs: string[], clicks: any[] }) {
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
//     <DraggableMarker posi={position : } />
//   </>);
// }

export default function LeafletMap({ dark, className }: { dark: boolean, className: string }) {
  console.log("Leaf called")
  const position: [number, number] = [51.505, -0.09]; // Replace with your desired initial coordinates
  const leaf: L.Map = useRef(null)
  const [AMarkers, setAMarkers] = useState(new Array)

  const add_c = () => {
    console.log(leaf.current.getCenter())
    setAMarkers(AMarkers.map(
      (c, i) => {
        if (i === AMarkers.length - 1) {
          return { posi: c.posi, circle:1000 }
        } else {
          return c;
        }
      }
    ));
    AMarkers.forEach(element => {
      console.log(element)
    });
  }
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
          return { posi: pos }
        } else {
          return c;
        }
      }
    ));
  }
  const mod_RemoveLast = () => {
    setAMarkers(AMarkers.slice(0, AMarkers.length - 1));
  }
  const htmlAMarkers = AMarkers.map((obj, i) => {
    if (obj.circle != null) {
      return <CircleMarker key={i} posi={obj.posi} radius={obj.circle} callbck={() => "xd"} />
    }
    else
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
      <Coolbutton msgs={["Add a base station", "Undo add", "Add coverage", "Reset base stations"]} clicks={[add_bs, mod_RemoveLast, add_c, go_to_madrid]} />
    </StrictMode>
  );
  return resp;
};
// icon → draggable icon → circle
//  ↑                         ↓
//  --------------------------
function NormalMarker({ posi, callbck }) {
  <Marker
    draggable={draggable}
    eventHandlers={eventHandlers}
    position={posi}
    ref={markerRef}
    opacity={opac}
  >
  </Marker>;

}
function CircleMarker({ posi, radius, callbck }) {
  return <Circle center={posi} pathOptions={{ color: 'red' }} radius={radius} />
}
function DraggableMarker({ posi, callbck }) {

  const normalIcon = new L.Icon(
    {
      iconUrl: 'marker-icon.png',
      shadowUrl: 'marker-shadow.png',
      className: "hover:opacity-50",

      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    }
  )
  const [curIcon, setcurIcon] = useState(normalIcon)
  const bigIcon = new L.Icon(
    {
      iconUrl: 'marker-icon.png',
      shadowUrl: 'marker-shadow.png',
      className: "hover:opacity-50 animate-pulse",

      // iconSize: [45, 60 ],
      // iconAnchor: [12, 41],
      // popupAnchor: [1, -34],
      // tooltipAnchor: [16, -28],
      // shadowSize: [41, 41]
    }
  )
  const [draggable, setDraggable] = useState(false)
  const markerRef = useRef(null)
  const toggleDraggable = useCallback((dra) => {
    if (dra) {
      setcurIcon(normalIcon)
    }
    else {
      setcurIcon(bigIcon)
    }
    setDraggable((d) => !d)

  }, [curIcon])
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        console.log("dragend hit")
        if (markerRef.current === null)
          return;
        const marker: L.Marker = markerRef.current
        console.log(marker.getLatLng());

        if (marker != null) {
          callbck(marker.getLatLng())
        }
      },
      click() {
        toggleDraggable(draggable)
      },
      // mouseover() {
      //   setopac(0.5)
      // },
      // mouseout() {
      //   setopac(1)
      // }
    }),
    [draggable, callbck],
  )
  const mm = <Marker
    draggable={draggable}
    eventHandlers={eventHandlers}
    position={posi}
    ref={markerRef}
    icon={curIcon}><Tooltip>
      {draggable ? "You can move this now" : "Click to enable movement"}
    </Tooltip></Marker>;
  return mm;
}

