import React from "react";
import s from "./Content.module.scss";
import ImageItem from "../../../assets/images/pages/details/item.png";
import { Section } from "./Section/Section";

const dataSection = [
  {
    title: "Conference Camera",
    data: [
      {
        title: "large room bundle",
        subtitle: "Touch controller for workplace collaboration",
        image: ImageItem,
        partNumber: "Graphite : 960-000000",
        count: 1,
        amount: "$ 0.000.00",
      },
    ],
  },
  {
    title: "Mounting Extensions",
    data: [
      {
        title: "RALLY MIC POD",
        subtitle: "Modular microphones with RightSound™ for Logitech Rally",
        image: ImageItem,
        partNumber: "Graphite : 960-000000",
        count: 1,
        amount: "$ 0.000.00",
      },
    ],
  },
  {
    title: "Mounting",
    data: [
      {
        title: "Rally Mounting Kit",
        subtitle: "Custom mounts for a sleek installation and secure cabling",
        image: ImageItem,
        partNumber: "Graphite : 960-000000",
        count: 1,
        amount: "$ 0.000.00",
      },
      {
        title: "lorem ipsum",
        subtitle: "Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem",
        image: ImageItem,
        partNumber: "Graphite : 960-000000",
        count: 1,
        amount: "$ 0.000.00",
      },
    ],
  },
  {
    title: "Cabling",
    data: [
      {
        title: "Logitech Strong USB 25M",
        subtitle: "SuperSpeed USB 10 Gbps cable",
        image: ImageItem,
        partNumber: "Graphite : 960-000000",
        count: 1,
        amount: "$ 0.000.00",
      },
    ],
  },
  {
    title: "Software & Services",
    data: [
      {
        title: "sync portal",
        subtitle:
          "Logitech Sync makes it easy to support large-scale video deployments while minimizing site visits and trouble tickets—all from a simple browser-based interface.",
        image: ImageItem,
      },
      {
        title: "ONE YEAR EXTENDED WARRANTY",
        subtitle:
          "The purchase of an extended warranty adds one year to the original Logitech manufacturer's two year warranty, which provides you the peace of mind that the video collaboration room systems you purchase from Logitech are covered for the same three years as the Lenovo Tiny compute.",
        image: ImageItem,
      },
    ],
  },
];

export const Content: React.FC = () => {
  return (
    <div className={s.container}>
      {dataSection.map((item, index) => (
        <Section key={index} {...item} />
      ))}
    </div>
  );
};
