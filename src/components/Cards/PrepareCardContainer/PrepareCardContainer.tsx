import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/redux";
import {
  getActiveStep,
  getCardByKeyPermission,
  getIsSelectedCardByKeyPermission,
  getSelectedCardsByStep,
} from "../../../store/slices/ui/selectors/selectors";
import { CardContainer } from "../CardContainer/CardContainer";
import {
  addActiveCard,
  removeActiveCard,
} from "../../../store/slices/ui/Ui.slice";
import { Application } from "../../../models/Application";

declare const app: Application;

interface PropsI {
  keyItemPermission: string;
  children: React.ReactNode;
  onSelectedAnalytics: () => void;
  isPadding?: boolean;
}
export const PrepareCardContainer: React.FC<PropsI> = (props) => {
  const { keyItemPermission, children, isPadding } = props;
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const isActiveCard = useAppSelector(
    getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
  );
  const selectCards = useAppSelector(getSelectedCardsByStep(activeStep));
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );

  const handleClick = () => {
    const { attributeName, threekitItems } = card.dataThreekit;
    const threekitAsset = threekitItems[card.keyPermission];

    props.onSelectedAnalytics();

    if (!attributeName.length) {
      if (isActiveCard) {
        dispatch(removeActiveCard({ key: card.keyPermission }));
        return;
      }
      dispatch(addActiveCard({ key: card.keyPermission }));
      return;
    }

    if (isActiveCard) {
      app.removeItem(attributeName, card.keyPermission);
      return;
    }

    app.addItemConfiguration(
      attributeName,
      threekitAsset.id,
      card.keyPermission
    );
  };

  const isDisabled = !!selectCards.length && !isActiveCard;

  return (
    <CardContainer
      onClick={handleClick}
      active={isActiveCard}
      disabled={isDisabled}
      isFullClick
      isPadding={isPadding}
    >
      {children}
    </CardContainer>
  );
};
