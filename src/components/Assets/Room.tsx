import { useAsset } from "@threekit/react-three-fiber";
import { GLTFNode, NodeMatcher } from "./GLTFNode.js";
import { Product } from "./Product.js";


export type RoomProps = {
    roomAssetId: string;
    attachNodeNameToAssetId: Record<string, string>;
};

export const Room: React.FC<RoomProps> = ({ roomAssetId, attachNodeNameToAssetId }) => {
    const gltf = useAsset({ assetId: roomAssetId });

    const nodeMatchers: NodeMatcher[] = [
        ( threeNode ) => {
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