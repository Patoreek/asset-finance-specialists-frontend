import React from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";

const Application = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl w-full mx-auto min-h-full h-auto bg-gray-100 py-10 px-2">
      <ApplicationForm id={id} />
    </div>
  );
};

export default Application;
