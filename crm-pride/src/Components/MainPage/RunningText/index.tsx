import { useEffect, useState } from "react";
import { RunningText, RunningTextWrapper } from "../styles";

export const RunningTextComponent: React.FC = () => {
  const [transform, setTransform] = useState(
    "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)"
  );

  useEffect(() => {
    const handleScroll = () => {
      const runningText = document.getElementById("running-text");
      if (runningText) {
        const rect = runningText.getBoundingClientRect();
        const scrollTop = rect.top;
        setTransform(
          `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${-scrollTop}, 0, 0, 1)`
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <RunningTextWrapper id="running-text-wrapper">
      <RunningText id="running-text" transform={transform}>
        Игры ведутся не на деньги и не являются азартными!
      </RunningText>
    </RunningTextWrapper>
  );
};
