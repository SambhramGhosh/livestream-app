import React, { useEffect, useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import OverlayEditor from "./components/OverlayEditor";
import { overlaysApi } from "./api";
import "./styles.css";



export default function App() {
const [overlays, setOverlays] = useState([])
const [loading, setLoading] = useState(true)
const [selected, setSelected] = useState(null)


async function load() {
try {
setLoading(true)
const res = await overlaysApi.list()
setOverlays(res.data || [])
} catch (err) {
console.error('Failed to load overlays', err)
setOverlays([])
} finally {
setLoading(false)
}
}


useEffect(() => { load() }, [])


const handleCreate = async (payload) => {
const res = await overlaysApi.create(payload)
// API returns { id }
const newId = res.data.id
const created = { ...payload, id: newId }
setOverlays((s) => [...s, created])
return created
}


const handleUpdate = async (id, payload) => {
const res = await overlaysApi.update(id, payload)
// backend returns updated doc
setOverlays((s) => s.map(o => o.id === id ? res.data : o))
return res.data
}


const handleDelete = async (id) => {
await overlaysApi.remove(id)
setOverlays((s) => s.filter(o => o.id !== id))
}


return (
<div className="app-root">
<header className="header">
<h1>Livestream with Overlays</h1>
</header>


<main className="main">
<div className="player-column">
<VideoPlayer
overlays={overlays}
onSelectOverlay={(o) => setSelected(o)}
onUpdateOverlay={async (id, update) => {
await handleUpdate(id, update)
}}
/>
</div>


<aside className="side-column">
<OverlayEditor
overlays={overlays}
loading={loading}
onCreate={handleCreate}
onUpdate={handleUpdate}
onDelete={handleDelete}
selected={selected}
onSelect={(o) => setSelected(o)}
/>
</aside>
</main>


<footer className="footer">
<small><a href="https://www.sambhramghosh.in">Sambhram Ghosh</a></small>
</footer>
</div>
)
}