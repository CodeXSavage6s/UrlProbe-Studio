import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Overview from "@/pages/Overview";
import MetaProbeExtract from "@/pages/MetaProbeExtract";
import FetchFence from "@/pages/FetchFence";
import Ecosystem from "@/pages/Ecosystem";

// The route table. A library owns a folder of routes (/metaprobe/...), so adding
// a function to a library means adding one <Route> here plus one entry in
// config/navigation.js.
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Overview />} />

        <Route path="metaprobe">
          <Route index element={<Navigate to="extract" replace />} />
          <Route path="extract" element={<MetaProbeExtract />} />
        </Route>

        <Route path="fetchfence" element={<FetchFence />} />
        <Route path="ecosystem" element={<Ecosystem />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
