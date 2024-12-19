import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const navigate = useNavigate();

  const createNewHandler = () => {
    console.log("create new");
    navigate("/application/new");
  };
  return (
    <div className="max-w-7xl w-full mx-auto bg-green-100 py-10 px-2">
      <div className="flex justify-between items-center">
        <h1>Applications</h1>
        <Button
          className=" bg-blue-500 hover:bg-blue-600"
          onClick={createNewHandler}
        >
          Create New
        </Button>
      </div>
    </div>
  );
};

export default Applications;
