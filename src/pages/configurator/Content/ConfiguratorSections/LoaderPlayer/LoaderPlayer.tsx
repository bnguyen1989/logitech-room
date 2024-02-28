import React from 'react';
import s from './LoaderPlayer.module.scss';
import { Loader } from '../../../../../components/Loader/Loader'
import { useAppSelector } from '../../../../../hooks/redux'
import { getIsProcessing } from '../../../../../store/slices/configurator/selectors/selectors'


export const LoaderPlayer: React.FC = () => {
	const isProcessing = useAppSelector(getIsProcessing);

	if (!isProcessing) return null;
	return (
		<div className={s.container}>
			<Loader text={"Loading Your Player"} />
		</div>
	);
}