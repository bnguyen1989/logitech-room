import { RootState } from '../../../'

export const getIsBuilding = (state: RootState) => state.configurator.isBuilding;

export const getShowDimensions = (state: RootState) => state.configurator.showDimensions;

export const getConfiguration = (state: RootState) => state.configurator.configuration;