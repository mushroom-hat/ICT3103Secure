import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Singapore Insitute of Technolohgy Donation Drive",
          "Looking for free items",
          "Charity",
          "Looking for Donations",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
