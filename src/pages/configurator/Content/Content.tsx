import s from './Content.module.scss'
import { Button } from '../../../components/Buttons/Button/Button'
import { useAppSelector } from '../../../hooks/redux'
import { getActiveStep, getNavigationStepData } from '../../../store/slices/ui/selectors/selectors'
import React from 'react'
import { useDispatch } from 'react-redux'
import { changeActiveStep } from '../../../store/slices/ui/Ui.slice'


interface PropsI {}
export const Content: React.FC<PropsI> = () => {
	const dispatch = useDispatch();
	const activeStep = useAppSelector(getActiveStep);
	const { prevStep, nextStep } = useAppSelector(getNavigationStepData);

	const handleNext = () => {
		if(!nextStep) return;
		dispatch(changeActiveStep(nextStep));
	};

	const handleBack = () => {
		if(!prevStep) {
			dispatch(changeActiveStep(null));
			return;
		}
		dispatch(changeActiveStep(prevStep));
	};

	return (
		<div className={s.container}>
			{activeStep?.component ? React.createElement(activeStep.component): null}
			<div className={s.actions}>
				<Button onClick={handleBack} text='Back' />
				<Button onClick={handleNext} text='Next' variant='contained' />
			</div>
		</div>
	);
};
