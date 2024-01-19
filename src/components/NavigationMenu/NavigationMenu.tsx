import { useState } from 'react';

import s from './NavigationMenu.module.scss';

const dataMenu = [
  { title: 'Choose Platform', active: true },
  { title: 'Room Size', active: false },
  { title: 'Lorem Services', active: false },
  { title: 'Conference Camera', active: false },
  { title: 'Audio Extensions & Accessories', active: false },
  { title: 'Meeting Controller & Add On', active: false },
  { title: 'Video Accessories', active: false },
  { title: 'Software & Services', active: false }
];

export const NavigationMenu: React.FC = () => {
  const [data, setData] = useState(dataMenu);

  const handleClick = (index: number) => {
    setData(
      data.map((item, i) => {
        if (i === index) {
          return { ...item, active: true };
        } else {
          return { ...item, active: false };
        }
      })
    );
  };
  return (
    <div className={s.container}>
      <div className={s.name}>Room Size</div>
      <div className={s.menu}>
        {data.map((item, index) => (
          <div key={index} className={s.wrapper}>
            <div className={s.item}>
              <div
                className={item.active ? s.out_circle_active : s.out_circle}
                onClick={() => handleClick(index)}
              >
                <div
                  className={item.active ? s.in_circle_active : s.in_circle}
                ></div>
              </div>
            </div>
            {index !== dataMenu.length - 1 && <div className={s.divider}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
