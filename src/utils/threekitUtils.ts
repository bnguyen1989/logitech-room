import { Application } from '../models/Application'
import { ThreekitDataT } from '../models/configurator/type'
import { ThreekitService } from '../services/Threekit/ThreekitService'

declare const app: Application;

export const ConfigData = {
	host: 'preview.threekit.com',
  orgId: '04015bb6-401d-47f8-97c0-dd6fa759c441',
  publicToken: 'b107f4dd-51d7-48f7-8fa3-c76dcf663f8a',
	assetId: '32ba8c20-d54a-46d2-a0bb-0339c71e7dc6'
};


export const initThreekitData = async () => {
	const assetId = app.currentConfigurator.assetId;
	app.eventEmitter.emit('processInitThreekitData', true);
	new ThreekitService().getDataAssetById(assetId).then((data) => {
		const configurator = app.currentConfigurator.getSnapshot();
		configurator.threekitData = data as ThreekitDataT;
		app.currentConfigurator = configurator;
		app.eventEmitter.emit('threekitDataInitialized', configurator);
		app.eventEmitter.emit('processInitThreekitData', false);
	});
};

export const getRoomAssetId = (platform: string, roomSize: string) => {
	console.log('getRoomAssetId', platform, roomSize);

	return '32ba8c20-d54a-46d2-a0bb-0339c71e7dc6';
}