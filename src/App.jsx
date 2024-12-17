import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="bg-gray-50">
      <div className="flex justify-center items-center h-screen">
        <Button>Shadcn/ui integrated.</Button>
      </div>
    </div>
  );
}

export default App;
