import { useAsset } from "@threekit/react-three-fiber";

export type ProductProps = {
    productAssetId: string;
};

export const Product: React.FC<ProductProps> = ({ productAssetId }) => {
    const gltf = useAsset({ assetId: productAssetId });
    return (
        <primitive object={gltf.scene} />
    )
}