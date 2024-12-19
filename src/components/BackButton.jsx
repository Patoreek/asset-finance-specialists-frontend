import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = ({ to = null }) => {
  const navigate = useNavigate();

  const backHandler = () => {
    const referrer = document.referrer;
    const sameDomain = referrer && referrer.startsWith(window.location.origin);

    if (to !== null && to !== undefined) {
      navigate(to);
    } else if (sameDomain && window.history.length > 1) {
      navigate(-1);
    }
  };

  return (
    <Button className="" onClick={backHandler}>
      Back
    </Button>
  );
};

export default BackButton;
