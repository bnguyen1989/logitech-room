import {
  ProductLayout,
  Player,
  PortalToElement,
  FlatForm,
} from '@threekit-tools/treble';

const products = {
  'product-identifier': { preview: { assetId: '32ba8c20-d54a-46d2-a0bb-0339c71e7dc6' } }
};

export default function Product() {
  return (
    <ProductLayout products={products}>
      <div className="tk-treble-player">
        <Player />
      </div>
      <PortalToElement to="tk-treble-form" strict={true}>
        <FlatForm />
      </PortalToElement>
    </ProductLayout>
  );
}
