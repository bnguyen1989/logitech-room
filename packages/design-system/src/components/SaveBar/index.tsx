import Button, { BUTTON_TYPES } from '../Button/index.js';
import Switch from '../Switch/index.js';
import { AutoSaveLabel, SaveButtonWrapper, Wrapper } from './saveBar.styles.js';

export enum Status {
  SAVING = 'saving',
  SAVED = 'saved',
  UNSAVED = 'unsaved'
}

const messages = {
  [Status.SAVING]: 'Saving...',
  [Status.SAVED]: 'All changes saved',
  [Status.UNSAVED]: 'Unsaved changes'
};

interface SaveBarProps {
  status: Status;
  onSave: () => void;
  isSavedDisabled: boolean;
  isAutoSaveOn: boolean;
  setIsAutoSaveOn: (value: boolean) => void;
}

const SaveBar = (props: SaveBarProps) => {
  const { status, isAutoSaveOn, setIsAutoSaveOn, onSave } = props;
  return (
    <Wrapper>
      <AutoSaveLabel active={isAutoSaveOn}>AUTOSAVE</AutoSaveLabel>
      <div>
        <Switch value={isAutoSaveOn} onChange={setIsAutoSaveOn} />
      </div>
      <div>{messages[status]}</div>
      <SaveButtonWrapper show={!isAutoSaveOn}>
        <Button
          type={
            status === Status.UNSAVED
              ? BUTTON_TYPES.default
              : BUTTON_TYPES.disabled
          }
          onClick={() => onSave()}
        >
          Save
        </Button>
      </SaveButtonWrapper>
    </Wrapper>
  );
};

export default SaveBar;
