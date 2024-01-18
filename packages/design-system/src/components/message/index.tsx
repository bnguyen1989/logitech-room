import type React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import InfoIcon from '../../icons/Info.jsx';
import themes from '../../theme.js';
import { IconWrapper, Wrapper } from './message.styles.js';

interface ActiveMessages {
  key: string;
  element: HTMLDivElement;
}

interface MessageConfig {
  top?: number;
  duration?: number;
  maxCount?: number;
}

interface MessageComponentProps {
  content: string | React.ReactNode;
}

const MESSAGE_EL_ID = 'tk-messages-container';

const activeMessages: Array<ActiveMessages> = [];
const messagesConfig: MessageConfig = {
  top: 12,
  duration: undefined,
  maxCount: 3
};

const getMessagesEl = () => {
  const el = document.getElementById(MESSAGE_EL_ID);
  if (el) return el;

  const newEl = document.createElement('div');
  newEl.setAttribute('id', MESSAGE_EL_ID);
  newEl.style.position = 'fixed';
  newEl.style.top = '0px';
  newEl.style.left = '50%';
  newEl.style.transform = 'translateX(-50%)';
  newEl.style.zIndex = '10';

  document.body.appendChild(newEl);

  return newEl;
};

const config = (updatedConfig: MessageConfig) => {
  if (!updatedConfig) return;
  Object.assign(messagesConfig, updatedConfig);
};

export const MessageComponent = (props: MessageComponentProps) => {
  const { content } = props;
  if (!content) return null;
  return (
    <ThemeProvider theme={themes.default}>
      <Wrapper>
        <IconWrapper>
          <InfoIcon size="16px" />
        </IconWrapper>
        <div>{content}</div>
      </Wrapper>
    </ThemeProvider>
  );
};

const info = (content: string | React.ReactNode) => {
  const messagesEl = getMessagesEl();

  const id = `tk-message-${Date.now()}`;

  const newMessageEl = document.createElement('div');
  newMessageEl.id = id;
  messagesEl.appendChild(newMessageEl);

  while (activeMessages.length + 1 > (messagesConfig?.maxCount || 3)) {
    unmountComponentAtNode(activeMessages[0].element);
    activeMessages[0].element.remove();
    activeMessages.shift();
  }

  activeMessages.push({
    key: id,
    element: newMessageEl
  });

  render(<MessageComponent content={content} />, newMessageEl);

  setTimeout(() => {
    const messageToRemove = activeMessages.find((el) => el.key === id);
    if (!messageToRemove) return;
    unmountComponentAtNode(newMessageEl);
    messageToRemove.element.remove();
    activeMessages.shift();
  }, (messagesConfig.duration || 2 + (typeof content === 'string' ? 0.05 * content.length : 0.5)) * 1000);
};

const message = {
  config,
  info
};

export default message;
