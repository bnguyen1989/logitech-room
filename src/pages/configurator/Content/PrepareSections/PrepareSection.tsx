import { useDispatch } from 'react-redux'
import { CardPlatform } from '../../../../components/Cards/CardPlatform/CardPlatform'
import { CardRoom } from '../../../../components/Cards/CardRoom/CardRoom'
import { CardService } from '../../../../components/Cards/CardService/CardService'
import { useAppSelector } from '../../../../hooks/redux'
import { getActiveStep } from '../../../../store/slices/ui/selectors/selectors'
import { StepCardType, StepI, StepName } from '../../../../store/slices/ui/type'
import s from './PrepareSection.module.scss';
import { changeActiveCard } from '../../../../store/slices/ui/Ui.slice'

export const PrepareSection: React.FC = () => {
	const dispatch = useDispatch();
	const activeStep: null | StepI<StepCardType> = useAppSelector(getActiveStep);

	if (!activeStep) return null;

	console.log('activeStep', activeStep);
	

	const handleClick = (card: StepCardType) => {
		if (card.title === activeStep.currentCard?.title) {
			dispatch(changeActiveCard(undefined));
			return;
		}
		dispatch(changeActiveCard(card));
	};

	const getCardComponent = (card: StepCardType, index: number) => {
		const onClick = () => handleClick(card);
		const isActive = activeStep.currentCard?.title === card.title;
		const isDisabled = activeStep.currentCard && !isActive;
		if(card.key === StepName.Platform) {
			return <CardPlatform key={index} data={card} onClick={onClick} active={isActive} disabled={isDisabled} />
		}
		if(card.key === StepName.RoomSize) {
			return <CardRoom key={index} data={card} onClick={onClick} active={isActive} disabled={isDisabled} />;
		}
		if(card.key === StepName.Services) {
			return <CardService key={index} data={card} onClick={onClick} active={isActive} disabled={isDisabled} />;
		}
		return null;

	};
	return (
		<div className={s.container}>
			{activeStep.cards.map((card, index) => (getCardComponent(card, index)))}
		</div>
	)
}