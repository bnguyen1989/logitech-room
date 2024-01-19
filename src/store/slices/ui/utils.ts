import { PlatformSection } from '../../../pages/configurator/Content/Sections/PlatformSection/PlatformSection'
import { RoomSection } from '../../../pages/configurator/Content/Sections/RoomSection/RoomSection'
import { ServicesSection } from '../../../pages/configurator/Content/Sections/ServicesSection/ServicesSection'
import { StepI } from './type'


export const getInitStepData = (): Array<StepI> => {
	return [
		{ 
			name: 'Choose Platform',
			title: 'What is your primary video conferencing platform?',
			subtitle: 'Choose the video conferencing platform your organization uses most often.',
			component: PlatformSection
		},
		{ 
			name: 'Room Size',
			title: 'How many seats are in the space?',
			subtitle: 'Choose the option that best matches the seating capacity of your room.',
			component: RoomSection
		},
		{ 
			name: 'Lorem Services',
			title: 'Lorem ipsum dolor sit amet adipiscing elit?',
			subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
			component: ServicesSection
		},
		{ 
			name: 'Conference Camera',
			title: 'Choose your conference camera.',
			subtitle: 'These recommendations are based on your previous answers.',
		},
		{ 
			name: 'Audio Extensions & Accessories',
			title: 'Add room-filling audio.',
			subtitle: 'Choose from the following audio extensions to make sure everyone can hear and be heard clearly. ' 
		},
		{ 
			name: 'Meeting Controller & Add On',
			title: 'Choose your meeting controller.',
			subtitle: 'Select a controller that directly connects to the meeting room PC or video bar, or one that is untethered from the room system.'
		},
		{ 
			name: 'Video Accessories',
			title: 'Pick your video conferencing accessories.',
			subtitle: 'Add features and flexibility with these video conferencing accessories.'
		},
		{ 
			name: 'Software & Services',
			title: 'Let’s finish up by selecting your software and services.',
			subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		}
	]
}