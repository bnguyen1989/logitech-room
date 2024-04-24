import React, { useState } from "react";
import s from "./ImageGallery.module.scss";

interface PropsI {
  images: string[];
}

export const ImageGallery: React.FC<PropsI> = (props) => {
  const { images } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={s.container}>
      <div className={s.gallerySlide}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={
              index === activeIndex
                ? `${s.slide} ${s.active}`
                : s.slide
            }
          />
        ))}
        <button className={s.prev} onClick={handlePrev}>
          &#10094;
        </button>
        <button className={s.next} onClick={handleNext}>
          &#10095;
        </button>
      </div>
      <div className={s.dotContainer}>
        {images.map((_, index) => (
          <span
            key={index}
            className={
              index === activeIndex
                ? `${s.dot} ${s.active}`
                : s.dot
            }
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
