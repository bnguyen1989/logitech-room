import { useAsset } from "@threekit/react-three-fiber";
import { Configuration } from '@threekit/rest-api';
import { GLTFNode, NodeMatcher } from "./GLTFNode.js";
import { Product } from "./Product.js";
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { changeStatusBuilding } from '../../store/slices/configurator/Configurator.slice.js'


export type RoomProps = {
    roomAssetId: string;
    attachNodeNameToAssetId: Record<string, string>;
    configuration?: Configuration;
};

export const Room: React.FC<RoomProps> = ({ roomAssetId, attachNodeNameToAssetId, configuration }) => {
    const dispatch = useDispatch();
    const gltf = useAsset({ assetId: roomAssetId, configuration });

    useEffect(() => {
        if(!gltf) return;
        dispatch(changeStatusBuilding(false));
    }, [gltf]);

    console.log('gltf', gltf);
    

    const nodeMatchers: NodeMatcher[] = [
        ( threeNode ) => {
            console.log(threeNode.name);
            
            if (threeNode.name in attachNodeNameToAssetId) {
                return <Product productAssetId={attachNodeNameToAssetId[threeNode.name]} />
            }
            return undefined;
        }
    ];
    
    return (
        <GLTFNode threeNode={gltf.scene} nodeMatchers={nodeMatchers}/>
    )
}