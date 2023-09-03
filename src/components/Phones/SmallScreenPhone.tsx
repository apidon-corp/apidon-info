import {
  titleNames,
  titleNamesStateAtom,
  videoSources,
} from "@/atoms/titleNameStateAtom";
import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

type Props = {
  title: titleNames;
};

export default function SmallScreenPhone({ title }: Props) {
  const [locationOfPhone, setLocationOfPhone] = useState("100%");
  const [opacity, setOpacity] = useState(0);

  const [viewportHeight, setViewportHeight] = useState("0px");

  const titleNameStateValue = useRecoilValue(titleNamesStateAtom);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (titleNameStateValue !== title) {
      videoRef.current.pause();
    } else {
      handlePlayVideo(videoRef.current);
    }
  }, [titleNameStateValue]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.setAttribute("muted", "1");
  }, []);

  const handlePlayVideo = async (videoRefCurrent: HTMLVideoElement) => {
    try {
      await videoRefCurrent.play();
    } catch (error) {
      // not important.
    }
  };

  const handleScroll = () => {
    setViewportHeight(`${visualViewport?.height}px`);
    const windowHeight = window.innerHeight;
    const totalScrollableHeight =
      document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const ratio = scrolled / totalScrollableHeight;

    let locationNumeric: number = 0;

    if (ratio <= 0.084) {
      locationNumeric = -2380.9523809523807 * ratio + 100;
    } else if (ratio <= 0.25) {
      locationNumeric = 2409.6385542168678 * ratio - 502.40963855421694;
    } else if (ratio <= 0.417) {
      locationNumeric = -2439.024390243904 * ratio + 917.0731707317078;
    } else if (ratio <= 0.583) {
      locationNumeric = 2597.402597402599 * ratio - 1414.2857142857151;
    } else if (ratio <= 0.75) {
      locationNumeric = -2298.8505747126446 * ratio + 1624.1379310344835;
    } else if (ratio <= 0.917) {
      locationNumeric = 2597.402597402595 * ratio - 2281.8181818181797;
    } else {
      locationNumeric = 101;
    }

    const location = `${locationNumeric}%`;
    const opacityNumeric = -0.01 * Math.abs(locationNumeric) + 1;

    if (Math.abs(locationNumeric) > 100) return;

    setLocationOfPhone(location);
    setOpacity(opacityNumeric);
  };

  return (
    <Flex
      justify="center"
      width="100%"
      height={viewportHeight}
      position="fixed"
      transform="auto"
      transitionDuration="150ms,150ms,300ms"
      translateX={locationOfPhone}
      transitionProperty="transform, opacity, height"
      transitionTimingFunction="linear"
      opacity={opacity}
      userSelect="none"
      hidden={title !== titleNameStateValue}
      zIndex={2}
    >
      <video
        ref={videoRef}
        muted
        style={{
          height: "100%",
        }}
        playsInline
        loop={title !== "welcome"}
        autoPlay
      >
        <source src={videoSources[title]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Flex>
  );
}