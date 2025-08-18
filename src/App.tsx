import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatScreen } from "./screens/chat/ChatScreen";
import { KaztransLayout } from "./components/kaztrans/KaztransLayout";
import { KaztransHome } from "./components/kaztrans/KaztransHome";
import { KaztransChat } from "./components/kaztrans/KaztransChat";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <div className="relative">
        <Routes>
          <Route path="/" element={<ChatScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          
          {/* КазТрансОйл роуты */}
          <Route path="/kaztrans" element={<KaztransLayout />}>
            <Route index element={<KaztransHome />} />
            <Route path=":agentId" element={<KaztransChat />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
