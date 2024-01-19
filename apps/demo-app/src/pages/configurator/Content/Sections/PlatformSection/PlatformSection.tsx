import { useState } from 'react';

import LogoGoogle from '../../../../../assets/images/platform/google.jpg';
import LogoMS from '../../../../../assets/images/platform/microsoft.jpg';
import DeviceMS from '../../../../../assets/images/platform/microsoft_device.jpg';
import LogoZoom from '../../../../../assets/images/platform/zoom.jpg';
import { CardContainer } from '../../../../../components/CardContainer/CardContainer.tsx';
import s from './PlatformSection.module.scss';

const platformData = [
  {
    logo: LogoGoogle,
    image: DeviceMS,
    title: 'Google Meet Room'
  },
  {
    logo: LogoMS,
    image: DeviceMS,
    title: 'Microsoft Teams Room'
  },
  {
    logo: LogoZoom,
    image: DeviceMS,
    title: 'Zoom Room'
  }
];

interface PlatformDataI {
  logo: string;
  image: string;
  title: string;
}

export const PlatformSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<PlatformDataI>();

  const handleClick = (item: PlatformDataI) => {
    if (activeCard === item) {
      setActiveCard(undefined);
      return;
    }
    setActiveCard(item);
  };

  const isDisabled = (item: PlatformDataI) => {
    if (!activeCard) {
      return false;
    }
    return activeCard.title !== item.title;
  };
  return (
    <div className={s.container}>
      {platformData.map((item, index) => (
        <CardContainer
          key={index}
          onClick={() => handleClick(item)}
          active={activeCard?.title === item.title}
          disabled={isDisabled(item)}
        >
          <div className={s.logo}>
            <img src={item.logo} alt="logo_ms" />
          </div>

          <div className={s.image}>
            <img src={item.image} alt="image" />
          </div>

          <div className={s.title}>{item.title}</div>
        </CardContainer>
      ))}
    </div>
  );
};
