import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();

  const backHandler = () => {
    const referrer = document.referrer;
    const sameDomain = referrer && referrer.startsWith(window.location.origin);

    if (sameDomain && window.history.length > 1) {
      navigate(-1);
    } else {
      const backToPage = window.location.pathname.includes("application")
        ? "/applications"
        : "/";

      navigate(backToPage);
    }
  };

  return (
    <Button className="" onClick={backHandler}>
      Back
    </Button>
  );
};

export default BackButton;
