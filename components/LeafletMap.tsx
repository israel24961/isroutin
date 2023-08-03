//@ts-nocheck
"use client"
import { useRef, useState, useMemo, useEffect, StrictMode, useCallback } from 'react';
import { Tooltip, useMap, MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { CopyBlock, dracula } from "react-code-blocks"
import Cookies from 'universal-cookie';

function Coolbutton({ msgs, clicks }: { msgs: string[], clicks: any[] }) {
  let buttons = []
  for (let i = 0; i < msgs.length; i++) {
    buttons.push(
      <button key={i} onClick={clicks[i]} className="group duration-500 hover:scale-125 rounded-lg border-1 border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-indigo-800/30">
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
  const [AMarkers, setAMarkers] = useState(localStorage.getItem('bss')?JSON.parse(localStorage.getItem('bss')):[])
  useEffect(() => {
    localStorage.setItem('bss', JSON.stringify(AMarkers));
  }, [AMarkers]);
  const [showcircles, setshowcircles] = useState(false)
  const add_bs = (np) => {
    console.log(np ?? leaf.current.getCenter())

    setAMarkers(AMarkers.concat([{ posi: leaf.current.getCenter(), circle: 1000 }]))
    AMarkers.forEach(element => {
      console.log(element)
    });
  }
  const mod_PosMarker = (id, pos) => {
    setAMarkers(AMarkers.map(
      (c, i) => {
        if (i === id) {
          return { posi: pos, circle: c.circle }
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
    if (showcircles) {
      return <Mycirclemarker key={i} posi={obj.posi} radius={obj.circle} callbck={(a) => { mod_PosMarker(i, a) }} map={leaf} />
    }
    else
      return <DraggableMarker key={i} posi={obj.posi} callbck={(p) => mod_PosMarker(i, p)} />
  })

  let basesString = ""
  for (let index = 0; index < AMarkers.length; index++) {
    basesString += "\n"
    basesString += JSON.stringify({ ...AMarkers[index].posi, radius: AMarkers[index].circle })

  }
  const resp = (
    <StrictMode>
      <MapContainer className={className} ref={leaf} id="map" center={position} zoom={13} style={{ filter: dark ? 'invert(1)' : 'invert(0)', width: '100%', height: '60vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {htmlAMarkers}
      </MapContainer>
      <Coolbutton msgs={["Add a base station", "Undo add", showcircles ? "Show markers" : "Show ranges",
        "Reset base stations"]}
        clicks={[add_bs, mod_RemoveLast, () => { setshowcircles((d) => !d) }, () => { setAMarkers(new Array()) }]} />
      <div className={basesString ? "visible" : "collapse"}>
        <CopyBlock
          text={basesString}
          language="json"
          theme={dracula}
          showLineNumbers={true}
          startingLineNumber={0}
        />
      </div>



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
function Mycirclemarker({ posi, radius, callbck, map }) {
  const [draggable, setdraggable] = useState(0)
  const circ = useRef(null)

  function update_pos(pos) {
    console.log(circ);

    circ.current.setLatLng(pos)
  }
  const eH = useMemo(
    () => ({
      mousemove(e) {
        if (draggable) {
          console.log("mousemove " + e.latlng)
          update_pos(e.latlng)
        }
      },
      click(e) {
        setdraggable((d) => !d)
        callbck(e.latlng)

      }
    }),
    [draggable, callbck],
  )
  return (<Circle ref={circ} className="opacity-50 hover:opacity-100" eventHandlers={eH} center={posi} pathOptions={{ color: 'red' }} radius={radius} >
  </Circle>)
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
    if (curIcon === bigIcon) {
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

