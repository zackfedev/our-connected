"use client";

import { memo } from "react";
import { TypeAnimation } from "react-type-animation";

const AnimateTyping = () => {
  return (
    <>
      <h3 className='text-[6.5rem]'>Create.</h3>
      <h3 className='text-[7rem]'>Post.</h3>
      <TypeAnimation
        sequence={["Inteaction", 2000, "Interaction"]}
        wrapper='span'
        cursor
        repeat={1}
        className='text-white font-semibold text-[8rem]'
      />
    </>
  );
};

const AnimateType = memo(AnimateTyping);

export default AnimateType;